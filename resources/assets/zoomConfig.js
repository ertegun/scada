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
// let lineIcon = "data:image/svg+xml,%3Csvg version='1.1' fill='red' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 475.114 475.114' style='enable-background:new 0 0 475.114 475.114;' xml:space='preserve'%3E%3Cg%3E%3Cg%3E%3Cpath d='M467.514,231.254L467.514,231.254l-155.1,0c-4.1,0-7.5,3.4-7.5,7.5s3.4,7.5,7.5,7.5h138.1l-133,137.2l-150.4-307.9 c-1.1-2.2-3.2-3.7-5.6-4.1c-2.4-0.4-4.9,0.5-6.6,2.2l-152.8,159.9c-2.9,3-2.8,7.7,0.2,10.6c3,2.9,7.7,2.8,10.6-0.2l145.4-152.2 l150.4,307.8c1.1,2.2,3.1,3.7,5.6,4.1c0.4,0.1,0.8,0.1,1.2,0.1c2,0,4-0.8,5.4-2.3l139.2-143.5v138.3c0,4.1,3.4,7.5,7.5,7.5 c4.1,0,7.5-3.4,7.5-7.5v-157.6C475.014,234.554,471.614,231.254,467.514,231.254z'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3Cg%3E%3C/g%3E%3C/svg%3E";
let lineIcon = "data:image/svg+xml,%3Csvg id='Layer_1' enable-background='new 0 0 512 512' height='30' viewBox='0 0 512 512' width='30' xmlns='http://www.w3.org/2000/svg'%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cg id='XMLID_1710_'%3E%3Cg id='XMLID_1711_'%3E%3Cg id='XMLID_1712_'%3E%3Cg id='XMLID_1713_'%3E%3Cg id='XMLID_1714_'%3E%3Cg id='XMLID_1715_'%3E%3Cg id='XMLID_1716_'%3E%3Cg id='XMLID_1717_'%3E%3Cg id='XMLID_1718_'%3E%3Cg id='XMLID_1719_'%3E%3Cg id='XMLID_1720_'%3E%3Cg id='XMLID_1721_'%3E%3Cg id='XMLID_1722_'%3E%3Cg id='XMLID_1723_'%3E%3Cg id='XMLID_1724_'%3E%3Ccircle cx='256' cy='256' fill='%2346f7d5' r='256'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/g%3E%3Cpath d='m348.577 265.92-116.77-116.36-174.198 209.987 147.36 147.36c16.492 3.336 33.556 5.093 51.031 5.093 141.385 0 256-114.615 256-256 0-22.748-2.982-44.797-8.551-65.793l-42.659-42.841z' fill='%232ad1b5'/%3E%3Cg%3E%3Cg%3E%3Cg%3E%3Cpath d='m299.286 221.993h160.082v36.137h-160.082z' fill='%23d8d5d2' transform='matrix(.61 -.793 .793 .61 -42.194 394.458)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='m225.566 160.02h36.137v160.082h-36.137z' fill='%23f4f2ef' transform='matrix(.793 -.61 .61 .793 -95.834 198.249)'/%3E%3C/g%3E%3Cg%3E%3Cpath d='m306.749 292.501-28.649 22.029-14.003-18.21v-59.293z' fill='%23d8d5d2'/%3E%3C/g%3E%3C/g%3E%3Cg%3E%3Cpath d='m64.424 221.993h160.082v36.137h-160.082z' fill='%23f4f2ef' transform='matrix(.61 -.793 .793 .61 -133.903 208.266)'/%3E%3C/g%3E%3Cg%3E%3Cellipse cx='426.886' cy='177.625' fill='%23552cb7' rx='45.446' ry='45.446' transform='matrix(.16 -.987 .987 .16 183.176 570.547)'/%3E%3Cellipse cx='196.076' cy='177.625' fill='%237343dd' rx='45.446' ry='45.446' transform='matrix(.707 -.707 .707 .707 -68.17 190.672)'/%3E%3C/g%3E%3Ccircle cx='87.057' cy='322.431' fill='%23f9710d' r='47.389'/%3E%3Ccircle cx='311.481' cy='322.431' fill='%23e54c00' r='47.389'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
let editIcon = "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3ClinearGradient id='a' gradientTransform='matrix(1 0 0 -1 0 -9462)' gradientUnits='userSpaceOnUse' x1='0' x2='512' y1='-9718' y2='-9718'%3E%3Cstop offset='0' stop-color='%2300f1ff'/%3E%3Cstop offset='.231' stop-color='%2300d8ff'/%3E%3Cstop offset='.5138' stop-color='%2300c0ff'/%3E%3Cstop offset='.7773' stop-color='%2300b2ff'/%3E%3Cstop offset='1' stop-color='%2300adff'/%3E%3C/linearGradient%3E%3Cpath d='m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0' fill='url(%23a)'/%3E%3Cpath d='m408.101562 103.898438c-13.226562-13.222657-30.808593-20.507813-49.511718-20.507813s-36.285156 7.285156-49.511719 20.507813l-191.0625 191.066406c-1.828125 1.828125-3.152344 4.09375-3.84375 6.585937l-30.015625 107.816407c-1.453125 5.226562.027344 10.832031 3.875 14.65625 2.851562 2.835937 6.667969 4.367187 10.578125 4.367187 1.367187 0 2.746094-.1875 4.097656-.570313l107.820313-30.625c5.109375-1.453124 9.074218-5.503906 10.414062-10.644531 1.339844-5.144531-.140625-10.613281-3.890625-14.375l-66.808593-67.011719 156.042968-156.046874 56.5625 56.566406-120.074218 119.742187c-5.863282 5.851563-5.878907 15.347657-.027344 21.214844 5.851562 5.867187 15.347656 5.878906 21.214844.027344l144.140624-143.746094c13.226563-13.226563 20.507813-30.808594 20.507813-49.511719s-7.285156-36.285156-20.507813-49.511718zm-230.296874 271.402343-57.574219 16.355469 16.125-57.933594zm209.097656-193.609375-2.8125 2.804688-56.59375-56.589844 2.796875-2.792969c7.558593-7.558593 17.605469-11.722656 28.296875-11.722656s20.738281 4.164063 28.296875 11.722656c7.558593 7.558594 11.722656 17.605469 11.722656 28.296875 0 10.6875-4.164063 20.738282-11.707031 28.28125zm0 0' fill='%23fff'/%3E%3C/svg%3E";

let deleteImg = document.createElement('img');
deleteImg.src = deleteIcon;
let infoImg = document.createElement('img');
infoImg.src = infoIcon;
let lineImg = document.createElement('img');
lineImg.src = lineIcon;
let editImg = document.createElement('img');
editImg.src = editIcon;
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
