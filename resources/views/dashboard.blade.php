<!doctype html>
<html lang="tr">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Font awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">

    <title>Ges | Gruparge</title>
</head>
<body>
    <div class="container">
        <div class="row mt-5">
            <div class="col-lg-12 text-center mb-3">
                <a href="{{route('dashboard.create')}}" class="btn btn-success"><i class="fas fa-plus"></i></a>
            </div>
            <div class="col-lg-12">
                <table class="table table-bordered">
                    <thead class="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Adı</th>
                            <th>İşlem</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($canvases as $canvas)
                            <tr id="item-{{$canvas->id}}">
                                <td>{{$loop->iteration}}</td>
                                <td>{{$canvas->type}}</td>
                                <td width="10">
                                    <div class="btn-group" role="group" aria-label="First group">
                                        <a href="{{route('dashboard.show',$canvas->id)}}" type="button" class="btn btn-info"><i class="fas fa-eye"></i></a>
                                        <a href="{{route('dashboard.edit',$canvas->id)}}" class="btn btn-warning"><i class="fas fa-edit"></i></a>
                                        <button onclick="deleteItem('{{$canvas->id}}')" class="btn btn-danger"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script>
        $(()=>{
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        });
        function deleteItem(id) {
            $.ajax({
                type: "DELETE",
                url: "dashboard/"+id,
                success: function (data) {
                    if (data) {
                        console.log("data"+data)
                        $('#item-'+id).remove();
                    }
                }
            });
        }

    </script>
</body>
</html>
