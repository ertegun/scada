<!doctype html>
<html lang="tr">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <title>Ges | Gruparge</title>
</head>
<body>
    <div class="container">
        <div class="row mt-5">
            <div class="col-lg-12">
                <form action="{{route('dashboard.store')}}" method="post">
                    @csrf
                    <div class="form-group">
                        <label for="type">Adı</label>
                        <input type="text" class="form-control" id="type" name="type" placeholder="Adı">
                        @error('type')
                        <span class="text-danger">{{$message}}</span>
                        @enderror
                    </div>
                    <div class="text-center">
                        <button type="submit" class="btn btn-success">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    </div>


<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
</body>
</html>
