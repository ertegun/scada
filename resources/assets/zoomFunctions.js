function zoomWithWheel() {
    canvas.on('mouse:wheel', function (opt) {
        let delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        console.log(delta,zoom)
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });
}

// function saveCanvasData() {
//     const json = canvas.toJSON(['id','addChild','sourceObj','targetObj','lineId','deviceInfo']);
//     localStorage.setItem('design', JSON.stringify(json));
// }
//
// function getCanvasData() {
//     if (localStorage.getItem("design") !== null) {
//         const json = localStorage.getItem("design");
//         canvas.loadFromJSON(JSON.parse(json), function (){
//             canvas.renderAll.bind(canvas)
//         })
//     }
// }


function undo(cnvs, undo, redo) {
    if (cnvs.mementoConfig.undoFinishedStatus) {
        if (cnvs.mementoConfig.currentStateIndex === -1) {
            cnvs.mementoConfig.undoStatus = false;
        } else {
            if (cnvs.mementoConfig.canvasState.length >= 1) {
                cnvs.mementoConfig.undoFinishedStatus = 0;
                if (cnvs.mementoConfig.currentStateIndex != 0) {
                    cnvs.mementoConfig.undoStatus = true;
                    loadJsonIntoCanvas(JSON.parse(cnvs.mementoConfig.canvasState[cnvs.mementoConfig.currentStateIndex - 1]).objects, cnvs, true);
                    cnvs.mementoConfig.undoStatus = false;
                    cnvs.mementoConfig.currentStateIndex -= 1;
                    undo.disabled = false;
                    if (cnvs.mementoConfig.currentStateIndex !== cnvs.mementoConfig.canvasState.length - 1) {
                        redo.disabled = false;
                    }
                    cnvs.mementoConfig.undoFinishedStatus = 1;
                } else if (cnvs.mementoConfig.currentStateIndex === 0) {
                    clearCanvas(cnvs);
                    cnvs.mementoConfig.undoFinishedStatus = 1;
                    undo.disabled = false;
                    redo.disabled = false;
                    cnvs.mementoConfig.currentStateIndex -= 1;
                }
            }
        }
    }
}

function redo(cnvs, undo, redo) {
    if (cnvs.mementoConfig.redoFinishedStatus) {
        if ((cnvs.mementoConfig.currentStateIndex === cnvs.mementoConfig.canvasState.length - 1) && cnvs.mementoConfig.currentStateIndex != -1) {
            redo.disabled = true;
        } else {
            if (cnvs.mementoConfig.canvasState.length > cnvs.mementoConfig.currentStateIndex && cnvs.mementoConfig.canvasState.length != 0) {
                cnvs.mementoConfig.redoFinishedStatus = 0;
                cnvs.mementoConfig.redoStatus = true;
                loadJsonIntoCanvas(JSON.parse(cnvs.mementoConfig.canvasState[cnvs.mementoConfig.currentStateIndex + 1]).objects, cnvs, true);
                cnvs.mementoConfig.redoStatus = false;
                cnvs.mementoConfig.currentStateIndex += 1;
                if (cnvs.mementoConfig.currentStateIndex != -1) {
                    undo.disabled = false;
                }
                cnvs.mementoConfig.redoFinishedStatus = 1;
                if ((cnvs.mementoConfig.currentStateIndex === cnvs.mementoConfig.canvasState.length - 1) && cnvs.mementoConfig.currentStateIndex != -1) {
                    redo.disabled = true;
                }
            }
        }
    }
}

function updateCanvasState(canvas, config, undo, redo) {
    if ((config.undoStatus === false && config.redoStatus === false)) {
        let jsonData = canvas.toJSON(['selectable', 'id']);
        let canvasAsJson = JSON.stringify(jsonData);
        if (config.currentStateIndex < config.canvasState.length - 1) {
            let indexToBeInserted = config.currentStateIndex + 1;
            config.canvasState[indexToBeInserted] = canvasAsJson;
            let numberOfElementsToRetain = indexToBeInserted + 1;
            config.canvasState = config.canvasState.splice(0, numberOfElementsToRetain);
        } else {
            config.canvasState.push(canvasAsJson);
        }
        config.currentStateIndex = config.canvasState.length - 1;
        if ((config.currentStateIndex === config.canvasState.length - 1) && config.currentStateIndex != -1) {
            redo.disabled = true;
        }
        undo.disabled = false;
    }
}

function loadJsonIntoCanvas(json, canvas, ignoreAddedEvent = false) {
    clearCanvas(canvas);
    fabric.util.enlivenObjects(json, function (objects) {
        objects.forEach(function (obj) {

            if (ignoreAddedEvent) {
                obj.ignoreAddedEvent = true;
            }
            canvas.add(obj);
            canvas.renderAll.bind(canvas);
        });
    });
}


function getObjectById(id) {
    const canvasObject = canvas.getObjects().filter((item) => {
        return item.id === parseInt(id)
    })
    return canvasObject[0]
}

function removeObjectFromCanvas(objectId) {
    const canvasObject = getObjectById(objectId)
    canvas.remove(canvasObject)
}

function removeLineById(lines){
    lines.forEach((lineId)=>{
        let line = getObjectById(lineId);
        let sourceObj = getObjectById(line.sourceObj);
        let targetObj = getObjectById(line.targetObj);
        if (sourceObj.addChild && sourceObj.addChild.lines) {
            sourceObj.addChild.lines.forEach(function (child,index,o){
               if(child.lineId === lineId){
                   o.splice(index,1)
               }
            })
        }
        if (targetObj.addChild && targetObj.addChild.lines) {
            targetObj.addChild.lines.forEach(function (child,index,o){
               if(child.lineId === lineId){
                   o.splice(index,1)
               }
            })
        }
        canvas.remove(line);
    })
}

/*Object icons --Delete and Copy-- */

function deleteObject() {
    let selection = canvas.getActiveObject();
    if (selection.type !== 'activeSelection') {
        let lineIds = [];
        if (selection.addChild && selection.addChild.lines) {
            selection.addChild.lines.forEach(function (child,index){
                lineIds.push(child.lineId);
            })
        }else{
            if (selection.type === "line")
                lineIds.push(selection.id);
        }
        removeLineById(lineIds);
        canvas.remove(selection);
    } else {
        for (let i in selection._objects) {
            canvas.remove(selection._objects[i]);
        }
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
}

function showInfo() {
    // copySelectedArea();
    // pasteSelectedArea();
    let selection = canvas.getActiveObject();
    if (selection.type !== 'activeSelection') {
       console.log(selection.deviceInfo.id);
    }
}

function renderIcon(icon) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        let size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }
}

// fabric.Object.prototype.controls.deleteControl = new fabric.Control({
//     x: 0.5,
//     y: -0.5,
//     offsetY: -16,
//     offsetX: 16,
//     cursorStyle: 'pointer',
//     mouseUpHandler: deleteObject,
//     render: renderIcon(deleteImg),
//     cornerSize: 24
// });
//
// fabric.Object.prototype.controls.info = new fabric.Control({
//     x: -0.5,
//     y: -0.5,
//     offsetY: -16,
//     offsetX: -16,
//     cursorStyle: 'pointer',
//     mouseUpHandler: showInfo,
//     render: renderIcon(infoImg),
//     cornerSize: 24
// });
// fabric.Object.prototype.controls.drawLine = new fabric.Control({
//     x: -0.5,
//     y: 0.5,
//     offsetY: 16,
//     offsetX: -16,
//     cursorStyle: 'pointer',
//     mouseUpHandler: addChild,
//     render: renderIcon(lineImg),
//     cornerSize: 24
// });

/*Object icons --Delete and Copy-- end */

function copySelectedArea() {
    canvas.getActiveObject().clone(function (cloned) {
        _clipboard = cloned;
    });
}

function pasteSelectedArea() {
    // clone again, so you can do multiple copies.
    _clipboard.clone(function (clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
            // active selection needs a reference to the canvas.
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function (obj) {
                canvas.add(obj);
            });
            // this should solve the unselectability
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }
        _clipboard.top += 10;
        _clipboard.left += 10;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}

function zoomReset(rate) {
    canvas.setZoom(rate);
}
function clearCanvas(canvas) {
    canvas.clear();
}

