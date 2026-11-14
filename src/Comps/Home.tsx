import React,{useState} from 'react';

import Dropdown from 'react-bootstrap/Dropdown';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import arbImage from  '../images/arb.jpg';
import { useNavigate } from 'react-router-dom';
import { FaHome,FaSignOutAlt } from 'react-icons/fa';
import  {NavLink}  from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";



interface Props {
    title: string;
    coat: string;
  }
const Home: React.FC<Props> = ({title,coat }) => {
   
   const user=localStorage.getItem("userName");
   const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
   const navback=useNavigate();
   const logOut = () => setLogoutDialogOpen(true);
 const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };


const confirmLogout = () => {
  setLogoutDialogOpen(false);
  navback("/");
};
 
    return (
      <>
         <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <form className="form-inline mx-2 my-2 my-lg-0">
    <img src={require("../images/arb.jpg")} title="ARB Opticals" style={{height:"64px",width:"64px"}} />
    </form>
     <div className="container-fluid">
    <a className="navbar-brand" href="#"> </a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link active" aria-current="page" to="/Home"><FaHome/></NavLink>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#"></a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           Customer
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/NewCustomer">Add New Customer</NavLink></li>
            <li><NavLink className="dropdown-item" to="/Customer">View Customer</NavLink></li>
            <li><NavLink className="dropdown-item" to="/OrderHistory">Customer History</NavLink></li>
            
           
          </ul>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           Article
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/Box" id="lnew">Box</NavLink></li>
            <li><NavLink className="dropdown-item" to="/Frame" id="lupdate">Frame</NavLink></li>
            <li><NavLink className="dropdown-item" to="/SunGlass" id="lupdate">Sun Glass</NavLink></li>
           
            <li><hr className="dropdown-divider"/></li>
            <li><NavLink className="dropdown-item" to="/Stock">Stock Chechk</NavLink></li>
          </ul>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           TrasnsactionMenu
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/Orderbook">Book Order</NavLink></li>
            <li><NavLink className="dropdown-item" to="/OrderList">View Order</NavLink></li>
            <li><NavLink className="dropdown-item" to="/OrderDetails">Order Details</NavLink></li>
            <li><hr className="dropdown-divider"/></li>
            <li><NavLink className="dropdown-item" to="/DailyLedger">Daily Ledger</NavLink></li>
            <li><hr className="dropdown-divider"/></li>
            <li><NavLink className="dropdown-item" to="/Invoice">View Invoice</NavLink></li>
          
          </ul>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
           Reports
          </a>
          
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><NavLink className="dropdown-item" to="/Profit">ProfitPerOrder</NavLink></li>
            </ul>
         </li>
      </ul>
    <button
                  className="btn btn-outline-success my-2 my-sm-0"
                  type="button"
                  onClick={logOut}
                  title="Log Out"
                  aria-label="Log out"
                >
                  <FaSignOutAlt />
                </button>
    </div>
    <form className="form-inline my-2 my-lg-0">
      
     
    </form>
  </div>
</nav>
<div style={{float:"right",marginRight:"1%"}}>
    <span style={{fontWeight:"bold",fontSize:"11px"}}>Welcome:{user}</span>
</div>
<div className="container" style={{height:"340px",marginTop:"5%"}}>
    <div className="col-sm-12 text-center" style={{backgroundColor:"#67679d",color:"white"}}>
         <span style={{fontWeight:"bold"}}>{title}</span>
    </div>
    <div className='text-center'>
        <img src={require("../images/arb.jpg")} title="ARB Opticals" style={{height:"240px",width:"380px"}}/>
    </div>
    <div className="col-sm-12 text-center" style={{backgroundColor:"#67679d",color:"white"}}>
         <span style={{fontWeight:"bold"}}>{coat}</span>
    </div>
</div>
<footer className="footer fixed-bottom  bg-light">
        <div className="container text-left">
            <span className="text-black">
                &#169; All rights reserved by ARB Opticals
            </span>
        </div>
    </footer>
     <Dialog
        open={logoutDialogOpen}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={cancelLogout}>Cancel</Button>
          <Button onClick={confirmLogout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
</>
  );
}
  export default Home;
   /* <li><NavLink className="dropdown-item" to="/InvoiceCost">Invoice Cost Set</NavLink></li>*/