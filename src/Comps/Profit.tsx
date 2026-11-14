import React, {  useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import DeskTop from './DeskTop';
import { AiOutlineDownload } from "react-icons/ai";
import config  from "../Configsettings/appsettings.json"
import axios from 'axios';

interface Profictstmnt
{

 orderFolio:string, 
 orderDate:string,
 orderPrice:number,
 framePrice:number,
 lensWhPrice:number,
 fittings:number, 
 otherExpences:number,
 totalExpences:number,
 profit:number
}
const Profit:React.FC=()=>{
   
          
         const[profitdata,SETPROFITDATA]=useState<Profictstmnt[]>([]);
         const[show,setShow]=useState(false);
          const [Totalprofit,seTotal]=useState(0);
         const formatDate = (dateStr: string): string => {
            const date = new Date(dateStr);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
          };
         useEffect(()=>{
           const usr=localStorage.getItem("userType");
      if(usr?.toLowerCase()=="admin")
      {
        setShow(true)
      }
      else
         setShow(false);
         },[])
const viewInvoice=async()=>{
    const url=config.Serviceurl.profitListByDate;
    
    const fdate=(document.getElementById("frmdte") as HTMLInputElement).value;
    const tdate=(document.getElementById("todte") as HTMLInputElement).value;
   
    await axios.get(`${url}/${fdate}/${tdate}`)
    .then((response)=>{
       const data=response.data;
         SETPROFITDATA(data);
         seTotal(data.reduce((acc:number, item:Profictstmnt) => acc + Number(item.profit || 0), 0));
    }).catch((error) => {
        console.error("Error fetching dropdown options:", error)  });
    
    
   

};


         return(
            <>
           <DeskTop />
           {show ==true ? (
             <form style={{display:show?"block":"none"}}>
               <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
                 Profit Per Order
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
                   <th>OrderFolio</th>
                   <th>OrderDate</th>
                   <th>Order Value(A)</th>
                   <th>Frame Cost(B)</th>
                   <th>Lens Cost(C)</th>
                   <th>Fitting(D)</th>
                   <th>Others(E)</th>
                   <th>Total Expences(B+C+D+E)</th>
                  <th>Profit(A-(B+C+D+E))</th>
                   </tr>
                   </thead>
                  <tbody>
                  {profitdata.map((item,index) => (
         
         <tr key={item.orderFolio}> 
             <td>{index+1}</td>
             <td>{item.orderFolio}</td>
             <td>{formatDate(item.orderDate)}</td>
             <td style={{textAlign:"right"}}>{item.orderPrice}</td>
             <td style={{textAlign:"right"}}>{item.framePrice}</td>
             <td style={{textAlign:"right"}}>{item.lensWhPrice}</td>
            <td style={{textAlign:"right"}}>{item.fittings}</td> 
            <td style={{textAlign:"right"}}>{item.otherExpences}</td>
             <td style={{textAlign:"right"}}>{item.totalExpences}</td>
             <td style={{textAlign:"right"}}>{item.profit}</td>
             </tr>
                  ))}
             <tr>
              <td>Total:</td>
              <td colSpan={11} style={{color:"green",textAlign:"right"}}>{Totalprofit}</td>
              </tr>     
                  </tbody>
                  </table>
             ):(<p>No data available</p>)}
             </div>
             </div> 
             </form>
           ):(<div className="container text-center mt-5">
        <h4 className="text-danger">You have no access</h4>
            </div>
          )}
            </>
     
     )

}
export default Profit