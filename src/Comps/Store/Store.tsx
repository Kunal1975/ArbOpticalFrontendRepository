import { configureStore } from '@reduxjs/toolkit';
import UserSliceReducer   from '../Slices/UserSlice';
import FrameSliceReducer  from '../Slices/FrameSlice';
import FrameSearchReducer from '../Slices/FrameSearchSlice'
import UpdateSliceReducer from '../Slices/UpdateSlice'
import BoxsliceReducer from '../Slices/BoxSlice'
import BoxsearchReducer from '../Slices/BoxSearchSlice'
import BoxUpdateReducer from '../Slices/BoxUpdateSlice'
import CustomerReducer  from '../Slices/CustomerSlice'
import OrderReducer from '../Slices/Orderslice'
import SunglassReducer from '../Slices/SunGlassSlice'
import OrderDetailsReducer from '../Slices/OrderdetailsSlice';
import SunglassSearcfhReducer from '../Slices/SunglassSearchSlice'
import SunglassUpdateSliecReducer from '../Slices/SunglassUpdateSlice'
import OrderDetails from '../OrderDetails';
// Configure the store
export const store = configureStore({
  reducer: {
    VerifyCode:UserSliceReducer,
    Frame:FrameSliceReducer,
    FrameSearch:FrameSearchReducer,
    UpdateFrame:UpdateSliceReducer,
    Box:BoxsliceReducer,
    BoxSearch:BoxsearchReducer,
    BoxUpdeate:BoxUpdateReducer,
    Customer:CustomerReducer,
    Order:OrderReducer,
    Sunglass:SunglassReducer,
    SunGlassSearch:SunglassReducer,
    OrderDetails:OrderDetailsReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;