$('form').submit(function(e) {
    e.preventDefaults();

    const form = $(this);
    const date = form.find('#date').val();
    const value = form.find('#value').val();

    $.ajax({
        type: "POST",
        url: '/api/maintainer',
        data: { date, value },
        success: function(data) {
            window.location.href = '/historicos';
        },
        dataType: 'text/json'
    });
});