// we need this here because this is when the canvas gets initialized
['object:moving', 'object:scaling'].forEach(addChildMoveLine);

function addChild() {
    if (canvas.getActiveObject() == null) {
        return;
    }
    canvas.addChild = {
        start: canvas.getActiveObject()
    };
    // for when addChild is clicked twice
    canvas.off('mouse:dblclick', addChildLine);
    canvas.on('mouse:dblclick', addChildLine);
}

function calcArrowAngle(x1, y1, x2, y2) {
    let angle = 0, x, y;
    x = (x2 - x1);
    y = (y2 - y1);
    if (x === 0) {
        angle = (y === 0) ? 0 : (y > 0) ? Math.PI / 2 : Math.PI * 3 / 2;
    } else if (y === 0) {
        angle = (x > 0) ? 0 : Math.PI;
    } else {
        angle = (x < 0) ? Math.atan(y / x) + Math.PI : (y < 0) ? Math.atan(y / x) + (2 * Math.PI) : Math.atan(y / x);
    }
    return (angle * 180 / Math.PI + 90);
}

function addChildLine(options) {
    canvas.off('mouse:dblclick', addChildLine);
    // add the line
    let fromObject = canvas.addChild.start;
    let toObject = options.target;
    let from = fromObject.getCenterPoint();
    let to = toObject.getCenterPoint();
    let fromX = from.x;
    let fromY = from.y;
    let toX = to.x;
    let toY = to.y;
    let calibrateX = 0;
    let calibrateY = 0;
    // let calibrateX = 60 / 2 + 10 / 2;
    // let calibrateY = 30 / 2 + 10 / 2;
    let distanceX, distanceY;
    if (fromX < toX) {
        distanceX = toX - fromX;
    } else {
        distanceX = fromX - toX;
    }

    if (fromY < toY) {
        distanceY = toY - fromY;
    } else {
        distanceY = fromY - toY;
    }

    if (distanceX > distanceY) {
        if (fromX < toX) {
            toX -= calibrateX;
        } else {
            toX += calibrateX;
        }
    } else {
        if (fromY < toY) {
            toY -= calibrateY;
        } else {
            toY += calibrateY;
        }
    }
    let line = new fabric.Line([fromX, fromY, toX, toY], {
        fill: 'red',
        stroke: 'red',
        strokeWidth: 1,
        selectable: false,
        sourceObj: fromObject.id,
        targetObj: toObject.id,
        id: Date.now(),
    });
    canvas.add(line);
    line.sendToBack();
    let myLine = {
        lineId: line.id,
        sourceObj: fromObject.id,
        targetObj: toObject.id,
    }
    fromObject.addChild = fromObject.addChild || {};
    fromObject.addChild.lines = fromObject.addChild.lines || [];
    fromObject.addChild.lines.push(myLine);
    toObject.addChild = toObject.addChild || {};
    toObject.addChild.lines = toObject.addChild.lines || [];
    toObject.addChild.lines.push(myLine);

    // to remove line references when the line gets removed
    // line.addChildRemove = function () {
    //     fromObject.addChild.lines.forEach(function (e, i, arr) {
    //         if (e.lineId === line.id)
    //             arr.splice(i, 1);
    //     });
    // };
    // undefined instead of delete since we are anyway going to do this many times
    canvas.addChild = undefined;
}

function addChildMoveLine(event) {
    canvas.on(event, function (options) {
        let object = options.target;
        if (typeof object !== "undefined") {
            if (object.addChild && object.addChild.lines) {
                object.addChild.lines.forEach(function (lineIds) {
                    let s_obj = null,t_obj = null,line = null;
                    canvas.getObjects().forEach(function (o) {
                        if (o.id == lineIds.sourceObj) {s_obj = o;}
                        if (o.id == lineIds.targetObj) {t_obj = o;}
                        if (o.id == lineIds.lineId) {line = o;}
                    })
                    if (s_obj != null && t_obj != null && line != null){
                        let fcenter = s_obj.getCenterPoint(),
                            fx = fcenter.x,
                            fy = fcenter.y,
                            tcenter = t_obj.getCenterPoint(),
                            tx = tcenter.x,
                            ty = tcenter.y,
                            // xdis = 30 / 2 + 10 / 2,
                            // ydis = 30 / 2 + 10 / 2,
                            xdis = 0,
                            ydis = 0,
                            horizontal = Math.abs(tx - line.x1) > Math.abs(ty - line.y1)
                        line.set({
                            'x1': fx,
                            'y1': fy,
                            'x2': tx + xdis * (horizontal ? (tx < line.x1 ? 1 : -1) : 0),
                            'y2': ty + ydis * (horizontal ? 0 : (ty < line.y1 ? 1 : -1)),
                        });
                    }
                });
            }
        }
    });
}



fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    offsetY: 16,
    offsetX: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderIcon(deleteImg),
    cornerSize: 24
});

fabric.Object.prototype.controls.info = new fabric.Control({
    x: -0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: -16,
    cursorStyle: 'pointer',
    mouseUpHandler: showInfo,
    render: renderIcon(infoImg),
    cornerSize: 24
});
fabric.Object.prototype.controls.drawLine = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: addChild,
    render: renderIcon(lineImg),
    cornerSize: 24
});