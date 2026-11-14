import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import DeskTop from './DeskTop';
import { FaPowerOff, FaSearch } from 'react-icons/fa';

const ReadingGlass:React.FC=()=>{
    const[power,setPower]=useState<string[]>([]);
 // Ensure 2 decimal places
     useEffect(()=>{
        
        const powercat = [];
        for (let i = 1.0; i <= 3.0; i += 0.25) {
            powercat.push(i.toFixed(2)); 

        }
        setPower(powercat);
    },[]);
 
return(
       <>
      <DeskTop />
      <div className="col-sm-10 container" style={{marginTop:"2%",background:"#59afd5",color:"white",fontWeight:"bold"}}>
        Inventory Entry for Reading Glass
       </div> 
      <div className="card col-sm-10 container" >
      <div className="row" style={{marginTop:"1%"}}>
        <div className="col-sm-5"></div>
        <div className="col-sm-6">
            <input type="text" placeholder="search By Power Category,Price" className='form-control' style={{float:"right"}}></input>
        </div>
        <div className="col-sm-1">
            <button className="btn" title="Search"><FaSearch/></button>
        </div>
      </div>
      <div className="row" style={{marginTop:"2%"}}>
        <div className='col-sm-2' >
            <label htmlFor="Model" style={{float:"right"}}>Pwer Category</label>
        </div>
        <div className='col-sm-2'>
        <select className="form-select">
        {power.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
            </select>

        </div>
        <div className='col-sm-2'>
            <label htmlFor="Total Cost" style={{float:"right"}}>Total Cost</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" className="form-control" style={{float:"right"}}></input>
        </div>
        
      </div>
      <div className="row" style={{marginTop:"2%"}}>
        <div className='col-sm-2'>
            <label htmlFor="Price" style={{float:"right"}}>Price</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" className="form-control" ></input>
        </div>
        <div className='col-sm-2'>
            <label htmlFor="Quantity" style={{float:"right"}}>Quantity</label>
        </div>
        <div className='col-sm-2'>
            <input type="number" className="form-control" ></input>
        </div>
      </div>
      <div className="row" style={{marginTop:"2%",marginBottom:"2%"}}>
        <div className='col-sm-10 text-center'>
          <button className="btn btn-primary">Add to Inventory</button>
          <button className="btn btn-primary" style={{marginLeft:"2%"}}>Reset</button>
        </div>
      </div>

      </div>
       </>

)
}
export default ReadingGlass;