<?php

namespace App\Http\Controllers;

use App\Models\Canvas;
use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class DefaultController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $canvases = Canvas::all();
        return view('dashboard',compact('canvases'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fillable = ['type'=>$request->type];
        $rule = ['type'=> 'required|unique:canvases'];
        $validator = Validator::make($fillable,$rule);
        if($validator->fails()){
            return back()->withErrors($validator)->withInput();
        }
        $isSave = Canvas::create($fillable);
        if($isSave) return redirect(route('dashboard.index'));
        return back()->with('Error');

    }
    /**
    $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjQwNmIyY2Q4ZDc2Mjg3YTk2MmYyYThiYjQ2YjJiN2FmOGRhOTAzZjkxNjRkYzRkYWU2ODhiNmY0ZWY2Y2EyNGY0YjI2NWQwMDAxMzQ2YjJmIiwiaWF0IjoiMTYxOTY5OTg4NS40NTYwMzciLCJuYmYiOiIxNjE5Njk5ODg1LjQ1NjA0NyIsImV4cCI6IjE2NTEyMzU4ODUuMzIyODQzIiwic3ViIjoiMTIzMjUiLCJzY29wZXMiOlsiKiJdfQ.wz1JD3-mRW9Fsz3n10ZhF64V97UqA9KLhpJW6kyHB0Kq3v_hO-bZ2IEQ1irO8LWmg4GHwdSOMvdrFCk-BOvAznCjcdemN0Z8EJh5WPHgnuhnycAJWloJzqKBxAylRQrBFxcQaN5wWq6t15w1rAxMEL8h6oQRCdZ1di8z0VoBLffjzKossW7t5uE3JSETRVRssO6TLdZRhmFplMxLBUNLVM-BTukRJvTWKBu49n4roVVVVSei566UFab85CQVXnvdY5CALkVv2WeMhfJ1S7Ln7mz1i_9yqbt6Pnbo8ZyGMeBPGWGhlYRXpn1WzG_HyJW6R-MwhhSwzSRXkw3R17bFEJNpsBIAr9QN0LJ_gfWxeDNMmR7_xtnf9h_yUFFIVujPWDA9Nyw18OvKO_cwCX7_waGMmOYV89RwSlM_uIfv6RlYQUZW3t8Ll3iXnG4PAOSC3tQgB8OHXXkut-rv1-IjSdH4aNVS2GU63jJBbNQRTTvCGhtsvV4EPvy0pslaQGUbOi8OuYCFF6zGFOZ0lCHYXgr7mzP086isl85_ygKnnSSQvCTuKuLjTJJBSAdn-SfyMPsHuIYLfuWQDo3e8o7oBub5MOrHv5Y1boMB7qM-VSZrc1bTkEmKYMV3mjQyaDRGzzFASGmNwwGirBfQOBwPH17hmxaB5bP7usfr5-77HJg";
    $response = Http::withToken($token)->get('http://splive8.test/devices');
    $devices = json_decode($response->body())->data->data;
     */

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $devices = [];
        $canvasData = Canvas::find($id);
        $canvasData = json_decode($canvasData);

        return view('indexShow',compact('canvasData','devices'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $canvas = Canvas::findOrFail($id);
        return view('edit',compact('canvas'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $model = Canvas::findOrFail($id);
        $fillable = ['type'=>$request->type];
        $rule = ['type'=> 'required'];
        $validator = Validator::make($fillable,$rule);
        if($validator->fails()){
            return back()->withErrors($validator)->withInput();
        }
        $isSave = $model->update($fillable);
        if($isSave) return redirect(route('dashboard.index'));
        return back()->with('Error');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $model = Canvas::findOrFail($id);
        $isSave = $model->delete();
        if($isSave) return true;
        return false;
    }

    public function addCanvasData(Request $request)
    {
        $canvasModel = Canvas::find($request->id);
        $canvasModel->canvas = $request->canvas;
        $isSave = $canvasModel->save();
        if($isSave){
            Device::whereCanvasId($request->id)->delete();
            foreach (json_decode($request->canvas)->objects as $obj){
                if($obj->type === 'image'){
                    $hasDevice = Device::whereCanvasId($request->id)->whereCode($obj->deviceInfo->deviceId)->first();
                    if(!$hasDevice){
                        $deviceModel = new Device;
                        $deviceModel->canvas_id = $request->id;
                        $deviceModel->code = $obj->deviceInfo->deviceId;
                        $deviceModel->save();
                    }
                }
            }
            return true;
        }
        return false;
    }

    public function searchDevices(Request $request)
    {
        $search = $request->search;
        $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjQwNmIyY2Q4ZDc2Mjg3YTk2MmYyYThiYjQ2YjJiN2FmOGRhOTAzZjkxNjRkYzRkYWU2ODhiNmY0ZWY2Y2EyNGY0YjI2NWQwMDAxMzQ2YjJmIiwiaWF0IjoiMTYxOTY5OTg4NS40NTYwMzciLCJuYmYiOiIxNjE5Njk5ODg1LjQ1NjA0NyIsImV4cCI6IjE2NTEyMzU4ODUuMzIyODQzIiwic3ViIjoiMTIzMjUiLCJzY29wZXMiOlsiKiJdfQ.wz1JD3-mRW9Fsz3n10ZhF64V97UqA9KLhpJW6kyHB0Kq3v_hO-bZ2IEQ1irO8LWmg4GHwdSOMvdrFCk-BOvAznCjcdemN0Z8EJh5WPHgnuhnycAJWloJzqKBxAylRQrBFxcQaN5wWq6t15w1rAxMEL8h6oQRCdZ1di8z0VoBLffjzKossW7t5uE3JSETRVRssO6TLdZRhmFplMxLBUNLVM-BTukRJvTWKBu49n4roVVVVSei566UFab85CQVXnvdY5CALkVv2WeMhfJ1S7Ln7mz1i_9yqbt6Pnbo8ZyGMeBPGWGhlYRXpn1WzG_HyJW6R-MwhhSwzSRXkw3R17bFEJNpsBIAr9QN0LJ_gfWxeDNMmR7_xtnf9h_yUFFIVujPWDA9Nyw18OvKO_cwCX7_waGMmOYV89RwSlM_uIfv6RlYQUZW3t8Ll3iXnG4PAOSC3tQgB8OHXXkut-rv1-IjSdH4aNVS2GU63jJBbNQRTTvCGhtsvV4EPvy0pslaQGUbOi8OuYCFF6zGFOZ0lCHYXgr7mzP086isl85_ygKnnSSQvCTuKuLjTJJBSAdn-SfyMPsHuIYLfuWQDo3e8o7oBub5MOrHv5Y1boMB7qM-VSZrc1bTkEmKYMV3mjQyaDRGzzFASGmNwwGirBfQOBwPH17hmxaB5bP7usfr5-77HJg";
        $response = Http::withToken($token)->get('http://splive8.test/devices?search='.$search);
        if($response){
            return json_decode($response->body())->data;
        }
        return [];
    }

    public function getDevice(Request $request)
    {
        $deviceId = $request->deviceId;
        $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjQwNmIyY2Q4ZDc2Mjg3YTk2MmYyYThiYjQ2YjJiN2FmOGRhOTAzZjkxNjRkYzRkYWU2ODhiNmY0ZWY2Y2EyNGY0YjI2NWQwMDAxMzQ2YjJmIiwiaWF0IjoiMTYxOTY5OTg4NS40NTYwMzciLCJuYmYiOiIxNjE5Njk5ODg1LjQ1NjA0NyIsImV4cCI6IjE2NTEyMzU4ODUuMzIyODQzIiwic3ViIjoiMTIzMjUiLCJzY29wZXMiOlsiKiJdfQ.wz1JD3-mRW9Fsz3n10ZhF64V97UqA9KLhpJW6kyHB0Kq3v_hO-bZ2IEQ1irO8LWmg4GHwdSOMvdrFCk-BOvAznCjcdemN0Z8EJh5WPHgnuhnycAJWloJzqKBxAylRQrBFxcQaN5wWq6t15w1rAxMEL8h6oQRCdZ1di8z0VoBLffjzKossW7t5uE3JSETRVRssO6TLdZRhmFplMxLBUNLVM-BTukRJvTWKBu49n4roVVVVSei566UFab85CQVXnvdY5CALkVv2WeMhfJ1S7Ln7mz1i_9yqbt6Pnbo8ZyGMeBPGWGhlYRXpn1WzG_HyJW6R-MwhhSwzSRXkw3R17bFEJNpsBIAr9QN0LJ_gfWxeDNMmR7_xtnf9h_yUFFIVujPWDA9Nyw18OvKO_cwCX7_waGMmOYV89RwSlM_uIfv6RlYQUZW3t8Ll3iXnG4PAOSC3tQgB8OHXXkut-rv1-IjSdH4aNVS2GU63jJBbNQRTTvCGhtsvV4EPvy0pslaQGUbOi8OuYCFF6zGFOZ0lCHYXgr7mzP086isl85_ygKnnSSQvCTuKuLjTJJBSAdn-SfyMPsHuIYLfuWQDo3e8o7oBub5MOrHv5Y1boMB7qM-VSZrc1bTkEmKYMV3mjQyaDRGzzFASGmNwwGirBfQOBwPH17hmxaB5bP7usfr5-77HJg";
        $response = Http::withToken($token)->get('http://splive8.test/scada/scadaValues/'.$deviceId);
        if ($response) return ($response);
        return false;
    }

    public function getDevices(Request $request)
    {
        $resultData = [];
        $codes = Device::whereCanvasId($request->canvas_id)->get()->pluck('code');
        foreach ($codes as $key => $code){
            $token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjQwNmIyY2Q4ZDc2Mjg3YTk2MmYyYThiYjQ2YjJiN2FmOGRhOTAzZjkxNjRkYzRkYWU2ODhiNmY0ZWY2Y2EyNGY0YjI2NWQwMDAxMzQ2YjJmIiwiaWF0IjoiMTYxOTY5OTg4NS40NTYwMzciLCJuYmYiOiIxNjE5Njk5ODg1LjQ1NjA0NyIsImV4cCI6IjE2NTEyMzU4ODUuMzIyODQzIiwic3ViIjoiMTIzMjUiLCJzY29wZXMiOlsiKiJdfQ.wz1JD3-mRW9Fsz3n10ZhF64V97UqA9KLhpJW6kyHB0Kq3v_hO-bZ2IEQ1irO8LWmg4GHwdSOMvdrFCk-BOvAznCjcdemN0Z8EJh5WPHgnuhnycAJWloJzqKBxAylRQrBFxcQaN5wWq6t15w1rAxMEL8h6oQRCdZ1di8z0VoBLffjzKossW7t5uE3JSETRVRssO6TLdZRhmFplMxLBUNLVM-BTukRJvTWKBu49n4roVVVVSei566UFab85CQVXnvdY5CALkVv2WeMhfJ1S7Ln7mz1i_9yqbt6Pnbo8ZyGMeBPGWGhlYRXpn1WzG_HyJW6R-MwhhSwzSRXkw3R17bFEJNpsBIAr9QN0LJ_gfWxeDNMmR7_xtnf9h_yUFFIVujPWDA9Nyw18OvKO_cwCX7_waGMmOYV89RwSlM_uIfv6RlYQUZW3t8Ll3iXnG4PAOSC3tQgB8OHXXkut-rv1-IjSdH4aNVS2GU63jJBbNQRTTvCGhtsvV4EPvy0pslaQGUbOi8OuYCFF6zGFOZ0lCHYXgr7mzP086isl85_ygKnnSSQvCTuKuLjTJJBSAdn-SfyMPsHuIYLfuWQDo3e8o7oBub5MOrHv5Y1boMB7qM-VSZrc1bTkEmKYMV3mjQyaDRGzzFASGmNwwGirBfQOBwPH17hmxaB5bP7usfr5-77HJg";
            $response = Http::withToken($token)->get('http://splive8.test/scada/scadaValues/'.$code);
            $arr = json_decode($response)->data;
            $arr->code = $code;
            $resultData[$key] = $arr;
        }
        return $resultData;
    }
}
