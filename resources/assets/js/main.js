$(()=>{
    // csrf token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
});


$('#createDevice').on('click', function () {
    let f = $('#fill').val() ?? 'black';
    let type = $('#type').val();
    let canvas_id = $('#workzone').data('canvas');
    let code = $('#device_code').val();
    let locationName = $('#locationName').val();
    if (!canvas_id) {
        toastr.error('Canvas id boş olamaz');
        return;
    }
    if (!code){
        toastr.error('Cihaz kodu boş olamaz');
        return;
    }
    if (!type){
        toastr.error('Tip boş olamaz');
        return;
    }
    //Ajax Request
    setObjectWithAjax(locationName,canvas_id,code,f,type);
    //Ajax Request End
});

$('#gaClear').on('click', function () {
    if (confirm("Sure you want to delete all?")) {
        clearCanvas(canvas);
    }
});

$('#gaZoomReset').on('click', function () {
    zoomReset(1);
});

$('#gaZoomIn').on('click', function () {
    setZoom(-100)
});

$('#gaZoomOut').on('click', function () {
    setZoom(100)
});

$('#gaDownload').on('click', function () {
    // download pdf
    let width = canvas.width;
    let height = canvas.height;
    let pdf = null;
    if (width > height) {
        pdf = new jsPDF('l', 'px', [width, height]);
    } else {
        pdf = new jsPDF('p', 'px', [height, width]);
    }
    // only jpeg is supported by jsPDF
    let imgData = canvas.toDataURL("image/jpeg", 1.0);
    // var pdf = new jsPDF('l', 'px', [width, height]);
    pdf.addImage(imgData, 'JPEG', 0, 0);
    let download = $('#download');
    pdf.save("download.pdf");
});

$('#gaHome').on('click', function () {
    window.location = '/dashboard';
})

