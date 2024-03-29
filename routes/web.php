<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\DefaultController;
use App\Http\Controllers\DeviceController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Route::get('/',[IndexController::class,'index'])->name('index');
//Route::post('/',[IndexController::class,'saveCanvasData'])->name('saveCanvasData');
//Route::post('/getCanvasData',[IndexController::class,'getCanvasData'])->name('getCanvasData');

Route::get('/', function () {
    return redirect('/dashboard');
});

Route::resource('dashboard',DefaultController::class);
Route::post('/dashboard/addCanvasData',[DefaultController::class,'addCanvasData'])->name('addCanvasData');
Route::post('/dashboard/searchDevices',[DefaultController::class,'searchDevices'])->name('searchDevices');
Route::post('/dashboard/getDevice',[DefaultController::class,'getDevice'])->name('getDevice');
Route::post('/dashboard/getDevices',[DefaultController::class,'getDevices'])->name('getDevices');
