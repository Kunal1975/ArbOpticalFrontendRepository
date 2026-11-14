import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import { FaSearch } from 'react-icons/fa';
import { useDispatch,useSelector } from 'react-redux';
import {addGlassInStock}   from './Slices/SunGlassSlice';
import {glassSearch} from './Slices/SunglassSearchSlice';
import { updateGlassInStock } from './Slices/SunglassUpdateSlice';
import { RootState,AppDispatch } from './Store/Store';
interface SearchRequest {
    brandName:string,
    model:string,
    color:string
   }

const SunGlass:React.FC=()=>{
    const initialFrameData = {
       "glassId": 0,
  "brandName": "",
  "model": "",
  "color": "",
  "unit": 0,
  "price": 0,
  "mrp": 0,
  
      };
      
    
            const [date, setDate] = useState(new Date());
            const [CurrentUserType,SetCurrentUserType]=useState("");
            const[ID,setID]=useState(0);
            const[action,setAction]=useState(0);
            const[btncaption,setCaption]=useState("No Action");
            const[TotCost,setTotCost]=useState(0);
            const[searchRequestt]=useState<SearchRequest>({brandName:"",model:"",color:""})
            const [frameData, setFrameData] = useState(initialFrameData);
            const [resetTrigger, setResetTrigger] = useState(false);
            const dispatch = useDispatch<AppDispatch>();
             const { status, error, frames } = useSelector((state: RootState) => state.Frame);
             const {searchstatus,searcherror,searchframes} = useSelector((state: RootState) => state.FrameSearch);
             const {updatestatus,updateerror,updateframes}=useSelector((state:RootState)=>state.UpdateFrame);
             const setFocus=useRef<HTMLInputElement>(null);
           
             useEffect(() => {
              SetCurrentUserType(localStorage.getItem("userType") || "");
                if (resetTrigger) {
                  setFrameData(initialFrameData); // Reset state
                  setResetTrigger(false); // Reset trigger
                     
                  }
                   setAction(1);
                   setCaption("Add to Inventory");
                 // setAction(1);
              }, [resetTrigger,action]); // Runs when reset
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
                
                    // Construct the JSON object
                    const frameaddDataobj = {
                     
                      model: formData.get('model'),
                      brandName: formData.get('brandName'),
                      color: (formData.get('color')),
                      price: (formData.get('price')),
                      mrp:(formData.get('mrp')),
                      unit: (formData.get('unitpurchased')),
                      CreatedAt:date.toISOString(),
                      createdBy:localStorage.getItem("userName")
                    };
                    const frameupdateDataobj = {
                      glassId:formData.get('hdnFrame'),
                        model: formData.get('model'),
                        brandName: formData.get('brandName'),
                        color: (formData.get('color')),
                        price: (formData.get('price')),
                        mrp:(formData.get('mrp')),
                        unit: (formData.get('unitpurchased')),
                        CreatedAt:date.toISOString(),
                        createdBy:localStorage.getItem("userName")
                      };
                      let response;
                     if(action===1)
                     {
                        const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                          
                        if(frameaddDataobj.brandName!=="" && doc==="btnaction")
                        {
                        var strngframe=JSON.stringify(frameaddDataobj)
                        
                        var frameData=JSON.parse(strngframe);
                         response= await dispatch(addGlassInStock(frameData)).unwrap();
                         alert(JSON.stringify(response));
                         
                        }
                    }
                    if(action===2)
                    {
                      const activeElement = document.activeElement as HTMLElement;
                        const doc=activeElement?.getAttribute("name");
                      
                      if(frameaddDataobj.brandName!=="" && doc==="btnaction")
                        {
                      var strngframe=JSON.stringify(frameupdateDataobj)
                      
                        var frameData=JSON.parse(strngframe);
                        
                        response= await dispatch(updateGlassInStock(frameData)).unwrap();
                        
                            alert(JSON.stringify(response))
                      }
                    }
                   
                     
                 
                
                  // Optionally, reset the form or display a success message
                } catch (err) {
                  // Handle error if needed
                  alert("Fail to update Record");
                }
              };
  const resetScreen=()=>{ 
      setResetTrigger(true);   
      setFocus.current?.focus();  
                 
    
}
  const setSearch=async ()=>{
    var searchData=(document.getElementById("txtSearch") as HTMLInputElement).value;
    let searchList:string[]=searchData.split(",");
    searchRequestt.brandName=searchList[0];
    searchRequestt.model=searchList[1];
    searchRequestt.color=searchList[2];
    let strSearchRequest:string=JSON.stringify(searchRequestt);
    
    var searchRequest=JSON.parse(strSearchRequest);
    try
    {
        const response=await dispatch(glassSearch(searchRequest)).unwrap();
  if(response!==null)
  {
    
    setFrameData(response);
    setCaption("Update Inventory");
    setAction(2);
  }
   
   else
   alert("No Record Found"); 
    }
   catch(err)
   {
    alert("No Record Found"); 
   }
  }

 



return(
       <>
      <DeskTop />
      {CurrentUserType?.toLowerCase() === "admin" ? (
      <form  onSubmit={handleSubmit}>

      
      <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Inventory Entry for SunGlasses
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
      <div className="row" style={{marginTop:"2%"}}>
        <div className='col-sm-1' >
            <label htmlFor="Model" style={{float:"right"}}>Model</label>
            <input type="hidden" name="hdnFrame" value={frameData?.glassId||0}></input>
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
            <input type="number" id="tcost" className="form-control" readOnly name="totalcost" value={TotCost===0?(frameData?.unit*frameData?.price)?.toString() || "0":TotCost}  ></input>
        </div>
      </div>
      <div className='row' style={{marginTop:"2%"}}>
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
        </div>
        <div className='row' style={{marginTop:"2%"}}>

        <div className='col-sm-1'>
            <label htmlFor="Quantity" style={{float:"right"}} >Quantity</label>
        </div>
        <div className='col-sm-2'>
            <input type="text" id="unit" className="form-control" name='unitpurchased' 
            onChange={(e) => {
                const newValue = Number(e.target.value); // Convert string to number
                setFrameData((prev) => ({ ...prev, unit: newValue })); // Update state
                calculateTotal(); // Call calculateTotal after updating
              }}
               value={frameData?.unit?.toString()||""} ></input>
        </div>
       
      </div>
      </div>
      <div className="row" style={{marginTop:"2%",marginBottom:"2%"}}>
        <div className='col-sm-10 text-center'>
        
          <button className="btn btn-primary" name='btnaction' >{btncaption}</button>
          
          <button className="btn btn-primary" name='btreset' style={{marginLeft:"2%"}} type="reset" onClick={resetScreen}>Reset</button>
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
export default SunGlass;