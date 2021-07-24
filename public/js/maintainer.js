(() => {
    
    const table = $('#grid').DataTable({
        ajax: '/api/maintainer',
        processing: true,
        serverSide: true,
        language: {
            processing:     "Procesando...",
            search:         "Buscar:",
            lengthMenu:    "Ver _MENU_ filas",
            info:           "Viendo _START_ a _END_ de _TOTAL_ filas",
            infoEmpty:      "Viendo _START_ a _END_ de _TOTAL_ filas",
            infoFiltered:   "(filtrado de _MAX_ filas)",
            infoPostFix:    "",
            loadingRecords: "Cargando datos...",
            zeroRecords:    "No hay datos",
            emptyTable:     "No hay datos",
            paginate: {
                first:      "Primero",
                previous:   "Anterior",
                next:       "Siguiente",
                last:       "Último"
            },
            aria: {
                sortAscending:  ": activer pour trier la colonne par ordre croissant",
                sortDescending: ": activer pour trier la colonne par ordre décroissant"
            }
        },
        columns: [
            { 
                data: "date",
                render: function ( data, type, row ) {
                    return (new Date(`${data} 00:00:00`)).toLocaleDateString('es-CL');
                }
            },
            { data: "value" },
            { 
                data: "updated_at",
                render: function ( data, type, row ) {
                    return (new Date(data)).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                }
            },
            { 
                data: "created_at",
                render: function ( data, type, row ) {
                    return (new Date(data)).toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
                }
            },
            { 
                data: null,
                orderable: false,
                render: function ( data, type, row ) {
                    return `<button class="btn-edit" onclick="maintainer_edit('${row.date}');">Editar</button>`;
                }
            },
            { 
                data: null,
                orderable: false,
                
                render: function ( data, type, row ) {
                    return `<button class="btn-delete">Eliminar</button>`;
                }
            },
        ],
        scrollY: "200px",
        scrollCollapse: true,
        paging: true,
    });
    
    $('#add-data').submit(function(event) {
        event.preventDefault();
        let form = $(this);
        let dateEl = form.find('#date');
        let valueEl = form.find('#value');
    
        let data = {
            date: dateEl.val(),
            value: valueEl.val()
        };

        $.ajax({
            type: "POST",
            url: '/api/maintainer',
            data: data,
            success: function(data_response) {
                dateEl.val('');
                valueEl.val('');

                data_response = JSON.parse(data_response);
                console.log(data_response);
                if(data_response.success) {
                    /*
                    let new_row = table.row.add({ 
                        id: data_response.data.id, 
                        date: data.date, 
                        value: data.value, 
                        updated_at: data_response.data.created_at, 
                        created_at: data_response.data.created_at, 
                    });
                    window.new_row = new_row;
                    */
                   table.ajax.reload();
                }
            },
        });
    });
    
    $('.datepicker').datepicker({
        uiLibrary: 'bootstrap4',
        maxDate: new Date(),
        minDate: undefined,
        format: 'dd-mm-yyyy',
    });
    
    $('table tbody').on('click', 'button.btn-delete', function(e) {
        e.preventDefault();
    
        const row = table.row( $(this).parents('tr') );
        const data = row.data();
        
        $.ajax({
            type: 'DELETE',
            url: `/api/maintainer/${data.id}`,
            data: undefined,
            success: function(data) {
                row.remove();
            },
            dataType: 'text/json'
        });
    });

    window.table = table;
})();

function maintainer_edit(date) {
    date = (new Date(`${date} 00:00:00`)).toLocaleDateString('es-CL');
    window.location.href = `/historicos/${date}`;
}