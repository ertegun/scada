@extends('main')

@section('content')
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-3" style="display: none">
                <ul class="list-group">
                    <li class="list-group-item">
                        <button id="gaCreateObject" class="btn btn-info w-100" data-bs-toggle="modal"
                                data-bs-target="#gaCreateObjectModal"><span>Obje Ekle</span></button>
                    </li>
                </ul>
            </div>
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
{{--    @includeIf('modals.circle')--}}
{{--    @includeIf('modals.square')--}}
{{--    @includeIf('modals.line')--}}
{{--    @includeIf('modals.table')--}}
    @includeIf('modals.createObject')
@endsection

@section('css')@endsection
@section('js')@endsection
