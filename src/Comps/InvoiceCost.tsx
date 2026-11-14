import React, {  useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import DeskTop from './DeskTop';
import { AiOutlineDownload } from "react-icons/ai";
import config  from "../Configsettings/appsettings.json"
import axios from 'axios';

interface Profictstmnt
    {
        "orderId": number,
        "orderFolio": string,
        "brandName": string,
        "model": string,
        "color": string,
        "lenstype": string,
        "framecost": number,
        "lenscost": number,
        "fittingcost": number,
        "createBy": string,
        "createdOn": string
      
}
const InvoiceCost:React.FC=()=>{
    const profitStmnt=
        {
            "orderid": 0,
            "lensCost": 0,
            "fittingCost": 0,
            "createBy":localStorage.getItem("username")
          }
    
          
         const[profitdata,SETPROFITDATA]=useState<Profictstmnt[]>([]);
         const[profitstatement]=useState(profitStmnt);
         const formatDate = (date:Date) => {
            return date.getDate().toString().padStart(2, '0') + "-" + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + "-" + 
                   date.getFullYear();
          };
         
const viewInvoice=async()=>{
    const url=config.Serviceurl.Profitstmet;
    const fdate=(document.getElementById("frmdte") as HTMLInputElement).value;
    const tdate=(document.getElementById("todte") as HTMLInputElement).value;
    let frmdate:Date=new Date(fdate);
    let todate:Date=new Date(tdate);
    var response=await axios.get(url,{
      params: {
        fromdate:frmdate ,
        todate: todate,
      },
    });
    SETPROFITDATA(response.data);
  
};
const genStatement=async(indx:any)=>{

    var url=config.Serviceurl.genProfitstmnt;
    const activeElement = document.activeElement as HTMLElement;
    const doc=activeElement?.getAttribute("name");
    let ordId:any=doc?.split("_")[1];
   
    let lcost:number=parseInt((document.getElementById("txtlcost_"+indx) as HTMLInputElement).value);
    let fcost:number=parseInt((document.getElementById("txtfitcost_"+indx) as HTMLInputElement).value);
    profitstatement.orderid=ordId;
    profitstatement.lensCost=lcost;
    profitstatement.fittingCost=fcost;
  
    const response=await axios.post(url,profitstatement);
    let msg:any={};
    msg=response.data;
    alert(msg.message);

   

}   

         return(
            <>
           <DeskTop />
           
           <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
             Cost Statement Creation
            </div> 
            <div className="row">
        <div className="col-sm-2">
          <label htmlFor='fromdate' style={{float:"right"}}>From Date
          </label>
        </div>
        <div className="col-sm-3">
         <input type="date" id="frmdte" className='form-control'></input>
        </div>
       
        <div className="col-sm-2">
          <label htmlFor='todate' style={{float:"right"}}>To Date
          </label>
        </div>
        <div className="col-sm-3">
         <input type="date" id="todte" className='form-control'></input>
        </div>
        <div className="col-sm-2">
         <button id="btnView" type="button" className="btn btn-primary" onClick={viewInvoice} style={{marginBottom:"2%"}}>View</button>
        </div>
        </div>
    <div className='col-sm-10 container'>
        <div style={{height:"300px",overflowY:"scroll"}}>
             {profitdata.length > 0 ? (
             <table className='table table-bordered' style={{ borderCollapse: "collapse", width: "100%",fontSize:"12px"}}>
               <thead>
                 <tr>
                   <th>Serial</th>
                   <th>OrderId</th>
                   <th>OrderFolio</th>
                   <th>OrderDate</th>
                   <th>Brand</th>
                   <th>Model</th>
                   <th>Color</th>
                   <th>Frame Cost</th>
                   <th>Lens</th>
                   <th>Lens Cost</th>
                   <th>Fittings</th>
                   <th>Action</th>
                   </tr>
                   </thead>
                  <tbody>
                  {profitdata.map((item,index) => (
         
         <tr key={item.orderId}> 
             <td>{index+1}</td>
             <td>{item.orderId}</td>
             <td>{item.orderFolio}</td>
             <td className="col-sm-1">{formatDate(new Date(item.createdOn))}</td>
             <td>{item.brandName}</td>
             <td>{item.model}</td>
             <td className="col-sm-1">{item.color}</td>
             <td className="col-sm-1">{item.framecost}</td>
             <td className="col-sm-3">{item.lenstype}</td>
             <td >
               <input type="text" id={"txtlcost_"+item.orderId} className="form-control" ></input></td>
               <td >
               <input type="text" id={"txtfitcost_"+item.orderId} className="form-control" readOnly value={item.fittingcost} ></input></td> 
               <td><button id="btnCreate" className="btn btn-primary" onClick={()=>genStatement(item.orderId)} name={"btn_"+item.orderId}>Create</button></td> 
             </tr>
                  ))}
                  </tbody>
                  </table>
             ):(<p>No data available</p>)}
             </div>
             </div> 
             
            </>
     
     )

}
export default InvoiceCost