<!-- Modal Circle -->
<div class="modal fade" id="gaCreateCircleModal" tabindex="-1" aria-labelledby="gaCreateCircleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateCircleModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="objectForm">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="cleft">X Koordinatı</label>
                                <input name="cleft" type="number" id="cleft" class="form-control" step="1" min="0" required value="0">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="ctop">Y Koordinatı</label>
                                <input name="ctop" type="number" id="ctop" class="form-control" step="1" min="0" required value="0">
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="form-group">
                                <label for="cradius">Çapı</label>
                                <input name="cradius" type="number" id="cradius" class="form-control" step="1" min="1" required value="50">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="cfill">Renk</label>
                                <input name="cfill" type="text" id="cfill" class="form-control" required  value="#000000" data-jscolor="{}">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="cdevice_code">Tip</label>
                                <select name="cdevice_code" id="cdevice_code" class="form-control" required>
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
                <button type="button" class="btn btn-secondary" id="closeCircleModal" data-bs-dismiss="modal">Kapat</button>
                <button type="button" class="btn btn-primary" id="createCircle">Oluştur</button>
            </div>
        </div>
    </div>
</div>
