import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import { FaSearch } from 'react-icons/fa';
import {addBoxInStock} from './Slices/BoxSlice';
import {BoxSearch} from './Slices/BoxSearchSlice'
import { RootState,AppDispatch } from './Store/Store';
import { useDispatch,useSelector } from 'react-redux';
import {updateBoxInStock} from './Slices/BoxUpdateSlice'
interface searchRequest
{
  boxType:string,
  price:number
}
const Box:React.FC=()=>{
    const dispatch = useDispatch<AppDispatch>();
    const{status,error,boxes}=useSelector((state:RootState)=>state.Box);
    const{searchboxstatus,searchboxerror,searchboxes}=useSelector((state:RootState)=>state.BoxSearch);
    const{updateBoxstatus,updatBoxeerror,updateBox}=useSelector((state:RootState)=>state.BoxUpdeate);
    const setFocus=useRef<HTMLSelectElement>(null);
    const initialBocxData = {
      boxId: 0,
      boxType: "",
      unitCost: 0,
      unitPurchased: 0,
      totalPurchased: 0
      
       
      };
      
    
            const [date, setDate] = useState(new Date());
            const[ID,setID]=useState(0);
            const[action,setAction]=useState(0);
            const[TotCost,setTotCost]=useState(0);
            const[searchRequestt,setSearchRequest]=useState<searchRequest>({boxType:"",price:0})
            const [BoxData, setBoxData] = useState(initialBocxData);
            const [resetTrigger, setResetTrigger] = useState(false);
            const resetScreen=()=>{setResetTrigger(true);setAction(1);setFocus.current?.focus();}
             useEffect(() => {
                if (resetTrigger) {
                    setBoxData(initialBocxData); // Reset state
                  setResetTrigger(false); // Reset trigger
                }
              }, [resetTrigger]); // Runs when reset
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
                    const boxaddDataobj = {
                     
                        boxType:formData.get('boxtype'),
                        unitCost:formData.get('price'),
                        unitPurchased:formData.get('qty'),
                       createdBy:localStorage.getItem("userName")
                    };
                    
                      let response;
                     if(action===1)
                     {
                      if(boxaddDataobj?.boxType!="")  
                      {
                      var strngframe=JSON.stringify(boxaddDataobj)
                        
                        var frameData=JSON.parse(strngframe);
                         response= await dispatch(addBoxInStock(frameData)).unwrap();
                         if(response?.boxId>0)
                            alert("Data Updated Sucessfully")
                      }
                    }
                    if(action===2  )
                    {
                      const boxupdateDataobj = {
                        BoxId:formData.get('hdnFrame'),
                        BoxType:formData.get('boxtype'), 
                        UnitCost:formData.get('price'),
                        UnitPurchased:formData.get('qty'),
                        PurchaseDate:date.toISOString,
                        ModifiedDate:date.toISOString,
                        ModifyedBy:localStorage.getItem("userName")
                      };
                     if(boxupdateDataobj.BoxType!="")
                     { 
                      var strngbox=JSON.stringify(boxupdateDataobj)
                        
                        var updateboxData=JSON.parse(strngbox);
                        response= await dispatch(updateBoxInStock(updateboxData)).unwrap();
                        if(response?.boxId>0)
                           alert("Data Updated Sucessfully")
                      }
                    }
                   
                     
                  }
                
                  // Optionally, reset the form or display a success message
                 catch (err) {
                  // Handle error if needed
                  alert("Fail to update Record");
                }
            };
  //const resetScreen=()=>{setResetTrigger(true);setAction(1);}
  const setSearch = async () => {
    var searchData = (document.getElementById("txtSearch") as HTMLInputElement).value;
    let searchList: string[] = searchData.split(",");
    
    setSearchRequest({
      boxType: searchList[0],
      price: parseInt(searchList[1]),
    });
  
    setAction(2);
    await new Promise(resolve => setTimeout(resolve, 0)); // Ensures action update
    let strRequest:string=JSON.stringify(searchRequestt);
    
    var request=JSON.parse(strRequest);
    try {
      const response = await dispatch(BoxSearch(request)).unwrap();
      alert(JSON.stringify(response));
      if (response?.boxId > 0) {
        setBoxData(response);
        
        
      } else {
        alert("No Record Found");
      }
    } catch (err) {
      alert("No Record Found");
    }
  };
  
 


return(
       <>
      <DeskTop />
      <form onSubmit={handleSubmit}>
       <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Inventory Entry for Boxes
       </div> 
       <div className="card col-sm-10 container" >
         
           <div className="row" style={{marginTop:"1%"}}>
             <div className="col-sm-5"></div>
             <div className="col-sm-6">
                 <input type="text" placeholder="search By Box Type,Price" className='form-control' style={{float:"right"}} id="txtSearch"></input>
             </div>
             <div className="col-sm-1">
                 <button className="btn" title="Search"
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} 
                 onClick={setSearch} ><FaSearch/></button>
             </div>
           </div>
           <div className="row" style={{marginTop:"2%"}}>
             <div className='col-sm-1' >
                 <label htmlFor="Type" style={{float:"right"}}>Type</label>
             </div>
             <div className='col-sm-2'>
             <select className="form-select" name='boxtype' value={BoxData.boxType } 
             ref={setFocus}
             onChange={(e) =>
                setBoxData({ ...BoxData, boxType: e.target.value })
              }>
               <option value="" >Type</option>
                <option value="Premium">Premium</option>
                <option value="General">General</option>
            </select>
                        
            <input type="hidden" id="hdnFrame" name="hdnFrame" value={BoxData.boxId}></input>
             </div>
             
             <div className='col-sm-1' >
                 <label htmlFor="Total Cost" style={{float:"right"}}>Total Cost</label>
             </div>
             <div className='col-sm-2'>
                 <input type="number" className="form-control" readOnly 
                 value={TotCost===0?BoxData?.totalPurchased?.toString() || "0":TotCost}
                 /></div>
           <div className="row" style={{marginTop:"2%"}}>
             <div className='col-sm-1'>
                 <label htmlFor="Price" style={{float:"right"}}>Price</label>
             </div>
             <div className='col-sm-2'>
                 <input type="number" className="form-control" name="price" id="prc" value={BoxData.unitCost?.toString()||""}
                  onChange={(e)=>setBoxData({...BoxData ,unitCost:parseInt(e.target.value)})} ></input>
             </div>
             <div className='col-sm-1'>
                 <label htmlFor="Temple" style={{float:"right"}}>Quantity</label>
             </div>
             <div className='col-sm-2'>
                 <input type="number" className="form-control" name="qty" id="unit" onChange= {(e) => {
                const newValue = Number(e.target.value); // Convert string to number
                setBoxData((prev) => ({ ...prev, unitPurchased: newValue })); // Update state
                calculateTotal(); // Call calculateTotal after updating
              }}
              value={BoxData.unitPurchased?.toString()||""} ></input>
             </div>
             
           </div>
           <div className="row" style={{marginTop:"2%",marginBottom:"2%"}}>
             <div className='col-sm-10 text-center'>
               <button className="btn btn-primary" >Update Inventory</button>
               <button className="btn btn-primary" style={{marginLeft:"2%"}} type="reset" onClick={resetScreen}>Reset</button>
             </div>
           </div>
     
           </div>
       </div>
           </form>
           
       </>

)
}
export default Box;