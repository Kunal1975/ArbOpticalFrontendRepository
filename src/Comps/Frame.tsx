import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import { FaSearch } from 'react-icons/fa';
import { useDispatch,useSelector } from 'react-redux';
import {addFrameInStock}   from './Slices/FrameSlice';
import { searchFrame } from './Slices/FrameSearchSlice';
import { updateFrameInStock } from './Slices/UpdateSlice';
import { RootState,AppDispatch } from './Store/Store';
import { Alert , Snackbar} from '@mui/material';
interface SearchRequest {
    brand:string,
    model:string,
    color:string
   }

const Frame:React.FC=()=>{
    const initialFrameData = {
        frameID: 0,
        brandName: '',
        model: '',
        asize: 0,
        temple: 0,
        bridge: 0,
        color: '',
        price: 0,
        mrp:0,
        unitPurchased: 0,
        totalPurchased: 0,
        createdDate:new Date()
      };
      
    
            const [date, setDate] = useState(new Date());
            const[ID,setID]=useState(0);
            const[CurrentUserType,SetCurrentUserType]=useState("");
            const[action,setAction]=useState(0);
            const[btncaption,setCaption]=useState("No Action");
            const[TotCost,setTotCost]=useState(0);
            const[searchRequestt]=useState<SearchRequest>({brand:"",model:"",color:""})
            const [frameData, setFrameData] = useState(initialFrameData);
            const [resetTrigger, setResetTrigger] = useState(false);
            const dispatch = useDispatch<AppDispatch>();
             const { status, error, frames } = useSelector((state: RootState) => state.Frame);
             const {searchstatus,searcherror,searchframes} = useSelector((state: RootState) => state.FrameSearch);
             const {updatestatus,updateerror,updateframes}=useSelector((state:RootState)=>state.UpdateFrame);
             const setFocus=useRef<HTMLInputElement>(null);
             const [SuccessMessage,setSucessMessage]=useState('');
             const [ErrorMessage,setErrorMessage]=useState('');

             useEffect(() => {
                    SetCurrentUserType(localStorage.getItem("userType") || "");

                    if (resetTrigger) {
                      setFrameData(initialFrameData);
                      setResetTrigger(false);
                    }
                      setAction(1);setCaption("Add to Inventory");
                  }, [resetTrigger]);
             const calculateTotal=()=>{
                
                 
                var qty=(document.getElementById("unit") as HTMLInputElement).value;
                var prc=(document.getElementById("prc") as HTMLInputElement).value;
                setTotCost(parseInt(qty)*parseInt(prc));
             }
             
            const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
              
                e.preventDefault();
                try {

                    const form = e.currentTarget;
                    const formData = new FormData(form);
                     const orderDateValue = formData.get("stockinDate");
                    // Construct the JSON object
                    const frameaddDataobj = {
                     
                      model: formData.get('model'),
                      brandName: formData.get('brandName'),
                      asize: (formData.get('asize')),
                      temple: (formData.get('temple')),
                      bridge: (formData.get('bridge')),
                      color: (formData.get('color')),
                      price: (formData.get('price')),
                      mrp:(formData.get('mrp')),
                      unitPurchased: (formData.get('unitpurchased')),
                      createdDate:typeof orderDateValue === "string" && orderDateValue
                                   ? new Date(`${orderDateValue}T00:00:00.000Z`)
                                   : new Date(),
                      createdBy:localStorage.getItem("userName")
                    };
                    const frameupdateDataobj = {
                        frameID:formData.get('hdnFrame'),
                        model: formData.get('model'),
                        brandName: formData.get('brandName'),
                        asize: (formData.get('asize')),
                        temple: (formData.get('temple')),
                        bridge: (formData.get('bridge')),
                        color: (formData.get('color')),
                        price: (formData.get('price')),
                        mrp:(formData.get('mrp')),
                        unitPurchased: (formData.get('unitpurchased')),
                        totalPurchased: (formData.get('totalCost')),
                        modifiedDate:date.toISOString(),
                        modifiedBy:localStorage.getItem("userName")
                      };
                      let response;
                     if(action===1)
                     {
                        const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                          
                        if(frameaddDataobj.asize!=="0" && frameaddDataobj.temple!=="0" && frameaddDataobj.bridge!=="0" && doc==="btnaction")
                        {
                        var strngframe=JSON.stringify(frameaddDataobj)
                        
                        var frameData=JSON.parse(strngframe);
                         response= await dispatch(addFrameInStock(frameData)).unwrap();
                         if(response?.frameID>0)
                           setSucessMessage("Data Saved Sucessfully")
                        }
                    }
                    if(action===2)
                    {
                      const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                      
                      if(frameaddDataobj.asize!=="0" && frameaddDataobj.temple!=="0" && frameaddDataobj.bridge!=="0" && doc==="btnaction")
                        {
                      var strngframe=JSON.stringify(frameupdateDataobj)
                         
                        var frameData=JSON.parse(strngframe);
                        response= await dispatch(updateFrameInStock(frameData)).unwrap();
                        if(response?.frameID>0)
                           setSucessMessage("Data Updated Sucessfully")
                      }
                    }
                   
                     
                 
                
                  // Optionally, reset the form or display a success message
                } catch (err) {
                  // Handle error if needed
                 setErrorMessage("Fail to update Record");
                }
              };
  const resetScreen=()=>{ 
    
      setResetTrigger(true);  
      setFocus.current?.focus();   
                 
    
      
}
  const setSearch=async ()=>{
    var searchData=(document.getElementById("txtSearch") as HTMLInputElement).value;
    let searchList:string[]=searchData.split(",");
    searchRequestt.brand=searchList[0];
    searchRequestt.model=searchList[1];
    searchRequestt.color=searchList[2];
    let strSearchRequest:string=JSON.stringify(searchRequestt);
    
    var searchRequest=JSON.parse(strSearchRequest);
    try
    {
        const response=await dispatch(searchFrame(searchRequest)).unwrap();
  if(response!==null)
  {
    
    setFrameData({
           ...response,
           createdDate: new Date(response.createdDate),
            });
    setCaption("Update Inventory");
    setAction(2);
  }
   
   else
   setErrorMessage("No Record Found"); 
    }
   catch(err)
   {
    setErrorMessage("No Record Found"); 
   }
  }

 



return(
       <>
       <Snackbar
         open={Boolean(SuccessMessage)}
         autoHideDuration={4000}
         onClose={() => setSucessMessage('')}
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
       >
         <Alert
           severity="success"
           variant="filled"
           onClose={() => setSucessMessage('')}
         >
           {SuccessMessage}
         </Alert>
       </Snackbar>
       
       <Snackbar
         open={Boolean(ErrorMessage)}
         autoHideDuration={6000}
         onClose={() => setErrorMessage('')}
         anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
       >
         <Alert
           severity="error"
           variant="filled"
           onClose={() => setErrorMessage('')}
         >
           {ErrorMessage}
         </Alert>
       </Snackbar>
      <DeskTop />
      {CurrentUserType?.toLowerCase() === "admin" ? (
      <form  onSubmit={handleSubmit}>

      
      <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Inventory Entry for Frames
       </div> 
      <div className="card col-sm-10 container" >
      <div className="row" style={{marginTop:"1%"}}>
        <div className="col-sm-5"></div>
        <div className="col-sm-6">
            <input type="text" id="txtSearch" placeholder="search By Brand,Model,Color" className='form-control' style={{float:"right"}}></input>
        </div>
        <div className="col-sm-1">
            <button className="btn" title="Search" onClick={setSearch}><FaSearch/></button>
        </div>
      </div>
      <div className="row" >
         <div className="row mt-2" style={{marginBottom:"1%"}}>
      <div className="col-sm-1 text-end">
          <label htmlFor="orderDate" style={{marginLeft:"1%", float: "right", whiteSpace: "nowrap" }}>
           Purchase On
          </label>
        </div>
        <div className="col-sm-2">
          <input
            id="stockinDate"
            type="date"
            className="form-control"
            name="stockinDate"
            value={frameData?.createdDate instanceof Date
                ? frameData.createdDate.toISOString().split("T")[0]
                : frameData?.createdDate ?? ""}
            onChange={(e) =>
                     setFrameData({ ...frameData, createdDate: e.target.value ? new Date(`${e.target.value}T00:00:00.000Z`) : frameData.createdDate })
}
            
          />
        </div>
      </div>
        <div className='col-sm-1' >
            <label htmlFor="Model" style={{float:"right"}}>Model</label>
            <input type="hidden" name="hdnFrame" value={frameData?.frameID||0} ></input>
        </div>
        <div className='col-sm-2'>
            <input type="text" 
            ref={setFocus}
            className="form-control" style={{float:"left"}} name='model' value={frameData?.model||""} 
            onChange={(e) =>
                setFrameData({ ...frameData, model: e.target.value })
              }></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="Brand" style={{float:"right"}}>Brand</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" className="form-control" style={{float:"right"}} name='brandName' value={frameData?.brandName||""}
              onChange={(e) =>
                setFrameData({ ...frameData, brandName: e.target.value })
              }></input>
        </div>
        <div className='col-sm-2' >
            <label htmlFor="Total Cost" style={{float:"right"}}   >Total Cost</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" id="tcost" className="form-control" readOnly name="totalcost" value={TotCost===0?frameData?.totalPurchased?.toString() || "0":TotCost}  ></input>
        </div>
      </div>
      <div className="row" style={{marginTop:"2%"}}>
        <div className='col-sm-1'>
            <label htmlFor="Asize" style={{float:"right"}}
             >Asize</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" className="form-control" name='asize' value={frameData?.asize?.toString() || ""}
             onChange={(e) =>
                setFrameData({ ...frameData, asize: parseInt(e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="Temple" style={{float:"right"}}>Temple</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" className="form-control" name='temple' value={frameData?.temple?.toString() || ""}
            onChange={(e) =>
                setFrameData({ ...frameData, temple: parseInt(e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-2'>
            <label htmlFor="Bridge" style={{float:"right"}}>Bridge</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" className="form-control" name='bridge' value={frameData?.bridge?.toString()||""}
             onChange={(e) =>
                setFrameData({ ...frameData, bridge: parseInt(e.target.value) })
              } ></input>
        </div>
      </div>
      <div className="row" style={{marginTop:"2%"}}>
      <div className='col-sm-1'>
            <label htmlFor="Price" style={{float:"right"}}>Color</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" className="form-control" name='color' value={frameData?.color||""}
                onChange={(e) =>
                    setFrameData({ ...frameData, color: e.target.value })
                  }
             ></input>
        </div>
        
        <div className='col-sm-1'>
            <label htmlFor="Price" style={{float:"right"}}>Price</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="prc" className="form-control" name='price' value={frameData?.price?.toString()||""}
            onChange={(e) =>
                setFrameData({ ...frameData, price: parseInt(e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="Mrp" style={{float:"right"}}>M.R.P</label>
        </div>
        <div className='col-sm-1'>
            <input type="text" id="mrp" className="form-control" name='mrp' value={frameData?.mrp?.toString()||""}
            onChange={(e) =>
                setFrameData({ ...frameData, mrp: parseInt(e.target.value) })
              }
            ></input>
        </div>
        <div className='col-sm-1'>
            <label htmlFor="Quantity" style={{float:"right"}} >Quantity</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" id="unit" className="form-control" name='unitpurchased' 
            onChange={(e) => {
                const newValue = Number(e.target.value); // Convert string to number
                setFrameData((prev) => ({ ...prev, unitPurchased: newValue })); // Update state
                calculateTotal(); // Call calculateTotal after updating
              }}
               value={frameData?.unitPurchased?.toString()||""} ></input>
        </div>
       
      </div>
      <div className="row" style={{marginTop:"2%",marginBottom:"2%"}}>
        <div className='col-sm-10 text-center'>
        
          <button className="btn btn-primary" name='btnaction' >{btncaption}</button>
          
          <button className="btn btn-primary" name='btreset' style={{marginLeft:"2%"}} type="reset" onClick={resetScreen}>Reset</button>
        </div>
      </div>

      </div>
      </form>
      ): (

    <div className="container text-center mt-5">
        <h4 className="text-danger">You have no access</h4>
    </div>

)}
       </>

)
}
export default Frame;