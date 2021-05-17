<!-- Modal Circle -->
<div class="modal fade" id="gaCreateDeviceModal" tabindex="-1" aria-labelledby="gaCreateDeviceModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateDeviceModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="objectForm">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="fill">Renk</label>
                                <input name="fill" type="text" id="fill" class="form-control" required  value="#000000" data-jscolor="{}">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="type">Tip</label>
                                <select name="type" id="type" class="form-control" required>
                                    <option disabled selected>Tip Seçin</option>
                                    <option value="type1">Type 1</option>
                                    <option value="type2">Type 2</option>
                                    <option value="type3">Type 3</option>
                                    <option value="type4">Type 4</option>
                                    <option value="type5">Type 5</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="device_code">Cihaz Kodu</label>
                                <input list="devices" type="text" id="device_code" class="form-control" onkeyup="searchDevices();" autocomplete="off">
                                <datalist id="devices"></datalist>
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div id="appendWarningValue" class="row"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="closeCreateDevice" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-primary" id="createDevice">Oluştur</button>
            </div>
        </div>
    </div>
</div>

