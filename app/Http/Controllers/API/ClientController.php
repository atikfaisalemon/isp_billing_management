<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\ClientRepository;
use App\Repositories\BillRepository;

class ClientController extends Controller
{
    public $clientRepository;
    public $billRepository;

    public function __construct(ClientRepository $clientRepository,BillRepository $billRepository)
    {
        $this->clientRepository = $clientRepository;
        $this->billRepository = $billRepository;
        // $this->middleware('auth:api');
    }

    public function index(){
        $client = $this->clientRepository->getAll();
        return response()->json([
            'success' => true,
            'message' => 'client List',
            'data' => $client
        ]);
    
    }

    public function allJson(){
        $client = $this->clientRepository->getAll();
        $clientJson = array();
        foreach($client as $row=>$val){
            $clientList['value']=$val->id;
            $clientList['label']=$val->client_name;
            $clientJson[] = $clientList;
        }
        return response()->json([
            'success' => true,
            'message' => 'client List',
            'data' => $clientJson
        ]);
    
    }

    public function show($id)
    {
        $client = $this->clientRepository->findById($id);
        if(!$client){
            return response()->json([
                'success' => true,
                'message' => 'client not found',
                'data' => null
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'client',
            'data' => $client
        ]);
    }
// 
    public function find(Request $request)
    {
        $data = $request->json()->all();

        $username = $data['username'] ?? null;
        $phone = $data['phone'] ?? null;
        $client = $this->clientRepository->findByUsernameAndPhone($username, $phone);
        
        if(!$client){
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'data' => null
            ]);
        }
        $bill = $this->billRepository->getAllbyClient($client->id);
        if(!$bill){
            return response()->json([
                'success' => true,
                'message' => 'bill',
                'data' => null
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'bill',
            'data' => $bill,
            'client' => $client,
        ]);
        // return response()->json([
        //     'success' => true,
        //     'message' => 'client',
        //     'data' => $client
        // ]);
    }

    public function store(Request $request){
        $formData = $request->all();
        $validator = \Validator::make($formData,[
            'clientName' =>'required',
            'userName' =>'required',
            'package' =>'required',
            'phone' =>'required',
            'address' =>'required'
        ]);

        if($validator->fails()){
            return response()->json([
                'success'=>false,
                'error'=>$validator->getMessageBag()->first()
            ]);
        }

        $client = $this->clientRepository->create($request);
        return response()->json([
                'success'=>true,
                'message'=>'Data stored succesfully'
        ]);
    }

    public function update(Request $request,$id){
        $formData = $request->all();
        $validator = \Validator::make($formData,[
            'clientName' =>'required',
            'userName' =>'required',
            'package' =>'required',
            'phone' =>'required',
            'address' =>'required',
        ]);

        if($validator->fails()){
            return response()->json([
                'success'=>false,
                'error'=>$validator->getMessageBag()->first()
            ]);
        }

        $client = $this->clientRepository->update($request,$id);
        return response()->json([
                'success'=>true,
                'message'=>'Data stored succesfully'
        ]);
    }
    public function destroy($id)
    {
        $oldClient= $this->clientRepository->findById($id);
        if(!$oldClient){
            return response()->json([
                'success'=>false,
                'error'=>'No Client Found'
            ]);
        }
        $client = $this->clientRepository->delete($id);
        if($client){
            return client()->json([
                'success'=>true,
                'message'=>'client deleted'
            ]);
        }

    }
}
