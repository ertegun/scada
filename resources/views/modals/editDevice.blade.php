<!-- Modal Circle -->
<div class="modal fade" id="gaEditDeviceModal" tabindex="-1" aria-labelledby="gaEditDeviceModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaEditDeviceModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-12">
                        <label>Konum</label>
                        <input type="text" class="form-control" disabled value="" id="editLocationName">
                    </div>
                    <div class="col-12">
                        <label>Kodu</label>
                        <input type="text" class="form-control" disabled value="" id="editDeviceId">
                    </div>
                    <div class="col-12">
                        <label>Tipi</label>
                        <input type="text" class="form-control" disabled value="" id="editCardType">
                    </div>
                </div>
                <hr/>
                <div id="appendEditWarningInputs" class="row"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="closeEditDevice" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-success" id="editDevice">Güncelle</button>
            </div>
        </div>
    </div>
</div>

