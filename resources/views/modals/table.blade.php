<!-- Modal Square -->
<div class="modal fade" id="gaCreateTableModal" tabindex="-1" aria-labelledby="gaCreateTableModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateTableModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="objectForm">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="tleft">X Koordinatı</label>
                                <input name="tleft" type="number" id="tleft" class="form-control" step="1" min="0" required value="200">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="ttop">Y Koordinatı</label>
                                <input name="ttop" type="number" id="ttop" class="form-control" step="1" min="0" required value="200">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="twidth">Genişlik</label>
                                <input name="twidth" type="number" id="twidth" class="form-control" step="1" min="1" required value="150">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="theight">Yükseklik</label>
                                <input name="theight" type="number" id="theight" class="form-control" step="1" min="1" required value="150">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="tfill">Renk</label>
                                <input name="tfill" type="text" id="tfill" class="form-control" required value="#000000" data-jscolor="{}">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="tdevice_code">Tip</label>
                                <select name="tdevice_code" id="tdevice_code" class="form-control" required>
                                    <option value="ABC_1_2_A">ABC_1_2_A</option>
                                    <option value="ABC_1_2_B">ABC_1_2_B</option>
                                    <option value="ABC_1_2_C">ABC_1_2_C</option>
                                    <option value="ABC_1_2_D">ABC_1_2_D</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" id="closeTableModal" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-primary" id="createTable">Oluştur</button>
            </div>
        </div>
    </div>
</div>
