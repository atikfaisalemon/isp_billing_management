import Axios from 'axios'
import {public_url} from '../config'
export const storeBill=async(data)=>{
    return await Axios.post(public_url+'api/bill',data).then((res)=>{
        return res;
     }).catch(e=>alert(e.response.error));
 }
 export const storeBillByClient=async(data)=>{
    return await Axios.post(public_url+'api/bill/client',data).then((res)=>{
        return res;
     }).catch(e=>alert(e.response.error));
 }
 export const viewBill=async()=>{
    return await Axios.get(public_url+'api/bill').then((res)=>{
        return res;
     }).catch(e=>console.log(e));
 }

 export const updateBillStatus=async(data, id)=>{
    return await Axios.post(public_url+`api/bill/statusupdate/${id}`, data).then((res)=>{
        return res;
     }).catch(e=>console.log(e));
 }

 export const viewClientBill = async(id)=>{
    return await Axios.get(public_url+'api/client-bill/'+id).then((res)=>{
        return res;
     }).catch(e=>console.log(e));
 }