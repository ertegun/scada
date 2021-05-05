<!-- Modal Square -->
<div class="modal fade" id="gaCreateSquareModal" tabindex="-1" aria-labelledby="gaCreateCircleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateSquareModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="objectForm">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="sleft">X Koordinatı</label>
                                <input name="sleft" type="number" id="sleft" class="form-control" step="1" min="0" required value="200">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="stop">Y Koordinatı</label>
                                <input name="stop" type="number" id="stop" class="form-control" step="1" min="0" required value="200">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="swidth">Genişlik</label>
                                <input name="swidth" type="number" id="swidth" class="form-control" step="1" min="1" required value="150">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="sheight">Yükseklik</label>
                                <input name="sheight" type="number" id="sheight" class="form-control" step="1" min="1" required value="150">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="sfill">Renk</label>
                                <input name="sfill" type="text" id="sfill" class="form-control" required value="#000000" data-jscolor="{}">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="sdevice_code">Tip</label>
                                <select name="sdevice_code" id="sdevice_code" class="form-control" required>
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
                <button type="button" class="btn btn-secondary" id="closeSquareModal" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-primary" id="createSquare">Oluştur</button>
            </div>
        </div>
    </div>
</div>
