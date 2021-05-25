function zoomReset(rate) {
    canvas.setZoom(rate);
}

function setZoom(delta) {
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    canvas.setZoom(zoom);
}

function clearCanvas(canvas) {
    canvas.clear();
}

function zoomWithWheel() {
    canvas.on('mouse:wheel', function (opt) {
        let delta = opt.e.deltaY;
        let zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
    });
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

function goInfo() {
    let selection = canvas.getActiveObject();
    if (selection.type !== 'activeSelection') {
        if(selection.hasOwnProperty('deviceInfo')){
            window.open(deviceInfoRedirectUrl + selection.deviceInfo.deviceId, '_blank');
        }
    }
}

function showInfo() {
    let selection = canvas.getActiveObject();
    if (selection.type !== 'activeSelection') {
        if(selection.hasOwnProperty('deviceInfo')){
            editDevice(selection);
        }
    }
}

function renderIcon(icon,type) {
    return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
       if(fabricObject.hasOwnProperty('deviceInfo') || type == 'deleteControl'){
           let size = this.cornerSize;
           ctx.save();
           ctx.translate(left, top);
           ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
           ctx.drawImage(icon, -size / 2, -size / 2, size, size);
           ctx.restore();
       }
       if(fabricObject.hasOwnProperty('icon') && type == 'drawLine'){
           let size = this.cornerSize;
           ctx.save();
           ctx.translate(left, top);
           ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
           ctx.drawImage(icon, -size / 2, -size / 2, size, size);
           ctx.restore();
       }
    }
}

function setObjectWithAjax(locationName,canvas_id,code,f,type) {
    try {
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
                                '<thead>' +
                                '<tr><th style="text-align: center;" colspan="3">'+setLocationName(locationName)+'</th></tr>' +
                                '<tr><th style="text-align: center;" colspan="3">'+code+'</th></tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>L1</td><td'+setWarningRule(current_l1,warningRules.l1AMax,warningRules.l1AMin)+'>'+current_l1+' A</td><td'+setWarningRule(voltage_l1,warningRules.l1VMax,warningRules.l1VMin)+'>'+voltage_l1+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L2</td><td'+setWarningRule(current_l2,warningRules.l2AMax,warningRules.l2AMin)+'>'+current_l2+' A</td><td'+setWarningRule(voltage_l2,warningRules.l2VMax,warningRules.l2VMin)+'>'+voltage_l2+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L3</td><td'+setWarningRule(current_l3,warningRules.l3AMax,warningRules.l3AMin)+'>'+current_l3+' A</td><td'+setWarningRule(voltage_l3,warningRules.l3VMax,warningRules.l3VMin)+'>'+voltage_l3+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Toplam</td><td'+setWarningRule(totalCurrent,warningRules.aTotalMax,warningRules.aTotalMin)+'>'+totalCurrent+' A</td><td></td>' +
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

                            svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                                '<foreignObject width="100%" height="100%">' +
                                '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                                '<table border="1" width="100%" height="100%">' +
                                '<thead>' +
                                '<tr><th style="text-align: center;" colspan="3">'+setLocationName(locationName)+'</th></tr>' +
                                '<tr><th style="text-align: center;" colspan="3">'+code+'</th></tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>L1</td><td'+setWarningRule(current_l1,warningRules.l1AMax,warningRules.l1AMin)+'>'+current_l1+' A</td><td'+setWarningRule(voltage_l1,warningRules.l1VMax,warningRules.l1VMin)+'>'+voltage_l1+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L2</td><td'+setWarningRule(current_l2,warningRules.l2AMax,warningRules.l2AMin)+'>'+current_l2+' A</td><td'+setWarningRule(voltage_l2,warningRules.l2VMax,warningRules.l2VMin)+'>'+voltage_l2+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L3</td><td'+setWarningRule(current_l3,warningRules.l3AMax,warningRules.l3AMin)+'>'+current_l3+' A</td><td'+setWarningRule(voltage_l3,warningRules.l3VMax,warningRules.l3VMin)+'>'+voltage_l3+' V</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Toplam</td><td'+setWarningRule(totalCurrent,warningRules.aTotalMax,warningRules.aTotalMin)+'>'+totalCurrent+' A</td><td></td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Reaktif</td><td'+setWarningRule(inductiveRatio,warningRules.inductiveMax,warningRules.inductiveMin)+'>% '+inductiveRatio+' End.</td><td'+setWarningRule(capacitiveRatio,warningRules.capacitiveMax,warningRules.capacitiveMin)+'>% '+capacitiveRatio+' Kap.</td>' +
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
                                '<thead>' +
                                '<tr><th style="text-align: center;" colspan="3">'+setLocationName(locationName)+'</th></tr>' +
                                '<tr><th style="text-align: center;" colspan="3">'+code+'</th></tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>L1</td><td'+setWarningRule(current_l1,warningRules.l1AMax,warningRules.l1AMin)+'>'+current_l1+' A</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L2</td><td'+setWarningRule(current_l2,warningRules.l2AMax,warningRules.l2AMin)+'>'+current_l2+' A</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L3</td><td'+setWarningRule(current_l3,warningRules.l3AMax,warningRules.l3AMin)+'>'+current_l3+' A</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>Toplam</td><td'+setWarningRule(totalCurrent,warningRules.aTotalMax,warningRules.aTotalMin)+'>'+totalCurrent+' A</td>' +
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
                                '<thead>' +
                                '<tr><th style="text-align: center;" colspan="3">'+setLocationName(locationName)+'</th></tr>' +
                                '<tr><th style="text-align: center;" colspan="3">'+code+'</th></tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>L1</td><td'+setWarningRule(current_l1,warningRules.l1AMax,warningRules.l1AMin)+'>'+current_l1+' A</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L2</td><td'+setWarningRule(current_l2,warningRules.l2AMax,warningRules.l2AMin)+'>'+current_l2+' A</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td>L3</td><td'+setWarningRule(current_l3,warningRules.l3AMax,warningRules.l3AMin)+'>'+current_l3+' A</td>' +
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
                            svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">' +
                                '<foreignObject width="100%" height="100%">' +
                                '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+f+';color:#fff;width: 100%;height: 100%;">' +
                                '<table border="1" width="100%" height="100%">' +
                                '<thead>' +
                                '<tr><th style="text-align: center;" colspan="3">'+setLocationName(locationName)+'</th></tr>' +
                                '<tr><th style="text-align: center;" colspan="3">'+code+'</th></tr>' +
                                '</thead>' +
                                '<tbody>' +
                                '<tr>' +
                                '<td>Enduktif</td><td>Kapasitif</td>' +
                                '</tr>' +
                                '<tr>' +
                                '<td'+setWarningRule(inductiveRatio,warningRules.inductiveMax,warningRules.inductiveMin)+'>% '+inductiveRatio+'</td><td'+setWarningRule(capacitiveRatio,warningRules.capacitiveMax,warningRules.capacitiveMin)+'>% '+capacitiveRatio+'</td>' +
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
                                inductiveRatio,
                                locationName
                            },
                            warningRules,
                            left: 150,
                            top: 150,
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
    catch(err) {
        toastr.error('hatalı cihaz');
        console.log(err);
        console.log('catch');
    }
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

function setLocationName(name) {
    let letters = { "İ": "i", "ı": "i", "ö": "o", "Ö": "O", "ü": "u", "Ü": "U", "ç": "c", "Ç": "C", "ğ": "g", "Ğ": "G", "ş": "s", "Ş": "S"};
    name = name.replace(/(([ıİşŞğĞüÜçÇöÖ]))+/g, function(letter){ return letters[letter]; })
    if (name.length > 13){
        return name.substring(0,13)+'...';
    }
    return name;
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

function setWarningBackgroundColor(value,min,max) {
    if(value < min){
        return false;
    }else if(value > max){
        return false;
    }
    return true;
}

