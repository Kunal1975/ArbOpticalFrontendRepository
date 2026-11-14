import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import { FaSearch } from 'react-icons/fa';
import { useDispatch,useSelector } from 'react-redux';
import {createNewOrder} from './Slices/Orderslice';
import { RootState,AppDispatch } from './Store/Store';
import CustomerPopup from './CustomerPopup';
import { Modal, Button, ModalTitle } from "react-bootstrap";
import StockPopup from './StockPopup';
import { Alert , Snackbar} from '@mui/material';
const Orderbook:React.FC=()=>{
    const initialFrameData = {
        "orderFolio": "",
        "orderType": "",
        "custId":0,
        "custMobile": "",
        "inventoryID": 0,
        "lensType": "",
        "lensVENDOR": "",
        "fvendor": "",
        "rsph": "",
            "rcyl": "",
            "raxis": 0,
            "rAdd": "",
            "rva": "",
            "lsph": "",
            "lcyl": "",
            "laxis": 0,
            "lAdd": "",
            "lva": "",
        "repd": "",
        "lepd": "",
        "rFittingHeight": "",
        "lFittingHeight": "",
        "rBifocalHeight": "",
        "lbifocalheight": "",
        "tint": "",
        "amount": 0,
        "advance": 0,
        "discount":0,
        "createdBy": "",
        "createdAt": new Date()
      };
      
            const [date, setDate] = useState(new Date());
            const[ID,setID]=useState(0);
            const[action,setAction]=useState(0);
            const[btncaption,setCaption]=useState("No Action");
            const[TotCost,setTotCost]=useState(0);
           
            const [orderData, setorderData] = useState(initialFrameData);
            const [resetTrigger, setResetTrigger] = useState(false);
            const dispatch = useDispatch<AppDispatch>();
             const { ordstatus, orderror, orders } = useSelector((state: RootState) => state.Order);
            const [showcust,setCustShow]=useState<boolean>(false);
            const [showstock,setStockShow]=useState<boolean>(false);
            const [errorMessage, setErrorMessage] = useState('');
            const [successMessage, setSuccessMessage] = useState('');
            const setFocus=useRef<HTMLInputElement>(null);
             useEffect(() => {
                if (resetTrigger) {
                    setorderData(initialFrameData); // Reset state
                  setResetTrigger(false); // Reset trigger
                     
                  }
                  setCustShow(false);
                  setStockShow(false);
                 setAction(1);
                     setCaption("Create Order")
                 // setAction(1);
              }, [resetTrigger,action]); // Runs when reset
            
              const handleSelectCustomer = (id: number, mob: string) => {
                    setorderData(prev => ({
                        ...prev,
                        custId: id,
                        custMobile: mob
                    }));
                    setCustShow(false);
              };

             const handleSelectStock = (inventoryId: number) => {
                    setorderData(prev => ({
                        ...prev,
                        inventoryID: inventoryId
                    }));

                    setStockShow(false);
                };


            const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              
                e.preventDefault();
                try {

                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const orderDateValue = formData.get("orderDate");
                    // Construct the JSON object
                    const ordaddDataobj = {
                      orderFolio:formData.get('orderfolio'),
                      orderType:formData.get('orderType'),
                      custId:formData.get('customerId'),
                      custMobile:formData.get('custmobile'),
                      inventoryID:formData.get('InventoryId'),
                      lensType: formData.get('lensType'),
                   lensVENDOR : formData.get('lensVENDOR'),
                   fvendor : formData.get('fvendor'),
                   rsph : formData.get('rsph'),
                   rcyl : formData.get('rcyl'),
                   raxis : formData.get('raxis'),
                   rAdd : formData.get('radd'),
                   rva : formData.get('rva'),
                   lsph : formData.get('lsph'),
                   lcyl : formData.get('lcyl'),
                   laxis : formData.get('laxis'),
                   lAdd : formData.get('ladd'),
                   lva : formData.get('lva'),
                   repd : formData.get('repd'),
                   lepd : formData.get('lepd'),
                   rFittingHeight : formData.get('rFittingHeight'),
                   lFittingHeight : formData.get('lFittingHeight'),
                   rBifocalHeight : formData.get('rBifocalHeight'),
                   lbifocalheight : formData.get('lBifocalHeight'),
                   tint : formData.get('tint'),
                   amount : formData.get('amount'),
                   discount:formData.get('discount'),
                   advance : formData.get('advance'),
                   createdBy : localStorage.getItem("userName"),
                   createdAt : typeof orderDateValue === "string" && orderDateValue
      ? new Date(`${orderDateValue}T00:00:00.000Z`)
      : new Date(),

                    };
                   
                      let response;
                     if(action===1)
                     {
                        
                      const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                      
                          
                        if(ordaddDataobj.orderFolio!=="" && ordaddDataobj.custMobile!==""  && doc==="btnaction")
                        {
                        var strngframe=JSON.stringify(ordaddDataobj)
                        console.log(strngframe);
                        var entryData=JSON.parse(strngframe);
                        let confirm=window.confirm("Please check the data before Saving.Click yes if data is correct?")
                        
                        if(confirm)
                        {
                          
                          response= await dispatch(createNewOrder(entryData)).unwrap();
                          if(response?.orderId>0)
                             setSuccessMessage("Data Saved Sucessfully")
                        }
                       
                        }
                    }
                  }
                  catch(exception )
                  {
                     setErrorMessage("Fail to save Data");
                  }
                }
  const resetScreen=()=>{ 
      setResetTrigger(true);     
      setFocus.current?.focus();          
     
}
  
     const showcustmodal=()=>{
        setStockShow(false);
        setCustShow(true);
       
       // localStorage.setItem("showCustModal", "true");
       // localStorage.setItem("showstockModal", "false");
       
       // window.location.reload();
      };           
 const showstocktmodal=()=>{
        setCustShow(false);
        setStockShow(true);
       
      };           


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

      <form  onSubmit={handleSubmit}>
      
      <div className="col-sm-11 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Booking New Order
       </div> 
       
      <div  className="card col-sm-10 container "  style={{height:"450px",overflow:"scroll",fontSize:"11px"}} > 
      <div className="row mt-2" style={{marginTop:"1%"}}>
      <div className="col-sm-1 text-end">
          <label htmlFor="orderDate" style={{ float: "right" }}>
            Order Date
          </label>
        </div>
        <div className="col-sm-2">
          <input
            id="orderDate"
            type="date"
            className="form-control"
            name="orderDate"
            value={orderData?.createdAt instanceof Date
                ? orderData.createdAt.toISOString().split("T")[0]
                : orderData?.createdAt ?? ""}
            onChange={(e) =>
                    setorderData({ ...orderData, createdAt: e.target.value ? new Date(`${e.target.value}T00:00:00.000Z`) : orderData.createdAt })
}
            
          />
        </div>
      </div>
      <div className="row mt-2" style={{marginTop:"1%"}}>
        <div className='col-sm-1 text-end'>
            <label htmlFor="OrderFolio" style={{float:"right"}}>OrderFolio</label>
           
        </div>
        <div className='col-sm-3 text-end'>
            <input type="text" 
            ref={setFocus}
            className="form-control" style={{float:"left"}} name='orderfolio'  value={orderData?.orderFolio||""}
            onChange={(e) =>
                setorderData({ ...orderData,orderFolio: e.target.value })
              }></input>
        </div>
        <div className='col-sm-1 text-end'>
            <label htmlFor="OrderType" style={{float:"right"}}>OrderType</label>
        </div>
        <div className='col-sm-3'>
            <select  className="form-select" style={{float:"right"}} name='orderType' value={orderData?.orderType||""}
            
            onChange={(e) =>
                setorderData({ ...orderData, orderType: e.target.value })
              }>
               <option value="SelectType"> Select Type</option>
               <option value="FullSpectacle">Full Spectacle</option>
               <option value="OnlyFrame">Frame Only</option>
               <option value="LensOnly">Lens Only</option>
               <option value="ContactLens"> Contact Lens</option>
               <option value="Sunglass">Sunglass</option>
              </select>
        </div>
        
      <div className='col-sm-1 text-end ' >
            <label htmlFor="InventoryId" style={{float:"right"}}>Stock ID</label>
        </div>
        <div className='col-sm-2 '>
            <input type="number" id="InventoryId" className="form-control" style={{marginRight:"1%"}} name="InventoryId" value={orderData?.inventoryID.toString()||""}
              onChange={(e) =>
                setorderData({ ...orderData, inventoryID: parseInt(e.target.value) })
              }
            
            ></input>
            
        </div>
         <div className='col-sm-1'style={{padding:"0%"}}>
          <button type="button" id="btnstock" onClick={showstocktmodal} className='btn btn-secondary' >..</button>
        </div>
         
      
       </div>
      
      <div className="row mt-2" style={{marginTop:"1%"}}>
      <div className='col-sm-1' >
            <label htmlFor="CustId" style={{float:"right"}}>Customer Id</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" id="customerId" className="form-control" style={{marginRight:"1%"}} name="customerId" value={orderData?.custId.toString()||""}
              onChange={(e) =>
                setorderData({ ...orderData, custId: parseInt(e.target.value) })
              }
            
            ></input>
        </div> 
        <div className='col-sm-1' style={{padding:"0%"}}>
          <button type="button" id="btcust" onClick={showcustmodal} className='btn btn-secondary'>..</button>
        </div>
     
       

           <div className='col-sm-1 text-end' >
            <label htmlFor="Mobile" style={{float:"right"}}>Mobile</label>
        </div>
        <div className='col-sm-3'>
            <input type="text" id="custMobile" className="form-control"  name="custmobile" value={orderData?.custMobile||""} 
              onChange={(e) =>
                setorderData({ ...orderData, custMobile: (e.target.value) })
              }
            
            ></input>
        </div>
          <div className='col-sm-1 text-end ' >
              <label htmlFor="lensType" style={{float:"right"}}
              >LensType</label>
          </div>
          <div className='col-sm-3'>
              <input type="text" className="form-control" name='lensType' value={orderData?.lensType || ""}
              onChange={(e) =>
                  setorderData({ ...orderData, lensType: (e.target.value) })
                }
              ></input>
          </div>
      </div>
        <div className="row" style={{marginTop:"1%"}}>
          <div className='col-sm-1 text-end'>
              <label htmlFor="tine" style={{float:"right"}} >Tint</label>
          </div>
          <div className='col-sm-3'>
              <input type="text" className="form-control" name='tint' value={orderData?.tint|| ""}
              onChange={(e) =>
                  setorderData({ ...orderData, tint: (e.target.value) })
                }
              ></input>
          </div>
          <div className='col-sm-1 text-end'>
              <label htmlFor="Amount" style={{float:"right"}} >Amount</label>
          </div>
          <div className='col-sm-3'>
              <input type="number" className="form-control" name='amount' value={orderData?.amount?.toString()|| "0"}
              onChange={(e) =>
                  setorderData({ ...orderData, amount: parseInt(e.target.value) })
                }
              ></input>
          </div>

          <div className='col-sm-1 text-end'>
            <label htmlFor="discount" style={{float:"right"}} >Discount</label>
        </div>
          <div className='col-sm-3'>
              <input type="number" className="form-control" name='discount' value={orderData?.discount?.toString()|| "0"}
              onChange={(e) =>
                  setorderData({ ...orderData, discount: parseInt(e.target.value) })
                }
              ></input>
          </div>


        <div className='row' style={{marginTop:"1%"}}>

        
        <div className='col-sm-1 text-end'  >
            <label htmlFor="Advance" style={{float:"right"}} >Advance</label>
        </div>
          <div className='col-sm-3'>
              <input type="number" className="form-control" name='advance' value={orderData?.advance?.toString()|| "0"}
              onChange={(e) =>
                  setorderData({ ...orderData, advance: parseInt(e.target.value) })
                }
              ></input>
          </div>
        </div>
       
      <div className="row" style={{marginTop:"1%"}}>
        <div  style={{backgroundColor:"Highlight",marginLeft:".5%",marginRight:".5%",width:"98%"}}>
              <label htmlFor="lensVENDOR" style={{float:"left",color:"white"}}>Vendors</label>
          </div>
        </div>
        </div>
        <div className="row" style={{marginTop:"1%"}}>
        <div className='col-sm-1'>
            <label htmlFor="lensVENDOR" style={{float:"right"}}>Lens</label>
        </div>   
        <div className='col-sm-2'>
            <input type="text" className="form-control" name='lensVENDOR' value={orderData?.lensVENDOR || ""}
            onChange={(e) =>
                setorderData({ ...orderData, lensVENDOR: (e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="fvendor" style={{float:"right"}}>Frame </label>
        </div>
        <div className='col-sm-2'>
            <input type="text" className="form-control" name='fvendor' value={orderData?.fvendor||""}
             onChange={(e) =>
                setorderData({ ...orderData, fvendor:(e.target.value) })
              } ></input>
        </div>
        </div>
        <div className="row" style={{marginTop:"1%"}}>
        <div  style={{backgroundColor:"Highlight",marginLeft:".5%",marginRight:".5%",width:"98%"}}>
            <label htmlFor="powers" style={{float:"left",color:"white"}}>Powers </label>
        </div>
        </div>
       
        <div className='row' style={{marginTop:"2%"}}>
         <div className='col-sm-1'>
            <label htmlFor="sph" style={{float:"right"}}>RSPH</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" className="form-control" name='rsph' value={orderData?.rsph||"0.00"}
                onChange={(e) =>
                    setorderData({ ...orderData, rsph: e.target.value })
                  }
             ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="cyl" style={{float:"right"}}>RCYL</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="cyl" className="form-control" name='rcyl' value={orderData?.rcyl||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, rcyl: (e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="axis" style={{float:"right"}}>RAXIS</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="axis" className="form-control" name='raxis' value={orderData?.raxis||"0"}
            onChange={(e) =>
                setorderData({ ...orderData, raxis: parseInt(e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="add" style={{float:"right"}} >RAdd</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="add" className="form-control" name='radd'  value={orderData?.rAdd||"0"}
            onChange={(e) =>
                setorderData({ ...orderData, rAdd: (e.target.value) })
              } ></input>
        </div>

        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>RVA</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="va" className="form-control" name='rva'  value={orderData?.rva||"0"}
            onChange={(e) =>
                setorderData({ ...orderData, rva: (e.target.value) })
              } ></input>
        </div>
        </div>
        <div className="row" style={{marginTop:"1%"}}>
       

        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>LSPH</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="lftsph" className="form-control" name='lsph'  value={orderData?.lsph||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, lsph: (e.target.value) })
              } ></input>
        </div>
       
        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>LCYL</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="lcyl" className="form-control" name='lcyl'  value={orderData?.lcyl||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, lcyl: (e.target.value) })
              } ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>LAXIS</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="laxis" className="form-control" name='laxis'  value={orderData?.laxis||0}
            onChange={(e) =>
                setorderData({ ...orderData, laxis: parseInt(e.target.value) })
              } ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>LADD</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="va" className="form-control" name='ladd'  value={orderData?.lAdd||"0"}
            onChange={(e) =>
                setorderData({ ...orderData, lAdd: (e.target.value) })
              } ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="va" style={{float:"right"}}>LVA</label>
        </div>
       
        <div className='col-sm-1' style={{marginBottom:"1%"}}>
            <input type="text" id="va" className="form-control" name='lva'  value={orderData?.lva||"0"}
            onChange={(e) =>
                setorderData({ ...orderData, lva: (e.target.value) })
              } ></input>
        </div>
       </div>
      
       <div className="row" style={{marginTop:"1%"}}>
        <div  style={{backgroundColor:"Highlight",marginLeft:".5%",width:"49%"}}>
            <label htmlFor="powers" style={{float:"left",color:"white",width:"98%"}}>Fittings  </label>
        </div>
        <div  style={{backgroundColor:"Highlight",marginLeft:".5%",width:"49%"}}>
            <label htmlFor="powers" style={{float:"right",color:"white",width:"98%"}}>Hights </label>
        </div>
        </div>
      <div className='row' style={{marginTop:"1%"}}>
      <div className='col-sm-1'>
            <label htmlFor="repd" style={{float:"right"}}>REPD</label>
        </div>
        <div className='col-sm-1'>
            <input type="text"  className="form-control" name='repd' value={orderData?.repd?.toString()||"0.00"}
                onChange={(e) =>
                    setorderData({ ...orderData, repd:(e.target.value) })
                  }
             ></input>
        </div>
        <div className='col-sm-1' >
            <label htmlFor="lepd" style={{float:"right"}}>LEPD</label>
        </div>
        <div className='col-sm-1'>
            <input type="text"  id="lepd" className="form-control" name='lepd' value={orderData?.lepd||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, lepd: (e.target.value) })
              }
            ></input>
        </div>
        
        <div className='col-sm-2' style={{marginLeft:"8%"}}  >
            <label htmlFor="rFittingHeight" style={{float:"right"}}>Right </label>
        </div>
        <div className='col-sm-1' >
            <input type="text"  id="rFittingHeight" className="form-control" name='rFittingHeight' value={orderData?.rFittingHeight?.toString()||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, rFittingHeight: (e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1' >
            <label htmlFor="lFittingHeight" style={{float:"right"}} >Left </label>
        </div>
        <div className='col-sm-1' >
            <input type="text" id="lFittingHeight" className="form-control" name='lFittingHeight'  value={orderData?.lFittingHeight?.toString()||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, lFittingHeight: (e.target.value) })
              } ></input>
        </div>
       
      </div>
      <div className="row" style={{marginTop:"1%"}}>
        <div  style={{backgroundColor:"Highlight",marginLeft:".5%",marginRight:".5%",width:"98%"}}>
            <label htmlFor="powers" style={{float:"left",color:"white"}}>Bifocal Heights </label>
        </div>
        </div>
     <div className="row" style={{marginTop:"1%"}}>
     
        <div className='col-sm-1'>
            <label htmlFor="rBifocalHeight" style={{float:"right"}}> Right </label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="rBifocalHeight" className="form-control" name='rBifocalHeight'  value={orderData?.rBifocalHeight?.toString()||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, rBifocalHeight: (e.target.value) })
              } ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="lBifocalHeight" style={{float:"right"}} >Left </label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="lBifocalHeight" className="form-control" name='lBifocalHeight'  value={orderData?.lbifocalheight?.toString()||"0.00"}
            onChange={(e) =>
                setorderData({ ...orderData, lbifocalheight: (e.target.value) })
              } ></input>
        </div>
     </div>
      
      <div className="row" style={{marginTop:"2%",marginBottom:"2%"}}>
        <div className='col-sm-10 text-center'>
        
          <button className="btn btn-primary" name='btnaction'  >{btncaption}</button>
          
          <button className="btn btn-primary" name='btreset' style={{marginLeft:"2%"}} type="reset" onClick={resetScreen}>Reset</button>
          
       
        </div>
      </div>

      </div>
    
      </form>
       <Modal show={showcust}
    onHide={() => setCustShow(false)}
    size="lg"
    >
                <Modal.Header  className="col-sm-12  ">
                <div className="col-sm-12 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
                Customer Selection              
                </div>  
               
               
                </Modal.Header>
                <Modal.Body>
               {showcust && (
            <CustomerPopup
                onSelectCustomer={handleSelectCustomer}
            />
        )}
                  </Modal.Body>
                  <Modal.Footer>
                   <button type='button' className='btn btn-secondary' onClick={() => {
                         setCustShow(false);
                          localStorage.removeItem("showModal");
                          }}>Close</button>
                          </Modal.Footer>
         </Modal>  
          <Modal show={showstock} onHide={() => setStockShow(false)} size="lg">
                <Modal.Header  className="col-sm-12  ">
                <div className="col-sm-12 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
                Stock Selection              
                </div>  
                </Modal.Header>
                <Modal.Body>
                 <StockPopup onSelectStock={handleSelectStock} />
                  </Modal.Body>
                  <Modal.Footer>
                   <button type='button' className='btn btn-secondary' onClick={() => {
                         setStockShow(false);
                          localStorage.removeItem("showModal");
                          }}>Close</button>
                          </Modal.Footer>
         </Modal>                
       </>

)




}


export default Orderbook;