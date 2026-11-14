import React, {  useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import DeskTop from './DeskTop';
import config  from "../Configsettings/appsettings.json"
import axios from 'axios';
import { Modal, Button, ModalTitle } from "react-bootstrap";
import { Alert , Snackbar} from '@mui/material';
interface ledgetRequest
 {
    "ledgerName": string,
    "ledgerDescrp": string,
    "ledgerDate": Date,
    "ledgerType": string,
    "ledgerAmount": number
  }
 interface balancerequest
 {
    "year": number,
    "day": number,
    "month": number
  }
  interface ledgetResponse
 {
    "ledgerId":number,
    "ledgerName": string,
    "ledgerDescrp": string,
    "ledgerDate": Date,
    "ledgerType": string,
    "ledgerAmount": number
  }
const DailyLedger:React.FC=()=>{
   
    const dailyBalance={
        balance:0
      }

      const [ledRequest]=useState<ledgetRequest>({ledgerName:'',ledgerDescrp:'',ledgerDate:new Date(),ledgerType:'',ledgerAmount:0});
      const [balrequest]=useState<balancerequest>({year:0,day:0,month:0});
      const [servererror, setError] = useState({ Message: "Server error" });
      const [balance,setBalance]=useState(dailyBalance);
      const [show,setShow]=useState<boolean>(false);
      const [showLedger,setLedger]=useState<ledgetResponse[]>([])
       const [errorMessage, setErrorMessage] = useState('');
       const [successMessage, setSuccessMessage] = useState('');
       const formRef = useRef<HTMLFormElement>(null);
       const setFocus=useRef<HTMLInputElement>(null);
      const [resetTrigger, setResetTrigger] = useState(false);
      useEffect(() => {
        const fetchBalance = async () => {
          try {
            const url2=config.Serviceurl.BalanceUrl;
            const tdate=new Date().toLocaleDateString("en-CA");
            const yr=tdate.split("-")[0];
            const dt=tdate.split("-")[2];
            const mn=tdate.split("-")[1];
            balrequest.year=parseInt(yr);
            balrequest.day=parseInt(dt);
            balrequest.month=parseInt(mn);
            const response = await axios.post(url2, balrequest);
            setBalance(response.data); // Set the API response to state
            
          } catch (error) {
            console.error("Error fetching balance:", error);
          }
        }
    
        fetchBalance(); // Call the function inside useEffect
        resetinput();
        const isModalOpen = localStorage.getItem("showModal") === "true";
        if (isModalOpen) {
          setShow(true);
        }
      }, []); 
      
      const SaveLedger=async()=>{
       // const tdate=new Date().toLocaleDateString("en-CA");
       // const yr=tdate.split("-")[0];
       // const dt=tdate.split("-")[2];
       // const mn=tdate.split("-")[1];
       const today = new Date();

    balrequest.year = today.getFullYear();
    balrequest.month = today.getMonth() + 1;
    balrequest.day = today.getDate();
       // balrequest.year=parseInt(yr);
       //// balrequest.day=parseInt(dt);
       // balrequest.month=parseInt(mn);
      
        ledRequest.ledgerName=(document.getElementById("txtledger") as HTMLInputElement).value;
        ledRequest.ledgerDescrp=(document.getElementById("txtledgerdesc")as HTMLInputElement).value;
        
        ledRequest.ledgerType=(document.getElementById("ledgerType") as HTMLSelectElement)?.value; 
        ledRequest.ledgerAmount=parseInt((document.getElementById("txtAmount") as HTMLSelectElement)?.value);
        ledRequest.ledgerDate= new Date(`${today.getFullYear()}-${today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1}-${today.getDate() < 10 ? '0' + today.getDate() : today.getDate()}`);
        let url1=config.Serviceurl.LedgerUrl;
        let url2=config.Serviceurl.BalanceUrl;
        try
        {
         const apiresponse= await axios.post(url1,ledRequest)
         if(apiresponse.data!=null)
         {
           
           const response= await axios.post(url2,balrequest)
          
           setBalance(response.data);
         
           
         }
         setSuccessMessage("Ledger Updated Sucessfully");
        }
 
       catch(error:any){setErrorMessage("Fail To Update ,may be server Error");}
       
               
      }
      const resetinput=()=>{
       
        formRef.current?.reset();
        setErrorMessage('');
        setSuccessMessage('');
        setFocus.current?.focus();
      }

     const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`;
};
      const showmodal=()=>{
       
        localStorage.setItem("showModal", "true");
        window.location.reload();
      };
     const viewStatement=async()=>{
      let url3=config.Serviceurl.DailyledgerDsiplay;
      const fdate=(document.getElementById("frmdte") as HTMLInputElement).value;
      const tdate=(document.getElementById("todte") as HTMLInputElement).value;
      let frmdate:Date=new Date(fdate);
      let todate:Date=new Date(tdate);
      var response=await axios.get(url3,{
        params: {
          fromdate:frmdate ,
          todate: todate,
        },
      });
      setLedger(response.data);
      
     } 

return(
       <>
      <DeskTop />
      <Snackbar
  open={Boolean(successMessage)}
  autoHideDuration={4000}
  onClose={() => setSuccessMessage('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setSuccessMessage('')}
  >
    {successMessage}
  </Alert>
</Snackbar>

<Snackbar
  open={Boolean(errorMessage)}
  autoHideDuration={6000}
  onClose={() => setErrorMessage('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity="error"
    variant="filled"
    onClose={() => setErrorMessage('')}
  >
    {errorMessage}
  </Alert>
</Snackbar>
<form ref={formRef}>
      <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Daily Ledger Entry
       </div> 
       <div className="card col-sm-10 container" >
         <div className="row" style={{marginTop:"1%"}}>
         <div style={{float:"right"}}>
            <input type='text' className="form-control" style={{textAlign:"right"}} value={formatDate(new Date) }></input>
         </div>
         </div>
         <div className="row" style={{marginTop:"1%"}}>
         <div className='col-sm-6'>
           
         </div>
         <div className='col-sm-3'>
            <label style={{float:"right"}} >Balance</label>
         </div>
         <div className='col-sm-3'>
           <input type="number" id="txtbalance" name="tbalance" className='form-control' value={balance.balance}></input>
         </div>
       </div>
         <div className="row" style={{marginTop:"1%"}}>
         <div className='col-sm-3'>
            <label style={{float:"right"}}>Ledger Name</label>
         </div>
         <div className='col-sm-4'>
            <input type="text" id="txtledger" 
            name="txtledgernm" 
            className='form-control'
            ref={setFocus}
            ></input>
         </div>
       </div>
       <div className="row" style={{marginTop:"1%"}}>
         <div className='col-sm-3'>
            <label style={{float:"right"}}>Description</label>
         </div>
         <div className='col-sm-4'>
            <textarea id="txtledgerdesc" name="txtledgdesc" className='form-control'></textarea>
         </div>
       </div>
       <div className="row" style={{marginTop:"1%"}}>
         <div className='col-sm-3'>
            <label style={{float:"right"}}>Ledgertype</label>
         </div>
         <div className='col-sm-4'>
           <select id="ledgerType" className='form-select'>
            <option value="">Select Type</option>
            <option value="Cr">Cr</option>
            <option value="Dr">Dr</option>
           </select>
         </div>
       </div>
       <div className="row" style={{marginTop:"1%"}}>
         <div className='col-sm-3'>
            <label style={{float:"right"}}>Amount</label>
         </div>
         <div className='col-sm-4'>
          <input type="text" id="txtAmount" name="tamount" className='form-control'></input>
         </div>
       </div>
       <div className="row" style={{marginTop:"1%"}}>
        <div className="d-flex justify-content-center align-items-center ">
        <button className='btn btn-primary' id="btnsave" name="btncreate" style={{marginBottom:"1%"}} onClick={SaveLedger}>Save Ledger</button>
        <button className='btn btn-primary'  id="btnreset" name="btnreset"  style={{marginLeft:"2%",marginBottom:"1%"}} onClick={resetinput}>Reset</button>
        <button className='btn btn-primary' id="btnStatement" name="btncreate" style={{marginLeft:"2%",marginBottom:"1%"}} onClick={showmodal}>View Statement</button>
        </div>
      </div>
      
      </div>
      </form>
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header  className="col-sm-12  ">
        <div className="col-sm-12 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
         View ledger Statement
       </div>  
       
       
        </Modal.Header>
        <Modal.Body>
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
         <button id="btnView" type="button" className="btn btn-primary" onClick={viewStatement} style={{marginBottom:"2%"}}>View</button>
        </div>
        </div>   
        <div style={{height:"300px",overflowY:"scroll"}}>
        {showLedger.length > 0 ? (
        <table className='table table-bordered' style={{ borderCollapse: "collapse", width: "100%",fontSize:"12px"}}>
          <thead>
            <tr>
              <th>Serial</th>
              <th>Ledger Date</th>
              <th>Ledger</th>
              <th>Description</th>
              <th>Amount</th>
              </tr>
              </thead>
             <tbody>
             {showLedger.map((item,index) => (
    
    <tr key={item.ledgerId}> 
        <td>{index+1}</td>
        <td>{formatDate(new Date(item.ledgerDate))}</td>
        <td>{item.ledgerName}</td>
        <td>{item.ledgerDescrp}</td>
        <td style={{ color: item.ledgerType === "Dr" ? "red" : "green" }}>
          {item.ledgerAmount.toFixed(2)}</td>
        </tr>
             ))}
             </tbody>
             </table>
        ):(<p>No data available</p>)}
        </div>

        </Modal.Body>
        <Modal.Footer>
        <div className="row" style={{ display: "flex", alignItems: "center" }}>
    {/* Green Indicator with Label */}
    <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
      <div
        style={{
          width: "8px",
          height: "8px",
          border: "1px solid green",
          background: "green",
          marginRight: "5px",
        }}
      ></div>
      <span style={{fontSize:"10px"}}>Credit</span>
    </div>

    {/* Red Indicator with Label */}
    <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
      <div
        style={{
          width: "8px",
          height: "8px",
          border: "1px solid red",
          background: "red",
          marginRight: "5px",
        }}
      ></div>
      <span style={{fontSize:"10px"}}>Debit</span>
    </div>
  </div>

            
       
          <button className='btn btn-secondary' onClick={() => {
       setShow(false);
        localStorage.removeItem("showModal");
        }}>Close</button>
        </Modal.Footer>
        </Modal>
       </>

)
}
export default DailyLedger;