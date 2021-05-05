<?php

namespace App\Http\Controllers;

use App\Models\Canvas;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function saveCanvasData(Request $request)
    {
        $canvasModel = Canvas::find(1);
        $canvasModel->canvas = $request->canvas;
        $canvasModel->type = $request->type;
        $isSave = $canvasModel->save();
        if($isSave)
            return true;
        return false;
    }

    public function getCanvasData(Request $request)
    {
        $canvasData = Canvas::find(1);
        $canvasData = $canvasData->toJson();
        return $canvasData;
    }
}
