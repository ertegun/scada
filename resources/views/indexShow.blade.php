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
            let json = canvas.toJSON(['id', 'addChild', 'sourceObj', 'targetObj', 'lineId', 'deviceInfo']);
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
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
            let canvasJson = '{!! $canvasData->canvas !!}';
            if(canvasJson){
                let canvasData = JSON.parse(canvasJson);
                let canvasObjects = canvasData.objects;
                if(canvasObjects.length > 0){
                    loadObjectsFromJson(canvasObjects).then(function () {
                        //$('.wrapper-spinner').addClass('d-none').removeClass('d-block');
                    });
                }else{
                    //$('.wrapper-spinner').addClass('d-none').removeClass('d-block');
                }
            }
            $('.wrapper-spinner').addClass('d-none').removeClass('d-block');
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
                },
                success: function (data) {
                    if (data.length > 0) {
                        data.forEach(function (el,index) {
                            if(index < 10){
                                let opt = '<option value="'+el.measuring_device_id+'">'+el.measuring_location_name+'</option>';
                                $('#devices').append(opt);
                            }
                        });
                    }
                    devicesLoading = false;
                }
            });
        }

        function loadObjectsFromJson(canvasObjects) {
            // $('.wrapper-spinner').removeClass('d-none').addClass('.d-block');
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
                                            inductiveRatio !== '---' ? inductiveRatio = '%'+inductiveRatio : inductiveRatio = 'VY';
                                            capacitiveRatio !== '---' ? capacitiveRatio = '%'+capacitiveRatio : capacitiveRatio = 'VY';
                                            const totalCurrent = current_l1+current_l2+current_l3;
                                            o.deviceInfo.current_l1 = current_l1;
                                            o.deviceInfo.current_l2 = current_l2;
                                            o.deviceInfo.current_l3 = current_l3;
                                            o.deviceInfo.voltage_l1 = voltage_l1;
                                            o.deviceInfo.voltage_l2 = voltage_l2;
                                            o.deviceInfo.voltage_l3 = voltage_l3;
                                            let svgData = '';
                                            switch (o.type) {
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
                                            }

                                            // creating image from svg
                                            const dataUri = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
                                            o.src = dataUri;
                                            canvas.add(o);
                                            if(o.deviceInfo.warningMax > 100) warningAnimate(o);
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
                    html = '<div class="col-6"><div class="form-group"><label for="type1L1Min">L1 A Min</label><input type="number" id="type1L1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1L1Max">L1 A Max</label><input type="number" id="type1L1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1L2Min">L2 A Min</label><input type="number" id="type1L2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1L2Max">L2 A Max</label><input type="number" id="type1L2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1L3Min">L3 A Min</label><input type="number" id="type1L3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1L3Max">L3 A Max</label><input type="number" id="type1L3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1TotalMin">Toplam A Min</label><input type="number" id="type1TotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type1TotalMax">Toplam A Min</label><input type="number" id="type1TotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type2':
                    html = '<div class="col-6"><div class="form-group"><label for="type2L1Min">L1 A Min</label><input type="number" id="type2L1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2L1Max">L1 A Max</label><input type="number" id="type2L1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2L2Min">L2 A Min</label><input type="number" id="type2L2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2L2Max">L2 A Max</label><input type="number" id="type2L2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2L3Min">L3 A Min</label><input type="number" id="type2L3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2L3Max">L3 A Max</label><input type="number" id="type2L3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2TotalMin">Toplam A Min</label><input type="number" id="type2TotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type2TotalMax">Toplam A Min</label><input type="number" id="type2TotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type3':
                    html = '<div class="col-6"><div class="form-group"><label for="type3L1Min">L1 A Min</label><input type="number" id="type3L1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3L1Max">L1 A Max</label><input type="number" id="type3L1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3L2Min">L2 A Min</label><input type="number" id="type3L2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3L2Max">L2 A Max</label><input type="number" id="type3L2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3L3Min">L3 A Min</label><input type="number" id="type3L3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3L3Max">L3 A Max</label><input type="number" id="type3L3Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3TotalMin">Toplam A Min</label><input type="number" id="type3TotalMin" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type3TotalMax">Toplam A Min</label><input type="number" id="type3TotalMax" class="form-control" step="1" min="0" value=""></div></div>';
                    $('#appendWarningValue').empty();
                    $('#appendWarningValue').append(html);
                    break;
                case 'type4':
                    html = '<div class="col-6"><div class="form-group"><label for="type4L1Min">L1 A Min</label><input type="number" id="type4L1Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4L1Max">L1 A Max</label><input type="number" id="type4L1Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4L2Min">L2 A Min</label><input type="number" id="type4L2Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4L2Max">L2 A Max</label><input type="number" id="type4L2Max" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4L3Min">L3 A Min</label><input type="number" id="type4L3Min" class="form-control" step="1" min="0" value=""></div></div>';
                    html += '<div class="col-6"><div class="form-group"><label for="type4L3Max">L3 A Max</label><input type="number" id="type4L3Max" class="form-control" step="1" min="0" value=""></div></div>';
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
