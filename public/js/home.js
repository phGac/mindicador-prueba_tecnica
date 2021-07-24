(async function() {
    Date.prototype.addDays = function(days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    /**
     * Obtiene los indicadores soportados por la api (https://mindicador.cl/)
     * y los devuelve junto con la data separada por el tipo de medida
     * 
     */
    async function getInfo() {
        let types = {};
        let measures = {};

        let data = await fetch('https://mindicador.cl/api')
                            .then(response => response.json())
                            .then((data) => {
                                delete data.autor;
                                delete data.version;
                                delete data.fecha;
                                return data;
                            });
        Object.keys(data).forEach((name) => {
            let measure = data[name].unidad_medida;
            types[ name ] = {
                name: data[name].nombre,
                measure,
                date: data[name].fecha,
                value: data[name].valor
            };
            if(! measures[ measure ])
                measures[ measure ] = [];
            measures[ measure ].push(name);
        });

        return {
            types,
            measures
        };
    }

    /**
     * Lista en la vista los tipos de indicadores, para generar un gráfico
     */
    function setTypesToGraphic() {
        Object.keys(info.types).forEach((type) => {
            let optionEl = document.createElement('option');

            optionEl.setAttribute('value', type);
            optionEl.textContent = info.types[ type ].name;

            typesEl.appendChild(optionEl);
        });
    }

    /**
     * Lista en la vista los tipos de indicadores, para poder compararlos en un gráfico
     */
    function setTypesToCompare() {
        Object.keys(info.types).forEach((type) => {
            let containerEl = document.createElement('div');
            let checkboxEl = document.createElement('input');
            let labelEl = document.createElement('label');

            containerEl.classList.add('custom-control', 'custom-checkbox', 'custom-control-inline', 'hidden');
            containerEl.setAttribute('data-measure', info.types[ type ].measure);
            checkboxEl.classList.add('custom-control-input');
            checkboxEl.setAttribute('type', 'checkbox');
            checkboxEl.setAttribute('name', type);
            checkboxEl.setAttribute('value', type);
            checkboxEl.setAttribute('id', type);
            labelEl.classList.add('custom-control-label');
            labelEl.setAttribute('for', type);
            labelEl.textContent = info.types[ type ].name;

            containerEl.appendChild(checkboxEl);
            containerEl.appendChild(labelEl);
            compareListEl.appendChild(containerEl);
        });
    }

    /**
     * Obtiene los valores de un tipo de indicador económico, según la fecha proporcionada
     * 
     * @param {string} type 
     * @param {{ from: Date, to: Date }|string|int|null} date 
     */
    async function getValuesType(type, date = null) {
        let dates = [], min_date, max_date, difference_in_days = 0;
        switch(typeof date) {
            case 'string':
                min_date = (new Date(date)).getTime();
                max_date = min_date;
                dates.push(date);
                break;
            case 'object':
                if(date == null) {
                    dates.push(date);
                    break;
                }

                min_date = date.from.getTime();
                max_date = date.to.getTime();

                const difference_in_time = max_date - min_date;
                difference_in_days = difference_in_time / (1000 * 3600 * 24);

                if(difference_in_days > 31) {
                    let yearTo = date.to.getFullYear();
                    let yearFrom = date.from.getFullYear();
                    if(difference_in_days <= 365) {
                        if(yearFrom != yearTo) {
                            dates.push(yearFrom);
                        }
                        dates.push(yearTo);
                    }
                    else {
                        for (let year = yearTo; year >= yearFrom; year++) {
                            dates.push(year);
                        }
                    }
                }
                else {
                    dates.push(null);
                }
                break;
        }

        function datesToArray(startDate, stopDate) {
            var dateArray = new Array();
            var currentDate = startDate;
            while (currentDate <= stopDate) {
                dateArray.push(new Date (currentDate));
                currentDate = currentDate.addDays(1);
            }
            return dateArray;
        }

        let toReturn = { values: [], dates: [] };
        for (let index = 0; index < dates.length; index++) {
            const _date = dates[index];
            let link = (_date != null) ? `https://mindicador.cl/api/${type}/${_date}` : `https://mindicador.cl/api/${type}`;
            
            let data = await fetch(link)
                                .then((response) => response.json())
                                .then((data) => data.serie.reverse());
            
            /*
            let first_date = false;
            data.forEach((item) => {
                let date_value = new Date(item.fecha);
                let date_value_time = date_value.getTime();

                if(date_value_time >= min_date && date_value_time <= max_date) {
                    first_date = true;
                    toReturn.values.push( item.valor );
                    toReturn.dates.push( date_value.toLocaleDateString('es-CL') );
                }
                else if(first_date) {
                    toReturn.values.push(null);
                    toReturn.dates.push(null);
                }
            });
            */

            /**
            
            function findDataInArray(current_date) {
                let date_value, date_value_time;
                const day_data = data.find((item) => {
                    date_value = new Date(item.fecha);
                    date_value_time = date_value.getTime();

                    return (current_date.getTime() == date_value_time);
                });

                if(day_data) {
                    toReturn.values.push( day_data.valor );
                    toReturn.dates.push( date_value.toLocaleDateString('es-CL') );
                }
                else {
                    toReturn.values.push( null );
                    toReturn.dates.push( current_date.toLocaleDateString('es-CL') );
                }
            }

             */

            function findDataInArray(current_date, last_value_data) {
                let date_value, date_value_time;
                let day_data = data.find((item) => {
                    date_value = new Date(item.fecha);
                    date_value_time = date_value.getTime();

                    return (current_date.getTime() == date_value_time);
                });

                if(! day_data) {
                    if(last_value_data) {
                        day_data = last_value_data;
                    }
                    else {
                        // const current_month_index = (data_index - 1);
                        let month_data = data.find((item) => {
                            let month_date_value = new Date(item.fecha);
                            return (current_date.getFullYear() == month_date_value.getFullYear() && current_date.getMonth() == month_date_value.getMonth());
                        });
    
                        if(month_data) {
                            day_data = month_data;
                        }
                    }
                }

                if(day_data) {
                    last_value_data = day_data;
                    toReturn.values.push( day_data.valor );
                    toReturn.dates.push( current_date.toLocaleDateString('es-CL') );
                }
                else {
                    toReturn.values.push( null );
                    toReturn.dates.push( current_date.toLocaleDateString('es-CL') );
                }

                return last_value_data;
            }

            if(difference_in_days > 0) {
                const all_dates = datesToArray(date.from, date.to);

                let last_value_data = null;
                all_dates.forEach((current_date) => {
                    last_value_data = findDataInArray(current_date, last_value_data);
                });
            }
            else {
                findDataInArray(new Date(date));
            }
        }
        
        return toReturn;
    }

    /**
     * Captura el evento de cambiar el tipo de indicador desplegado
     * 
     * @param {Event} e 
     * @returns void
     */
    function drawGraphic() {
        const type = typesEl.value;
        if(type == '' || type == null || type == undefined) {
            return;
        }

        let date = getDateToRequest();

        showCompareOptions();
        getValuesType(type, date)
            .then((data) => {
                if(! chart) {
                    changeGraphicType(type, data);
                }
                else {
                    const length = chart.data.datasets.length;
                    for(let i = 1; i < length; i++) {
                        chart.data.datasets.pop();
                    }
                    chart.data.datasets[0].label = info.types[ type ].name;
                    chart.data.datasets[0].data = data.values;
                    chart.data.labels = data.dates;
                    chart.options.plugins.title.text = getTitle(type);
                    chart.update();
                }
                disableDistincMeasure(type);
            });
    }

    /**
     * Cambia el tipo de gráfico
     * 
     * @returns void
     */
    function changeGraphicType(type, data = null) {
        if(data == null) {
            if(! chart) return;

            data = { ...chart.data };
            chart.destroy();
        }
        else {
            data = {
                labels: data.dates,
                datasets: [{
                    label: info.types[ type ].name,
                    data: data.values,
                    borderColor: COLORS[0],
                    backgroundColor: COLORS[0]
                }]
            }
        }

        let ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: graphicTypeEl.value,
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: getTitle(type)
                    }
                }
            },
        });
    }

    /**
     * Retorna un título para el tipo de indicador económico proporcionado
     * 
     * @param {string} type 
     * @returns string
     */
    function getTitle(type) {
        return `${info.types[ type ].name} (${info.types[ type ].measure})`;
    }

    /**
     * Devuelve el rango de fechas especificado
     * 
     * @returns 
     */
    function getDateToRequest() {
        function stringToDate(date_str) {
            let date_parts = date_str.split('-');
            return new Date(date_parts[2], (parseInt(date_parts[1])-1), date_parts[0]);
        }

        let date;
        if(dateFromEl.value && dateToEl.value) {
            if(dateFromEl.value == dateToEl.value) {
                date = dateToEl.value;
            }
            else {
                let dateFrom = stringToDate(dateFromEl.value);
                let dateTo = stringToDate(dateToEl.value);

                if(dateFrom.getTime() > dateTo.getTime()) {
                    rangeDatesErrorEl.classList.remove('hidden');
                    return;
                }
                
                date = { from: dateFrom, to: dateTo };
            }

            rangeDatesErrorEl.classList.add('hidden');
        }

        return date;
    }

    /**
     * Agrega un tipo de indicador económico al gráfico, permitiendo comparar
     * 
     * @param {string} type 
     */
    async function addDataset(type) {
        let date = getDateToRequest();
        let data = await getValuesType(type, date);
        let color = getNewColor();

        chart.data.datasets.push({
            label: info.types[ type ].name,
            data: data.values,
            borderColor: color,
            backgroundColor: color
        });

        chart.update();
    }

    /**
     * Quita del gráfico un indicador económico
     * 
     * @param {string} type 
     */
    function removeDataset(type) {
        let datasets = chart.data.datasets.filter((item) => {
            if(item.label == info.types[ type ].name) {
                used_colors = used_colors.filter((i) => (item.borderColor != i));
                return false;
            }
            return true;
        });

        chart.data.datasets = datasets;
        chart.update();
    }

    /**
     * Obtine un color no usado en el gráfico
     * 
     * @returns string
     */
    function getNewColor() {
        for(let i = 1; i < COLORS.length; i++) {
            if(used_colors.indexOf(COLORS[ i ]) == -1) {
                used_colors.push(COLORS[ i ]);
                return COLORS[ i ];
            }
        }
    }

    /**
     * Desabilita los checkbox que no tengan la misma unidad de medida
     * 
     * @param {string} type 
     */
    function disableDistincMeasure(type) {
        let checkbox = null;
        let noDisableMeasure = info.types[ type ].measure;
        document.querySelectorAll('[data-measure]').forEach((item) => {
            checkbox = item.querySelector('input');
            checkbox.checked = false;
            if(item.getAttribute('data-measure') != noDisableMeasure) {
                checkbox.parentElement.classList.add('hidden');
            }
            else {
                checkbox.parentElement.classList.remove('hidden');
                checkbox.disabled = false;
            }
        });

        checkbox = document.getElementById(type);
        checkbox.checked = true;
        checkbox.disabled = true;
    }

    function showCompareOptions() {
        compareListEl.parentElement.classList.remove('hidden');
    }

    /**
     * Muestra o quita un indicador económico del gráfico
     * 
     * @param {Event} e 
     * @returns 
     */
    function changeGraphicItems(e) {
        if(e.target.nodeName != 'INPUT') return;

        if(e.target.checked) {
            addDataset(e.target.value);
        }
        else {
            removeDataset(e.target.value);
        }
    }

    const COLORS = [
        '#005f73',
        '#94d2bd',
        '#ee9b00',
        '#bb3e03',
        '#9b2226',
        '#414833',
    ];
    
    let chart = null;
    let used_colors = [ COLORS[0] ];
    const today = new Date();
    const info = await getInfo();
    const typesEl = document.querySelector('select[name="type"]');
    const compareListEl = document.querySelector('#compare-list');
    const graphicTypeEl = document.querySelector('#graphic_type');
    const dateFromEl = document.querySelector('#date-from');
    const dateToEl = document.querySelector('#date-to');
    const rangeDatesErrorEl = document.querySelector('.error-range');

    setTypesToGraphic();
    setTypesToCompare();

    typesEl.addEventListener('change', drawGraphic);
    compareListEl.addEventListener('click', changeGraphicItems);
    graphicTypeEl.addEventListener('change', () => changeGraphicType(typesEl.value));

    $('.datepicker').each(function() {
        $(this).datepicker({
            uiLibrary: 'bootstrap4',
            maxDate: today,
            minDate: undefined,
            format: 'dd-mm-yyyy',
            change: drawGraphic
        });
    });

    dateFromEl.value = (() => {
        var d = new Date();
        d.setDate(d.getDate() - 31);
        return d.toLocaleDateString('es-CL');
    })();
    dateToEl.value = today.toLocaleDateString('es-CL');
})();

