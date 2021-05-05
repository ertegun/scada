$(()=>{
    // csrf token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
});




$('#createDevice').on('click', function () {
    let f = document.getElementById('fill').value ?? 'white';
    let type = document.getElementById('type').value;
    let warningMin = document.getElementById('warningMin').value;
    let warningMax = document.getElementById('warningMax').value;
    let code = document.getElementById('device_code').value;
    if (!code) return;
    //Ajax Request
    $.ajax({
        url: "/dashboard/getDevice",
        type: "POST",
        data:{deviceId: code},
        success: function (res) {
            res = JSON.parse(res);
            console.log(res)
            if (res.status) {
                let svgData = '';
                let instant_values = res.data.instant_values;
                let current_l1 = instant_values.current_l1,
                current_l2 = instant_values.current_l2,
                current_l3 = instant_values.current_l3,
                voltage_l1 = instant_values.voltage_l1,
                voltage_l2 = instant_values.voltage_l2,
                voltage_l3 = instant_values.voltage_l3,
                capacitiveRatio = instant_values.capacitiveRatio,
                inductiveRatio = instant_values.inductiveRatio;
                inductiveRatio !== '---' ? inductiveRatio = '%'+inductiveRatio : inductiveRatio = 'VY';
                capacitiveRatio !== '---' ? capacitiveRatio = '%'+capacitiveRatio : capacitiveRatio = 'VY';
                    // aktif_l1 = instant_values.aktif_l1,
                    // aktif_l2 = instant_values.aktif_l2,
                    // aktif_l3 = instant_values.aktif_l3,
                    // reaktif_l1 = instant_values.reaktif_l1,
                    // reaktif_l2 = instant_values.reaktif_l2,
                    // reaktif_l3 = instant_values.reaktif_l3,

                const totalCurrent = current_l1+current_l2+current_l3;
                switch (type) {
                    case 'type1':
                        svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150">' +
                            '<foreignObject width="100%" height="100%">' +
                            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                            '<table border="1" width="100%" height="100%">' +
                            '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+code+')</td></tr></thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>L1</td><td>'+current_l1+' A</td><td>'+voltage_l1+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L2</td><td>'+current_l2+' A</td><td>'+voltage_l2+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L3</td><td>'+current_l3+' A</td><td>'+voltage_l3+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Toplam</td><td>'+totalCurrent+' A</td><td></td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';
                        break;
                    case 'type2':

                        svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="175">' +
                            '<foreignObject width="100%" height="100%">' +
                            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                            '<table border="1" width="100%" height="100%">' +
                            '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+code+')</td></tr></thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>L1</td><td>'+current_l1+' A</td><td>'+voltage_l1+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L2</td><td>'+current_l2+' A</td><td>'+voltage_l2+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L3</td><td>'+current_l3+' A</td><td>'+voltage_l3+' V</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Toplam</td><td>'+totalCurrent+' A</td><td></td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Reaktif</td><td>'+inductiveRatio+' End.</td><td>'+capacitiveRatio+' Kap.</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';

                        break;
                    case 'type3':

                        svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">' +
                            '<foreignObject width="100%" height="100%">' +
                            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                            '<table border="1" width="100%" height="100%">' +
                            '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+code+')</td></tr></thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>L1</td><td>'+current_l1+' A</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L2</td><td>'+current_l2+' A</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L3</td><td>'+current_l3+' A</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Toplam</td><td>'+totalCurrent+' A</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';

                        break;
                    case 'type4':

                        svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">' +
                            '<foreignObject width="100%" height="100%">' +
                            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                            '<table border="1" width="100%" height="100%">' +
                            '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+code+')</td></tr></thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>L1</td><td>'+current_l1+' A</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L2</td><td>'+current_l2+' A</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>L3</td><td>'+current_l3+' A</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';

                        break;
                    case 'type5':

                        svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="100">' +
                            '<foreignObject width="100%" height="100%">' +
                            '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                            '<table border="1" width="100%" height="100%">' +
                            '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+code+')</td></tr></thead>' +
                            '<tbody>' +
                            '<tr>' +
                            '<td>Enduktif</td><td>Kapasitif</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>'+inductiveRatio+'</td><td>'+inductiveRatio+'</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';
                        break;
                    default:
                        console.log('nothing')
                }

                // creating image from svg
                const dataUri = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
                const img = new Image();
                img.onload = () => {
                    var imgInstance = new fabric.Image(img, {
                        id: Date.now(),
                        deviceInfo: {
                            code:code,
                            warningMin,
                            warningMax,
                            current_l1,
                            current_l2,
                            current_l3,
                            voltage_l1,
                            voltage_l2,
                            voltage_l3,
                        },
                        left: 0,
                        top: 0,
                        width: img.width,
                        height: img.height,
                    });
                    canvas.add(imgInstance);
                    canvas.renderAll();
                    if(warningMax >= 1000) warningAnimate(imgInstance);
                };
                img.src = dataUri;
            }
            else {
                console.log('error')
            }
        }
    });
    //Ajax Request End
});

function warningAnimate(currentObj) {
    console.log(currentObj)
    let obj = currentObj;
    let key = true;
    setInterval(function () {
        if (key) {
            key = false;
            obj.animate({
                opacity: 1
            },{
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function() {
                    canvas.renderAll();
                }
            });
        } else {
            key = true;
            obj.animate({
                opacity: 0
            },{
                onChange: canvas.renderAll.bind(canvas),
                onComplete: function() {
                    canvas.renderAll();
                }
            });
        }
    }, 500);
}

//Modal End

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
function setZoom(delta) {
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    canvas.setZoom(zoom);
}

/**
 *
 * Canvas download as a pdf
 */


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
    let download = document.getElementById('download');
    pdf.save("download.pdf");
}, false);

$('#gaHome').on('click', function () {
    window.location = '/dashboard';
})
