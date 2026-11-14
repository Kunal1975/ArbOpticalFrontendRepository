import React from 'react';
import {BrowserRouter,Routes, Route } from 'react-router-dom';
//import 'bootstrap/dist/css/bootstrap.min.css';
import DeskTop from './Comps/DeskTop';
import Login from './Comps/Login';
import Verify from './Comps/Verify';
import Box from './Comps/Box'
import Home from './Comps/Home';
import Frame from './Comps/Frame';
import ReadingGlass from './Comps/ReadingGlass';
import DailyLedger from './Comps/Dailyledger';
import Stock from './Comps/stock';
import Customer from './Comps/Customer';
import NewCustomer from './Comps/NewCustomer';
import Orderbook from './Comps/Orderbook';
import OrderList from './Comps/OrderList';
import Invoice from './Comps/Invoice';
import InvoiceCost from './Comps/InvoiceCost';
import Profit from './Comps/Profit'
import SunGlass from './Comps/Sunglass';
import OrderDetails from './Comps/OrderDetails';
import OrderHistory from './Comps/OrderHistory';
const App: React.FC = () => {
 

 
  return (
       <>
       <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Verify" element={<Verify/>}/>
          <Route path="/Desktop" element={<DeskTop />}/>
          <Route path="/Box" element={<Box/>}/>
          <Route path="/Home" element={<Home title="ARB Optics And Eye Clinic" coat="Live with a clear vision"/>}/>
          <Route path="/Frame" element={<Frame/>}/>
          <Route path="/ReadingGlass" element={<ReadingGlass/>}/>
          <Route path="/DailyLedger" element={<DailyLedger/>}/>
          <Route path="/Stock" element={<Stock/>}/>
          <Route path="/Customer" element={<Customer/>}/>
          <Route path="/NewCustomer" element={<NewCustomer/>}/>
          <Route path="/Orderbook" element={<Orderbook/>}/>
          <Route path="/OrderList" element={<OrderList/>}/>
          <Route path="/Invoice" element={<Invoice/>}/>
          <Route path="/InvoiceCost" element={<InvoiceCost/>}/>
          <Route path="/Profit" element={<Profit/>}/>
          <Route path="/Sunglass" element={<SunGlass/>}/>
          <Route path="/OrderDetails" element={<OrderDetails/>}/>
          <Route path="/OrderHistory" element={<OrderHistory/>}/>
        </Routes>
       </BrowserRouter>
      
       </>
  )
};

export default App;
