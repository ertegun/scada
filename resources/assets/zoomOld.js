// window.addEventListener("beforeunload", function (event) {
//     // saveCanvasData();
// });
// document.addEventListener('DOMContentLoaded', (event) => {
//     // getCanvasData();
// })
// zoomWithWheel();

//Modal
let createObject = document.getElementById('createObject');
// createObject.addEventListener('click', function () {
//     let formElements = document.getElementById("objectForm").elements;
//     let postData = {};
//     for (let i = 0; i < formElements.length; i++){
//         if (formElements[i].type != "submit")//we dont want to include the submit-buttom
//             postData[formElements[i].name] = formElements[i].value;
//     }
//     // alert(postData.type)
//     if(postData.type ==='Triangle'){
//         let triangle = new fabric.Triangle({
//             width: 125,
//             height: 125,
//             fill: 'red',
//             left: 0,
//             top: 0
//         });
//         canvas.add(triangle);
//     }
//     else if(postData.type ==='Rect'){
//         let rect = new fabric.Rect({
//             width: postData.width,
//             height: postData.height,
//             fill: postData.fill,
//             left: postData.left,
//             top: postData.top
//         });
//         canvas.add(rect);
//     }
//     else if(postData.type ==='Circle'){
//         let circle = new fabric.Circle({
//             radius: 50, fill: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), left: 300, top: 150,
//             id: Math.floor(Math.random() * 99999999)
//         });
//         let circle1 = new fabric.Circle({
//             radius: 55, fill: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), left: 600, top: 450,
//             id: Math.floor(Math.random() * 99999999)
//         });
//         let circle2 = new fabric.Circle({
//             radius: 60, fill: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0'), left: 200, top: 550,
//             id: Math.floor(Math.random() * 99999999)
//         });
//         canvas.add(circle,circle1,circle2);
//     }
//     else if(postData.type ==='Image'){
//         fabric.Image.fromURL('https://via.placeholder.com/100.png', function(myImg) {
//             let img1 = myImg.set({ left: 0, top: 0 ,width:100,height:100});
//             canvas.add(img1);
//         });
//         console.log('img')
//     }
//     else{
//
//     }
//     // location.reload();
//     document.getElementById("closeModal").click();
// })

/**
 * Create Circle
 * */
let createCircle = document.getElementById('createCircle');
createCircle.addEventListener('click', function () {
    let t = document.getElementById('ctop').value ?? 0;
    let l = document.getElementById('cleft').value ?? 0;
    let r = document.getElementById('cradius').value ?? 25;
    let f = document.getElementById('cfill').value ?? 'white';
    let dc = document.getElementById('cdevice_code').value;
    if (!dc) return;
    let circle = new fabric.Circle({
        radius: r,
        fill: f,
        originX: 'center',
        originY: 'center'
    });
    let str = dc+"\t"+dc+"\t"+dc+"\t";
    let text = new fabric.Text(str, {
        fontSize: 13,
        fill: 'white',
        originX: 'center',
        originY: 'center'
    });
    let group = new fabric.Group([circle, text], {
        id: Date.now(),
        deviceInfo: {id:dc},
        left: l,
        top: t,
        angle: 0,
        width: r*2,
        height: r*2
    });
    canvas.add(group);
    document.getElementById('closeCircleModal').click();
    // location.reload();
});
/**
 * Create Square
 * */
let createSquare = document.getElementById('createSquare');
createSquare.addEventListener('click', function () {
    let t = document.getElementById('stop').value ?? 0;
    let l = document.getElementById('sleft').value ?? 0;
    let w = document.getElementById('swidth').value ?? 50;
    let h = document.getElementById('sheight').value ?? 50;
    let f = document.getElementById('sfill').value ?? 'white';
    let dc = document.getElementById('sdevice_code').value;
    if (!dc) return;
    let square = new fabric.Rect({
        top:0,
        left:0,
        width: w,
        height: h,
        fill: f,
        originX: 'center',
        originY: 'center'
    });
    let str = dc+"\n"+dc+"\n"+dc+"\n";
    let text = new fabric.IText(str, {
        fontSize: 13,
        fontWeight: 'bold',
        fill: 'red',
        originX: 'center',
        originY: 'center',
    });
    let group = new fabric.Group([square, text], {
        id: Date.now(),
        deviceInfo: {id:dc},
        left: l,
        top: t,
        angle: 0,
        width: w,
        height: h
    });
    canvas.add(group);
    document.getElementById("closeSquareModal").click();
    // location.reload();
});
/**
 * Create Square
 * */
let createTable = document.getElementById('createTable');
createTable.addEventListener('click', function () {
    let f = document.getElementById('tfill').value ?? 'white';
    let dc = document.getElementById('tdevice_code').value;
    if (!dc) return;

    var svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
        '<foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
        '<table border="1" width="100%" height="100%">' +
        '<thead><tr><td style="text-align: center;" colspan="3">Konum ('+dc+')</td></tr></thead>' +
        '<tbody>' +
        '<tr>' +
        '<td>L1</td><td>50 A</td><td>220 V</td>' +
        '</tr>' +
        '<tr>' +
        '<td>L2</td><td>450 A</td><td>200 V</td>' +
        '</tr>' +
        '<tr>' +
        '<td>L3</td><td>30 A</td><td>210 V</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Toplam</td><td>120 A</td><td></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '</foreignObject>' +
        '</svg>';

    // creating image from svg
    const dataUri = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
    const img = new Image();
    img.onload = () => {
        var imgInstance = new fabric.Image(img, {
            id: Date.now(),
            deviceInfo: {
                id:dc,
                warningMin: 50,
                warningMax: 100,
            },
            left: 0,
            top: 0,
            width: img.width,
            height: img.height,
        });

        canvas.add(imgInstance);
        canvas.renderAll();
    };
    img.src = dataUri;
});

/**
 * Create Line
 * */
let createLine = document.getElementById('createLine');
createLine.addEventListener('click', function () {
    let fromX = document.getElementById('lfromx').value ?? 100;
    let fromY = document.getElementById('lfromy').value ?? 200;
    let toX = document.getElementById('swidth').value ?? 300;
    let toY = document.getElementById('sheight').value ?? 400;
    let f = document.getElementById('lfill').value ?? 'white';
    let s = document.getElementById('lstrokeWidth').value ?? 1;
    let line = new fabric.Line([500, 500, 700, 500],{
        fill: f,
        stroke: f,
        strokeWidth: s,
        selectable: true,
        originX: 'center',
        originY: 'center'
    });
    canvas.add(line);
    document.getElementById("closeLineModal").click();
    // location.reload();
});



//Modal End

let gaUndo = document.getElementById('gaUndo');
let gaRedo = document.getElementById('gaRedo');
gaUndo.addEventListener('click', function () {
    undo(canvas, gaUndo, gaRedo);
})
gaRedo.addEventListener('click', function () {
    redo(canvas, gaUndo, gaRedo);
})

let gaClear = document.getElementById('gaClear');
gaClear.addEventListener('click', function () {
    if (confirm("Sure you want to delete all?")) {
        clearCanvas(canvas);
    }
})

let gaZoomReset = document.getElementById('gaZoomReset');
gaZoomReset.addEventListener('click', function () {
    zoomReset(1);
})

let gaZoomIn = document.getElementById('gaZoomIn');
gaZoomIn.addEventListener('click', function () {
    setZoom(-100)
})
let gaZoomOut = document.getElementById('gaZoomOut');
gaZoomOut.addEventListener('click', function () {
    setZoom(100)
})


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

let gaDownload = document.getElementById('gaDownload');
gaDownload.addEventListener('click', function () {
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
    var imgData = canvas.toDataURL("image/jpeg", 1.0);
    // var pdf = new jsPDF('l', 'px', [width, height]);
    pdf.addImage(imgData, 'JPEG', 0, 0);
    var download = document.getElementById('download');
    pdf.save("download.pdf");
}, false);
