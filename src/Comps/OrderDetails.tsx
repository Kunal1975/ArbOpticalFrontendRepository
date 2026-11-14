import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import config  from "../Configsettings/appsettings.json"
import { FaSearch } from 'react-icons/fa';
import { useDispatch,useSelector } from 'react-redux';
import { addOrderdetails } from './Slices/OrderdetailsSlice';
import { RootState,AppDispatch } from './Store/Store';
import axios from 'axios';

 interface orders
   {
        "orderid":number,
        "orderFolio":string
   }
   interface OrderDetailsforProfit {
  "ordid": number,
  "ordDate": string,
  "ordPrice": number,
  "frameId": number,
  "frmPrice": number,
  "lwhPrice": number,
  "ftcost": number,
  "othExpn": number,
  "profit": number,
  "createdBy": string,
  "createdAt": string
}
const OrderDetails:React.FC=()=>{

        type OrdDetails={
              "orderValue": number,
              "frameId": number,
              "framePrice": number,
              "orderdate":string
}

       const [showOrderDetailsPage,setOrderDetailsPage]=useState(false);
       const [options, setOptions] = useState<orders[]>([]);
       const [selected, setSelected] = useState<number | "">("");
       const [Details,getdetails]=useState<OrdDetails>();
       const [Oderdetails,getOrderDetails]=useState<OrderDetailsforProfit>();
       const dispatch = useDispatch<AppDispatch>();
       const { details, status, error } = useSelector((state: RootState) => state.OrderDetails);

   useEffect(()=>{
        const usr=localStorage.getItem("userType");
        
      if(usr?.toLowerCase()=="admin")
      
       setOrderDetailsPage(true);
      else
       setOrderDetailsPage(false);
   },[]);

   const setOrders=async(e: React.FormEvent)=>{ 
       e.preventDefault();
        var ordDate=(document.getElementById("fromDate") as HTMLInputElement).value
        var tordDate=(document.getElementById("toDate") as HTMLInputElement).value
        const url=config.Serviceurl.OrderList;
        
       await axios.get(url, {
             params: {
                      fromDate: ordDate,
                      toDate: tordDate
                     }
                     })
      .then((response) => {
        // Assuming API returns an array like: ["Option1", "Option2", ...]
       
        setOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dropdown options:", error);
      });
    }

   const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
           setSelected(Number(e.target.value));
          
       }
       const getDetails=async(e: React.FormEvent)=>{
              e.preventDefault();
          const url=config.Serviceurl.FramePrice
          await axios.get(url,{params:{
              orderId:selected
          }
               
       }).then((response)=>{
              getdetails(response.data)
       })
       .catch((error) => {
        console.error("Error fetching dropdown options:", error);
      });
       }

        const resetinput=()=>{
        window.location.reload();
      }
      const postOrderDetails=async(e: React.FormEvent<HTMLFormElement>)=>{
       e.preventDefault();
        try {

                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const OrderDetailsforProfitobj={
                     ordid:selected,
                     ordDate:Details?.orderdate,
                     ordPrice:formData.get('txtordvalue'),
                     frameId:formData.get('txtframeid'),
                     frmPrice:formData.get('txtframeprice'),
                     lwhPrice:formData.get('txtlwhPrice'),
                     ftcost:formData.get('txtfittingcost'),
                     othExpn:formData.get('txtothercost'),
                     createdBy:localStorage.getItem("userName"),
                     createdAt:new Date().toISOString().split("T")[0]
                    }
                    const newdata=JSON.stringify(OrderDetailsforProfitobj);
                    const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                        if(doc!="btnreset")
                        {
                     let confirm=window.confirm("Please check the data before Saving.Click yes if data is correct?")
                     if(confirm)
                     {

                           
                           var entryData=JSON.parse(newdata);
                            const  response= await dispatch(addOrderdetails(entryData)).unwrap();
                                                    if(response?.ordid>0)
                                                       alert("Data Saved Sucessfully")  
                     }
       
              }
       
              }         
        catch(exception)
        {

        }
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
      
      {showOrderDetailsPage == true ? (
      <form style={{display:showOrderDetailsPage ? "block" : "none"}} onSubmit={postOrderDetails}>
       <div className="col-sm-12 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Order Details Entry
      
       </div> 
       <div className='container col-sm-12 border border-primary' style={{marginBottom:"1%"}} >
       <div className='row' style={{marginTop:"1%"}}>
              <div className='col-sm-6'></div>
              <div  className='col-sm-6'>
                <div className='row'>
                     <div className='col-sm-1'>
                            <label style={{fontSize:"14px",float:"right"}}>From:</label>
                     </div>
                     <div className='col-sm-4'>
                        <input type="date" className="form-control"  id="fromDate"></input>
                    </div>
                     <div className='col-sm-1'>
                            <label style={{fontSize:"14px",float:"right"}}>To:</label>
                     </div>
                     <div className='col-sm-4'>
                        <input type="date" className="form-control"  id="toDate"></input>
                    </div>
                    <div className='col-sm-1'>
                     <button id="btngo" className='btn btn-primary' onClick={setOrders}>Go</button>
                    </div>
                </div>
              </div>
       </div>
       <div className='row' style={{marginTop:"2%",marginBottom:"1%"}}>
              <div className='col-sm-2'>
                     <label style={{fontSize:"14px",float:"right"}}>Orders:</label>
              </div>
              <div className='col-sm-4'>
                     <select className="form-select"  id="drporders"  onChange={handleChange}>
               <option value="">-- Select --</option>
                     {options.map((order) => (
                          <option key={order.orderid} value={order.orderid}>
                            {order.orderFolio}
                 </option>
        ))}
                
            </select>
            </div>
            <div className='col-sm-2'>
              <button id="btnOrdDetails" className='btn btn-primary' onClick={getDetails} >Details</button>
            </div>
              
        
      
      
       </div>
       </div>
       <div className='container col-sm-12 border border-primary'  style={{marginTop:".5%"}}>
       <div className='row col-sm-12' style={{marginTop:"1%"}}>
       <div className='col-sm-2'>
              <label > OrderDate</label>
       </div>
       <div className='col-sm-4'>
              <input type="text" className='form-control' name="txtorddate" value={Details?.orderdate?formatDate(Details.orderdate):''} readOnly></input>
       </div>
        </div>       
        <div className='row col-sm-12' style={{marginTop:"1%"}}>
              <div className='col-sm-2' >
                     <label>Order value:</label>
              </div>
               <div className='col-sm-4'>
                    <input type="text" className='form-control' readOnly  value={Details?.orderValue} name="txtordvalue"></input>
              </div>
              <div className='col-sm-2'>
                     <label>Frame Id:</label>
              </div>
               <div className='col-sm-4'>
                    <input type="text" className='form-control' readOnly value={Details?.frameId} name="txtframeid"></input>
              </div>
        </div>
        <div className='row col-sm-12' style={{marginTop:"1%"}}>
              <div className='col-sm-2'>
                     <label>Frame value:</label>
              </div>
               <div className='col-sm-4'>
                    <input type="text" className='form-control' readOnly value={Details?.framePrice} name="txtframeprice"></input>
              </div>
              <div className='col-sm-2'>
                     <label>Lens Cost:</label>
              </div>
               <div className='col-sm-4'>
                    <input type="text" className='form-control' name='txtlwhPrice' ></input>
              </div>
        </div>
        <div className='row col-sm-12' style={{marginTop:"1%"}}>
              <div className='col-sm-2'>
                     <label>Fitting cost:</label>
              </div> 
               <div className='col-sm-4'>
                    <input type="text" className='form-control' name='txtfittingcost' ></input>
              </div>
              <div className='col-sm-2'>
                     <label>Other Cost:</label>
              </div>
       
               <div className='col-sm-4' style={{marginBottom:"1%"}}>
                    <input type="text" className='form-control' name='txtothercost' ></input>
              </div>
        </div>
        <div className='row col-sm-12' style={{marginTop:"1%",marginBottom:"1%"}}>
              <div className='col-sm-12 center' style={{textAlign:"center"}}>
              <button id="btncreate" className='btn btn-primary' >Create</button>
               <button name="btnreset" className='btn btn-primary' style={{marginLeft:"1%"}} onClick={resetinput}>Reset</button>
              </div>

        </div>
       </div>
      </form>
      ):(
    <div className="container text-center mt-5">
        <h4 className="text-danger">You have no access</h4>
    </div>
   )}
      
       </>

)
}
export default OrderDetails;


