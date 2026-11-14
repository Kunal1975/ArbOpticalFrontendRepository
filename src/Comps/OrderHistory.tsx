import React, {  useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeskTop from './DeskTop';
import config  from "../Configsettings/appsettings.json"
import axios from 'axios';
import { Modal, Button, ModalTitle } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface OrderHistory
{
   "custId": number,
    "custName": string,
    "orderFolio": string,
    "custMobile": string,
    "rsph": string,
    "rcyl":string,
    "raxis": number,
    "rAdd": string,
    "rva": string,
    "lsph": string,
    "lcyl": string,
    "laxis": number,
    "lAdd": string,
    "lva": string,
    "repd": number,
    "lepd": number,
    "rFittingHeight": number,
    "lFittingHeight": number,
    "rBifocalHeight": number,
    "lbifocalheight": number,
    "lensType": string,
    "brandName": string,
    "model": string,
    "orderdate": string,
    "frameMrp": number,
    "lensMrp": number
}

  const OrderHistory:React.FC=()=>{
    const [ordhistory,setordhistory]=useState<OrderHistory []>([]);
      const fetchHistory=async()=>{
        var mob=(document.getElementById("txtmob") as HTMLInputElement).value
        var nm=(document.getElementById("txtname") as HTMLInputElement).value
        const url=config.Serviceurl.Orderhistory
       
          await axios.get(url,{
            params: {
        Mobile: mob,
        FirstName: nm
      }
          })
          .then((response)=>{setordhistory(response.data);
           
          }).catch((exception)=>{alert("Error has Occured or No data found");})
          
        
      
      }

       const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
};



    return(
        <>
      <DeskTop />
      
       <div className="col-sm-12 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Customer Order History
        </div>
        <div className='container ' style={{border:"1px groove blue"}}>
            <div className='row'>
                <div className='col-sm-12' >
                    <label style={{fontWeight:"bold"}}>Seardch Panel</label>
                </div>
            </div>
            <div className='row' style={{marginBottom:"1%"}}>
                <div className='col-sm-2'>
                    <label style={{float:"right"}} >Mobile No:</label>
                </div>
                <div className='col-sm-2'>
                   <input type="text" className='form-control' id="txtmob"></input>            
                   </div>
           
             <div className='col-sm-2'>
                    <label style={{float:"right"}}>First Name:</label>
                </div>
                <div className='col-sm-2'>
                   <input type="text" className='form-control' id="txtname"></input>            
                   </div>
            
            <div className='col-sm-2'>
                <button id="btnSeach" className='btn btn-primary' onClick={fetchHistory}>Go</button>
            </div>
             
            </div> 
            <div className='row' style={{marginTop:"1%",border:"1px solid blue"}}>
              <div className='col-sm-12' style={{overflowX:"scroll"}}>
               <table className='table table-bordered' style={{ borderCollapse: "collapse", width: "100%",fontSize:"12px"}}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Folio</th>
              <th style={{width:"15%"}}>Order Date</th>
              <th style={{width:"10%"}}>Name</th>
              <th>Mobile</th>
             <th>Brand</th>
             <th>Model</th>
             <th>Frame Mrp</th>
             <th style={{width:"25%"}} >Lenstype</th>
             <th>Lens Mrp</th>
             <th>Power(R)</th>
             <th>Power(L)</th>
             <th>REPD</th>
             <th>LEPD</th>
             


            </tr>
            </thead>
            
            <tbody>
              {ordhistory.map((item,index) => (
                  <tr key={item.custId}>
                      <td>{index+1}</td>
                      <td>{item.orderFolio}</td>
                      <td style={{width:"10%"}}>{formatDate(item.orderdate)}</td>
                      <td >{item.custName}</td>
                      <td>{item.custMobile}</td>
                      <td>{item.brandName}</td>
                      <td>{item.model}</td>
                      <td>{item.frameMrp}</td>
                      <td style={{width:"25%"}}>{item.lensType}</td>
                      <td>{item.lensMrp}</td>
                    <td><table className="table table-bordered" >
         <tr><th>Rsph</th><th>RCYL</th><th>RAxis</th><th>RAdd</th><th>RVA</th></tr>
         <tr><td>{item.rsph}</td><td>{item.rcyl}</td><td>{item.raxis}</td><td>{item.rAdd}</td>
         <td>{item.rva}</td>
         </tr>
        </table></td>
        <td><table className="table table-bordered">
         <tr><th>Lsph</th><th>LCYL</th><th>LAxis</th><th>LAdd</th><th>LVA</th></tr>
         <tr><td>{item.lsph}</td><td>{item.lcyl}</td><td>{item.laxis}</td><td>{item.lAdd}</td>
         <td>{item.lva}</td>
        </tr>
        </table></td>
         <td>
          {item.repd}
         </td>
         <td>{item.lepd}</td>
         
         </tr>
                  
              ))}
            </tbody>
            </table>
              </div>
            </div>
         </div> 
            
          
        
        </>
    )
  }

  export default OrderHistory