@extends('main')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-12 px-0 position-relative" id="scroll-1" style="overflow: auto">
                @includeIf('toolbar')
                <div id="workzone" class="shadow"
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
        document.getElementById('gaSave').addEventListener('click', function () {
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
            // getCanvasData();
            $('.wrapper-spinner').addClass('d-none');
            let canvasData = '{!! $canvasData->canvas !!}';
            if(canvasData){
                let canvasJson = JSON.parse(canvasData);
                canvas.loadFromJSON(canvasJson, function (){
                    canvas.renderAll.bind(canvas)
                })
            }
            // searchDevices();
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
        };

        /**
         var heroes = [
         "Abaddon",
         "Alchemist",
         "Ancient Apparition",
         "Anti-Mage",
         "Axe",
         "Bane",
         ];

         for (var key in heroes) {
    var optionElement = document.createElement("option");
    optionElement.value = heroes[key];
    document.getElementById("heroes").appendChild(optionElement);
  }
         */

    </script>
@endsection
