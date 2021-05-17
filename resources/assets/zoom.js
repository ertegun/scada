$(()=>{
    // csrf token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
});




$('#createDevice').on('click', function () {
    let f = $('#fill').val() ?? 'white';
    let type = $('#type').val();
    let canvas_id = $('#workzone').data('canvas');
    let code = document.getElementById('device_code').value;
    if (!canvas_id) return;
    if (!code) return;
    if (!type) return;
    //Ajax Request
    setObjectWithAjax(canvas_id,code,f,type);
    //Ajax Request End
});

function setObjectWithAjax(canvas_id,code,f,type) {
    $.ajax({
        url: "/dashboard/getDevice",
        type: "POST",
        data:{deviceId: code},
        success: function (res) {
            res = JSON.parse(res);
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
                // inductiveRatio !== '---' ? inductiveRatio = '%'+inductiveRatio : inductiveRatio = 'VY';
                // capacitiveRatio !== '---' ? capacitiveRatio = '%'+capacitiveRatio : capacitiveRatio = 'VY';

                const totalCurrent = current_l1+current_l2+current_l3;
                let warningRules = {};
                switch (type) {
                    case 'type1':
                        warningRules = {
                            l1AMin: $('#type1AL1Min').val(),
                            l1AMax: $('#type1AL1Max').val(),
                            l2AMin: $('#type1AL2Min').val(),
                            l2AMax: $('#type1AL2Max').val(),
                            l3AMin: $('#type1AL3Min').val(),
                            l3AMax: $('#type1AL3Max').val(),
                            l1VMin: $('#type1VL1Min').val(),
                            l1VMax: $('#type1VL1Max').val(),
                            l2VMin: $('#type1VL2Min').val(),
                            l2VMax: $('#type1VL2Max').val(),
                            l3VMin: $('#type1VL3Min').val(),
                            l3VMax: $('#type1VL3Max').val(),
                            aTotalMin: $('#type1ATotalMin').val(),
                            aTotalMax: $('#type1ATotalMax').val(),
                        }
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
                        warningRules = {
                            l1AMin: $('#type2AL1Min').val(),
                            l1AMax: $('#type2AL1Max').val(),
                            l2AMin: $('#type2AL2Min').val(),
                            l2AMax: $('#type2AL2Max').val(),
                            l3AMin: $('#type2AL3Min').val(),
                            l3AMax: $('#type2AL3Max').val(),
                            l1VMin: $('#type2VL1Min').val(),
                            l1VMax: $('#type2VL1Max').val(),
                            l2VMin: $('#type2VL2Min').val(),
                            l2VMax: $('#type2VL2Max').val(),
                            l3VMin: $('#type2VL3Min').val(),
                            l3VMax: $('#type2VL3Max').val(),
                            inductiveMin: $('#type2IMin').val(),
                            inductiveMax: $('#type2IMax').val(),
                            capacitiveMin: $('#type2CMin').val(),
                            capacitiveMax: $('#type2CMax').val(),
                            aTotalMin: $('#type2ATotalMin').val(),
                            aTotalMax: $('#type2ATotalMax').val(),
                        }

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
                            '<td>Reaktif</td><td>% '+inductiveRatio+' End.</td><td>% '+capacitiveRatio+' Kap.</td>' +
                            '</tr>' +
                            '</tbody>' +
                            '</table>' +
                            '</div>' +
                            '</foreignObject>' +
                            '</svg>';

                        break;
                    case 'type3':
                        warningRules = {
                            l1Min: $('#type2L1Min').val(),
                            l1Max: $('#type2L1Max').val(),
                            l2Min: $('#type2L2Min').val(),
                            l2Max: $('#type2L2Max').val(),
                            l3Min: $('#type2L3Min').val(),
                            l3Max: $('#type2L3Max').val(),
                            totalMin: $('#type2TotalMin').val(),
                            totalMax: $('#type2TotalMax').val(),
                        };
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
                        warningRules = {
                            l1Min: $('#type2L1Min').val(),
                            l1Max: $('#type2L1Max').val(),
                            l2Min: $('#type2L2Min').val(),
                            l2Max: $('#type2L2Max').val(),
                            l3Min: $('#type2L3Min').val(),
                            l3Max: $('#type2L3Max').val(),
                        };
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
                        warningRules = {
                            inductiveMin: $('#type5IMin').val(),
                            inductiveMax: $('#type5IMax').val(),
                            capacitiveMin: $('#type5CMin').val(),
                            capacitiveMax: $('#type5CMax').val(),
                        };
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
                            '<td>% '+inductiveRatio+'</td><td>% '+capacitiveRatio+'</td>' +
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
                    let imgInstance = new fabric.Image(img, {
                        id: Date.now(),
                        deviceInfo: {
                            fill: f,
                            deviceId: code,
                            cardType: type,
                            current_l1,
                            current_l2,
                            current_l3,
                            voltage_l1,
                            voltage_l2,
                            voltage_l3,
                            capacitiveRatio,
                            inductiveRatio
                        },
                        warningRules,
                        left: 0,
                        top: 0,
                        width: img.width,
                        height: img.height,
                    });
                    canvas.add(imgInstance);
                    canvas.renderAll();
                    // if(true) warningAnimate(imgInstance);
                };
                img.src = dataUri;
            }
            else {
                console.log('error')
            }
        }
    });
}
function setWarningRule(current,max,min) {
    if(!isNaN(current)){
        if(max != ''){
            if(current > max) return ' style="background-color: red;"';
        }
        if(min != ''){
            if(current < min) return ' style="background-color: red;"';
        }
    }
    return '';
}
function warningAnimate(currentObj) {
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
    let download = $('#download');
    pdf.save("download.pdf");
});

$('#gaHome').on('click', function () {
    window.location = '/dashboard';
})

function setWarningBackgroundColor(value,min,max) {
    if(value < min){
        return false;
    }else if(value > max){
        return false;
    }
    return true;
}
