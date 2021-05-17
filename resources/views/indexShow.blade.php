@extends('main')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12 px-0 position-relative" id="scroll-1" style="overflow: auto">
                @includeIf('toolbar')
                <div id="workzone" data-canvas="{{$canvasData->id}}" class="shadow"
                     style="height: calc(100vh - 80px); width: 2500px;border: lightseagreen 1px solid">
                    <canvas id="c"></canvas>
                </div>
            </div>
        </div>
    @includeIf('loading')
    </div>
{{--    @includeIf('modals.createObject')--}}
    @includeIf('modals.createObject', ['devices' => $devices])
@endsection

@section('css')
@endsection
@section('js')
    <script>
        window.addEventListener('beforeunload', (event) => {
            event.returnValue = `Are you sure you want to leave?`;
        });
        $('#gaSave').on('click', function () {
            let json = canvas.toJSON(['id', 'addChild', 'sourceObj', 'targetObj', 'lineId', 'deviceInfo','warningRules','locationName']);
            json = JSON.stringify(json);
            localStorage.setItem('canvas',json);

            $.ajax({
                url: "{{route('addCanvasData')}}",
                type: "POST",
                data: {canvas: json, id: '{{$canvasData->id}}'},
                success: function (data) {
                    if (data) {
                        toastr.success("Kayıt başarılı.");
                    }
                    else {
                        toastr.error("Kayıt başarısız!");
                    }
                }
            });
        })

        $(()=>{
            let canvasJson = '{!! $canvasData->canvas !!}';
            if(canvasJson){
                let canvasData = JSON.parse(canvasJson);
                let canvasObjects = canvasData.objects;
                if(canvasObjects.length > 0){
                    loadObjectsFromJson(canvasObjects).then(function () {
                        $('.wrapper-spinner').addClass('d-none').removeClass('d-block');
                    });
                }else{
                    $('.wrapper-spinner').addClass('d-none').removeClass('d-block');
                }
            }
            // $('.wrapper-spinner').addClass('d-none').removeClass('d-block');
        });
        let devicesLoading = false;
        function searchDevices() {
            let val = $('#device_code').val();
            if(devicesLoading) return;
            if(val.length < 3) return;
            $.ajax({
                url: "{{route('searchDevices')}}",
                type: "POST",
                data: {search: val},
                beforeSend:function(){
                    devicesLoading = true;
                    $('#devices').empty();
                    $('#createDevice').attr("disabled", true);
                },
                success: function (data) {
                    if (data.length > 0) {
                        data.forEach(function (el,index) {
                            if(index < 10){
                                let opt = '<option value="'+el.measuring_device_id+'">'+el.measuring_location_name+'</option>';
                                $('#devices').append(opt);
                                $('#locationName').val(el.measuring_location_name);
                                $('#createDevice').removeAttr("disabled");
                            }
                        });
                    }
                    devicesLoading = false;
                }
            });
        }

        function loadObjectsFromJson(canvasObjects) {
            return new Promise(function (resolve,reject) {
                fabric.util.enlivenObjects(canvasObjects, function(objects) {
                    const origRenderOnAddRemove = canvas.renderOnAddRemove;
                    canvas.renderOnAddRemove = false;
                    let itemsProcessed = 0;
                    const objCount = objects.filter(function (el) {
                            return el.type == 'image'
                    });

                    $.ajax({
                        url: "/dashboard/getDevices",
                        type: "POST",
                        data:{canvas_id: $('#workzone').data('canvas')},
                        success: function (res) {
                            objects.forEach(function(o) {
                                if(o.type == 'image'){
                                    res.forEach(function (device) {
                                        if(device.code === o.deviceInfo.deviceId){
                                            let instant_values = device.instant_values;
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
                                            o.deviceInfo.current_l1 = current_l1;
                                            o.deviceInfo.current_l2 = current_l2;
                                            o.deviceInfo.current_l3 = current_l3;
                                            o.deviceInfo.voltage_l1 = voltage_l1;
                                            o.deviceInfo.voltage_l2 = voltage_l2;
                                            o.deviceInfo.voltage_l3 = voltage_l3;
                                            let svgData = '';
                                            switch (o.deviceInfo.cardType) {
                                                case 'type1':
                                                    svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150">' +
                                                        '<foreignObject width="100%" height="100%">' +
                                                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+o.deviceInfo.fill+';color:#fff;width: 100%;height: 100%;">' +
                                                        '<table border="1" width="100%" height="100%">' +
                                                        '<thead>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+setLocationName(o.deviceInfo.locationName)+'</th></tr>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+o.deviceInfo.deviceId+'</th></tr>' +
                                                        '</thead>' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td>L1</td><td'+setWarningRule(current_l1,o.warningRules.l1AMax,o.warningRules.l1AMin)+'>'+current_l1+' A</td><td'+setWarningRule(voltage_l1,o.warningRules.l1VMax,o.warningRules.l1VMin)+'>'+voltage_l1+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L2</td><td'+setWarningRule(current_l2,o.warningRules.l2AMax,o.warningRules.l2AMin)+'>'+current_l2+' A</td><td'+setWarningRule(voltage_l2,o.warningRules.l2VMax,o.warningRules.l2VMin)+'>'+voltage_l2+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L3</td><td'+setWarningRule(current_l3,o.warningRules.l3AMax,o.warningRules.l3AMin)+'>'+current_l3+' A</td><td'+setWarningRule(voltage_l3,o.warningRules.l3VMax,o.warningRules.l3VMin)+'>'+voltage_l3+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>Toplam</td><td'+setWarningRule(totalCurrent,o.warningRules.aTotalMax,o.warningRules.aTotalMin)+'>'+totalCurrent+' A</td><td></td>' +
                                                        '</tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '</div>' +
                                                        '</foreignObject>' +
                                                        '</svg>';
                                                    break;
                                                case 'type2':
                                                    console.log(o)
                                                    svgData = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
                                                        '<foreignObject width="100%" height="100%">' +
                                                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+o.deviceInfo.fill+';color:#fff;width: 100%;height: 100%;">' +
                                                        '<table border="1" width="100%" height="100%">' +
                                                        '<thead>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+setLocationName(o.deviceInfo.locationName)+'</th></tr>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+o.deviceInfo.deviceId+'</th></tr>' +
                                                        '</thead>' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td>L1</td><td'+setWarningRule(current_l1,o.warningRules.l1AMax,o.warningRules.l1AMin)+'>'+current_l1+' A</td><td'+setWarningRule(voltage_l1,o.warningRules.l1VMax,o.warningRules.l1VMin)+'>'+voltage_l1+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L2</td><td'+setWarningRule(current_l2,o.warningRules.l2AMax,o.warningRules.l2AMin)+'>'+current_l2+' A</td><td'+setWarningRule(voltage_l2,o.warningRules.l2VMax,o.warningRules.l2VMin)+'>'+voltage_l2+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L3</td><td'+setWarningRule(current_l3,o.warningRules.l3AMax,o.warningRules.l3AMin)+'>'+current_l3+' A</td><td'+setWarningRule(voltage_l3,o.warningRules.l3VMax,o.warningRules.l3VMin)+'>'+voltage_l3+' V</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>Toplam</td><td'+setWarningRule(totalCurrent,o.warningRules.aTotalMax,o.warningRules.aTotalMin)+'>'+totalCurrent+' A</td><td></td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>Reaktif</td><td'+setWarningRule(inductiveRatio,o.warningRules.inductiveMax,o.warningRules.inductiveMin)+'>% '+inductiveRatio+' End.</td><td'+setWarningRule(capacitiveRatio,o.warningRules.capacitiveMax,o.warningRules.capacitiveMin)+'>% '+capacitiveRatio+' Kap.</td>' +
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
                                                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+o.deviceInfo.fill+';color:#fff;width: 100%;height: 100%;">' +
                                                        '<table border="1" width="100%" height="100%">' +
                                                        '<thead>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+setLocationName(o.deviceInfo.locationName)+'</th></tr>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+o.deviceInfo.deviceId+'</th></tr>' +
                                                        '</thead>' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td>L1</td><td'+setWarningRule(current_l1,o.warningRules.l1AMax,o.warningRules.l1AMin)+'>'+current_l1+' A</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L2</td><td'+setWarningRule(current_l2,o.warningRules.l2AMax,o.warningRules.l2AMin)+'>'+current_l2+' A</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L3</td><td'+setWarningRule(current_l3,o.warningRules.l3AMax,o.warningRules.l3AMin)+'>'+current_l3+' A</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>Toplam</td><td'+setWarningRule(totalCurrent,o.warningRules.aTotalMax,o.warningRules.aTotalMin)+'>'+totalCurrent+' A</td>' +
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
                                                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+o.deviceInfo.fill+';color:#fff;width: 100%;height: 100%;">' +
                                                        '<table border="1" width="100%" height="100%">' +
                                                        '<thead>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+setLocationName(o.deviceInfo.locationName)+'</th></tr>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+o.deviceInfo.deviceId+'</th></tr>' +
                                                        '</thead>' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td>L1</td><td'+setWarningRule(current_l1,o.warningRules.l1AMax,o.warningRules.l1AMin)+'>'+current_l1+' A</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L2</td><td'+setWarningRule(current_l2,o.warningRules.l2AMax,o.warningRules.l2AMin)+'>'+current_l2+' A</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td>L3</td><td'+setWarningRule(current_l3,o.warningRules.l3AMax,o.warningRules.l3AMin)+'>'+current_l3+' A</td>' +
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
                                                        '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:16px;background-color:'+o.deviceInfo.fill+';color:#fff;width: 100%;height: 100%;">' +
                                                        '<table border="1" width="100%" height="100%">' +
                                                        '<thead>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+setLocationName(o.deviceInfo.locationName)+'</th></tr>' +
                                                        '<tr><th style="text-align: center;" colspan="3">'+o.deviceInfo.deviceId+'</th></tr>' +
                                                        '</thead>' +
                                                        '<tbody>' +
                                                        '<tr>' +
                                                        '<td>Enduktif</td><td>Kapasitif</td>' +
                                                        '</tr>' +
                                                        '<tr>' +
                                                        '<td'+setWarningRule(inductiveRatio,o.warningRules.inductiveMax,o.warningRules.inductiveMin)+'>% '+inductiveRatio+'</td><td'+setWarningRule(capacitiveRatio,o.warningRules.capacitiveMax,o.warningRules.capacitiveMin)+'>% '+capacitiveRatio+'</td>' +
                                                        '</tr>' +
                                                        '</tbody>' +
                                                        '</table>' +
                                                        '</div>' +
                                                        '</foreignObject>' +
                                                        '</svg>';
                                                    break;
                                            }

                                            // creating image from svg
                                            /**
                                            const dataUri = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
                                            console.log(dataUri)
                                            console.log(o.src)
                                            o.src = dataUri;
                                            canvas.add(o);
                                             */

                                            const dataUri = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
                                            const img = new Image();
                                            img.onload = () => {
                                                let imgInstance = new fabric.Image(img, {
                                                    id: o.id,
                                                    deviceInfo: {
                                                        fill: o.deviceInfo.fill,
                                                        deviceId: o.deviceInfo.deviceId,
                                                        cardType: o.deviceInfo.cardType,
                                                        current_l1,
                                                        current_l2,
                                                        current_l3,
                                                        voltage_l1,
                                                        voltage_l2,
                                                        voltage_l3,
                                                    },
                                                    warningRules: o.warningRules,
                                                    left: o.left,
                                                    top: o.top,
                                                    width: img.width,
                                                    height: img.height,
                                                    addChild: o.addChild
                                                });
                                                canvas.add(imgInstance);
                                                canvas.renderAll();
                                                // if(true) warningAnimate(imgInstance);
                                            };
                                            img.src = dataUri;
                                            // if(o.deviceInfo.warningMax > 100) warningAnimate(o);
                                            itemsProcessed++;
                                            if(itemsProcessed === objCount.length) {
                                                resolve("done")
                                            }
                                        }
                                    })
                                }else{
                                    canvas.add(o);
                                }
                            });
                        }
                    })

                    canvas.renderOnAddRemove = origRenderOnAddRemove;
                    canvas.renderAll();
                });
            })
        }
    </script>
    <script>
        $('#type').on('change',function () {
            let type = $(this).val();
            if(!type) return;
            let html = '';
            switch(type){
                case 'type1':
                    html = '<div class="col-6"><div class="form-group"><label for="type1AL1Min">L1 A Min</label><input type="number" id="type1AL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1AL1Max">L1 A Max</label><input type="number" id="type1AL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL1Min">L1 V Min</label><input type="number" id="type1VL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL1Max">L1 V Max</label><input type="number" id="type1VL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1AL2Min">L2 A Min</label><input type="number" id="type1AL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1AL2Max">L2 A Max</label><input type="number" id="type1AL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL2Min">L2 V Min</label><input type="number" id="type1VL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL2Max">L2 V Max</label><input type="number" id="type1VL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1AL3Min">L3 A Min</label><input type="number" id="type1AL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1AL3Max">L3 A Max</label><input type="number" id="type1AL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL3Min">L3 V Min</label><input type="number" id="type1VL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1VL3Max">L3 V Max</label><input type="number" id="type1VL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1ATotalMin">Toplam A Min</label><input type="number" id="type1ATotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1ATotalMax">Toplam A Min</label><input type="number" id="type1ATotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type2':
                    html = '<div class="col-6"><div class="form-group"><label for="type2AL1Min">L1 A Min</label><input type="number" id="type2AL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2AL1Max">L1 A Max</label><input type="number" id="type2AL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL1Min">L1 V Min</label><input type="number" id="type2VL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL1Max">L1 V Max</label><input type="number" id="type2VL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2AL2Min">L2 A Min</label><input type="number" id="type2AL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2AL2Max">L2 A Max</label><input type="number" id="type2AL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL2Min">L2 V Min</label><input type="number" id="type2VL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL2Max">L2 V Max</label><input type="number" id="type2VL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2AL3Min">L3 A Min</label><input type="number" id="type2AL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2AL3Max">L3 A Max</label><input type="number" id="type2AL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL3Min">L3 V Min</label><input type="number" id="type2VL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2VL3Max">L3 V Max</label><input type="number" id="type2VL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2ATotalMin">Toplam A Min</label><input type="number" id="type2ATotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2ATotalMax">Toplam A Min</label><input type="number" id="type2ATotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2IMin">Endüktif Min</label><input type="number" id="type2IMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2IMax">Endüktif Max</label><input type="number" id="type2IMax" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2CMin">Kapasitif Min</label><input type="number" id="type2CMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2CMax">Kapasitif Max</label><input type="number" id="type2CMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type3':
                    html = '<div class="col-6"><div class="form-group"><label for="type3AL1Min">L1 A Min</label><input type="number" id="type3AL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3AL1Max">L1 A Max</label><input type="number" id="type3AL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3AL2Min">L2 A Min</label><input type="number" id="type3AL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3AL2Max">L2 A Max</label><input type="number" id="type3AL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3AL3Min">L3 A Min</label><input type="number" id="type3AL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3AL3Max">L3 A Max</label><input type="number" id="type3AL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3ATotalMin">Toplam A Min</label><input type="number" id="type3ATotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3ATotalMax">Toplam A Min</label><input type="number" id="type3ATotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type4':
                    html = '<div class="col-6"><div class="form-group"><label for="type4AL1Min">L1 A Min</label><input type="number" id="type4AL1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4AL1Max">L1 A Max</label><input type="number" id="type4AL1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4AL2Min">L2 A Min</label><input type="number" id="type4AL2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4AL2Max">L2 A Max</label><input type="number" id="type4AL2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4AL3Min">L3 A Min</label><input type="number" id="type4AL3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4AL3Max">L3 A Max</label><input type="number" id="type4AL3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type5':
                    html = '<div class="col-6"><div class="form-group"><label for="type5IMin">Endüktif Min</label><input type="number" id="type5IMin" class="form-control" step="1" min="0" max="100" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type5IMax">Endüktif Max</label><input type="number" id="type5IMax" class="form-control" step="1" min="0" max="100" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type5CMin">Kapasitif Min</label><input type="number" id="type5CMin" class="form-control" step="1" min="0" max="100" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type5CMax">Kapasitif Max</label><input type="number" id="type5CMax" class="form-control" step="1" min="0" max="100" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;

            }
        })
    </script>
@endsection
