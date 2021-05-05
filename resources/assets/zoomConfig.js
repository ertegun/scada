let width = document.getElementById('workzone').clientWidth;
let height = document.getElementById('workzone').clientHeight;
let canvasConfig = {
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1,
};
let canvas = new fabric.Canvas('c', {
    selection: true,
    height,
    width,
    fireRightClick: true
});
canvas.mementoConfig = canvasConfig;

// canvas.on('object:modified', function () {
//     updateCanvasState(canvas, canvasConfig, document.getElementById('gaUndo'), document.getElementById('gaRedo'));
// });
// canvas.on('object:added', function (e) {
//     if (!e.target.ignoreAddedEvent) {
//         updateCanvasState(canvas, canvasConfig, document.getElementById('gaUndo'), document.getElementById('gaRedo'));
//     }
// });

let deleteIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
// let cloneIcon = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A"
let infoIcon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' id='info' viewBox='0 0 512 512'%3E%3Cpath style='fill:%230A4EAF;' d='M256,512c-68.38,0-132.667-26.629-181.02-74.98C26.629,388.667,0,324.38,0,256 S26.629,123.333,74.98,74.98C123.333,26.629,187.62,0,256,0s132.667,26.629,181.02,74.98C485.371,123.333,512,187.62,512,256 s-26.629,132.667-74.98,181.02C388.667,485.371,324.38,512,256,512z'%3E%3C/path%3E%3Cpath style='fill:%23063E8B;' d='M437.02,74.98C388.667,26.629,324.38,0,256,0v512c68.38,0,132.667-26.629,181.02-74.98 C485.371,388.667,512,324.38,512,256S485.371,123.333,437.02,74.98z'%3E%3C/path%3E%3Cpath style='fill:%23FFFFFF;' d='M256,185c-30.327,0-55-24.673-55-55s24.673-55,55-55s55,24.673,55,55S286.327,185,256,185z M301,395 V215H191v30h30v150h-30v30h140v-30H301z'%3E%3C/path%3E%3Cg%3E%3Cpath style='fill:%23CCEFFF;' d='M256,185c30.327,0,55-24.673,55-55s-24.673-55-55-55V185z'%3E%3C/path%3E%3Cpolygon style='fill:%23CCEFFF;' points='301,395 301,215 256,215 256,425 331,425 331,395 '%3E%3C/polygon%3E%3C/g%3E%3C/svg%3E"
let lineIcon = "data:image/svg+xml,%3Csvg version='1.1' fill='red' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 475.114 475.114' style='enable-background:new 0 0 475.114 475.114;' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M467.514,231.254L467.514,231.254l-155.1,0c-4.1,0-7.5,3.4-7.5,7.5s3.4,7.5,7.5,7.5h138.1l-133,137.2l-150.4-307.9 c-1.1-2.2-3.2-3.7-5.6-4.1c-2.4-0.4-4.9,0.5-6.6,2.2l-152.8,159.9c-2.9,3-2.8,7.7,0.2,10.6c3,2.9,7.7,2.8,10.6-0.2l145.4-152.2 l150.4,307.8c1.1,2.2,3.1,3.7,5.6,4.1c0.4,0.1,0.8,0.1,1.2,0.1c2,0,4-0.8,5.4-2.3l139.2-143.5v138.3c0,4.1,3.4,7.5,7.5,7.5 c4.1,0,7.5-3.4,7.5-7.5v-157.6C475.014,234.554,471.614,231.254,467.514,231.254z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E";

let deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;
let infoImg = document.createElement('img');
infoImg.src = infoIcon;
let lineImg = document.createElement('img');
lineImg.src = lineIcon;
// fabric.Object.prototype.transparentCorners = false;
// fabric.Object.prototype.cornerColor = 'peru';
// fabric.Object.prototype.cornerStyle = 'circle';

//set borders
canvas.on('object:moving', function (e) {
    var obj = e.target;
    // if object is too big ignore
    if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
    }
    // bot-right corner
    if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
    }
});

let left1 = 0, top1 = 0, scale1x = 0, scale1y = 0, width1 = 0, height1 = 0;
canvas.on('object:scaling', function (e) {
    let obj = e.target;
    obj.setCoords();
    let brNew = obj.getBoundingRect();
    if (((brNew.width + brNew.left) >= obj.canvas.width) || ((brNew.height + brNew.top) >= obj.canvas.height) || ((brNew.left < 0) || (brNew.top < 0))) {
        obj.left = left1;
        obj.top = top1;
        obj.scaleX = scale1x;
        obj.scaleY = scale1y;
        obj.width = width1;
        obj.height = height1;
    } else {
        left1 = obj.left;
        top1 = obj.top;
        scale1x = obj.scaleX;
        scale1y = obj.scaleY;
        width1 = obj.width;
        height1 = obj.height;
    }
});
//set borders end
// set hover intersects
canvas.on({
    'object:moving': onChange,
    'object:scaling': onChange,
    'object:rotating': onChange,
});

function onChange(options) {
    options.target.setCoords();
    canvas.forEachObject(function(obj) {
        if (obj === options.target) return;
        obj.set('opacity' ,options.target.intersectsWithObject(obj) ? 0.5 : 1);
    });
}
// set hover intersects end
