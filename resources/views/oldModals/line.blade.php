<!-- Modal Line -->
<div class="modal fade" id="gaCreateLineModal" tabindex="-1" aria-labelledby="gaCreateLineModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="gaCreateLineModalLabel">Cihaz Bilgileri</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form class="objectForm">
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="lfromx">X Koordinatı</label>
                                <input name="lfromx" type="number" id="lfromx" class="form-control" step="1" min="0" required value="100">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="lfromy">Y Koordinatı</label>
                                <input name="lfromy" type="number" id="lfromy" class="form-control" step="1" min="0" required value="200">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="ltox">Genişlik</label>
                                <input name="ltox" type="number" id="ltox" class="form-control" step="1" min="1" required value="500">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="ltoy">Yükseklik</label>
                                <input name="ltoy" type="number" id="ltoy" class="form-control" step="1" min="1" required value="500">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="lfill">Renk</label>
                                <input name="lfill" type="text" id="lfill" class="form-control" required value="#000000" data-jscolor="{}">
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="lstrokeWidth">Kalınlık</label>
                                <input name="lstrokeWidth" type="number" id="lstrokeWidth" class="form-control" step="1" min="1" required value="1">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id="closeLineModal">Kapat</button>
                <button type="button" class="btn btn-primary" id="createLine">Oluştur</button>
            </div>
        </div>
    </div>
</div>
