class CustomDecimalEditor {
    constructor(props) {
        const el = document.createElement('input');
    
        el.type = 'text';
        el.value = String(props.value);
    
        this.el = el;
    }
  
    getElement() {
        return this.el;
    }
  
    getValue() {
        return this.el.value;
    }
  
    mounted() {
        this.el.select();
    }
}

const url = '/api/maintainer';
const dataSource = {
    api: {
        readData: { url, method: 'GET' },
        createData: { url, method: 'POST' },
        updateData: { url, method: 'PUT' },
        deleteData: { url, method: 'DELETE' }
    },
    hideLoadingBar: false,
    contentType: 'text/json',
};

(async () => {
    const grid = new tui.Grid({
        el: document.getElementById('grid'),
        scrollX: false,
        scrollY: false,
        data: dataSource,
        pageOptions: {
            perPage: 10
        },
        rowHeaders: ['rowNum'],
        columns: [
            {
                header: 'Fecha',
                name: 'date',
                editor: 'datePicker'
            },
            {
                header: 'Valor',
                name: 'value',
                editor: CustomDecimalEditor
            },
            {
                header: 'Actualizado',
                name: 'updated_at'
            },
            {
                header: 'Creado',
                name: 'created_at'
            }
        ],
    });

    grid.on('beforeChange', ev => {
        console.log('before change:', ev);
    });
    grid.on('afterChange', ev => {
        console.log('after change:', ev);
    });

    

    /*
    grid.resetData([
        {
            id: 1,
            date: '2021-05-15 00:00:00',
            value: 1234.569,
            updated_at: '2021-06-18 00:00:00',
            created_at: '2021-06-19 00:00:00'
        },
        {
            id: 2,
            date: '2021-05-17 00:00:00',
            value: 531478.569,
            updated_at: '2021-06-18 00:00:00',
            created_at: '2021-06-19 00:00:00'
        },
        {
            id: 3,
            date: '2021-05-19 00:00:00',
            value: 9742.540,
            updated_at: '2021-06-20 00:00:00',
            created_at: '2021-06-19 00:00:00'
        },
    ]);
    */
})();
