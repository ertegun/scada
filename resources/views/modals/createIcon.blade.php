<!-- Modal Icon -->
<div class="modal fade" id="gaCreateIconModal" tabindex="-1" aria-labelledby="gaCreateIconModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateIconModalLabel">Bağlantı Ekle</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-6 col-sm-4 mb-2">
                        <div class="form-group d-inline-block">
                            <button class="btn btn-outline-danger gaCreateIconBtn" data-icon-name="meter">
                                <img src="{{asset('assets/icons/meter.svg')}}" style="width: 75px" alt="meter">
                            </button>
                        </div>
                    </div>
                    <div class="col-6 col-sm-4 mb-2">
                        <div class="form-group d-inline-block">
                            <button class="btn btn-outline-danger gaCreateIconBtn" data-icon-name="voltage">
                                <img src="{{asset('assets/icons/voltage.svg')}}" style="width: 75px" alt="meter">
                            </button>
                        </div>
                    </div>
                    <div class="col-6 col-sm-4 mb-2">
                        <div class="form-group d-inline-block">
                            <button class="btn btn-outline-danger gaCreateIconBtn" data-icon-name="capacitor">
                                <img src="{{asset('assets/icons/capacitor.svg')}}" style="width: 75px" alt="meter">
                            </button>
                        </div>
                    </div>
                </div>
            </div>
{{--            <div class="modal-footer">--}}
{{--                <button type="button" class="btn btn-secondary" id="closeCreateIcon" data-bs-dismiss="modal">Kapat</button>--}}
{{--            </div>--}}
        </div>
    </div>
</div>

