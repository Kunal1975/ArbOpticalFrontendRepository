// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface Order {
    "orderId":number,
    "orderFolio":string,
    "orderType": string,
    "custMobile": string,
    "custId":number,
    "inventoryID": number,
    "lensType": string,
    "lensVENDOR": string,
    "fvendor": string,
    "rsph": "string",
    "rcyl": "string",
    "raxis": 0,
    "rAdd": "string",
    "rva": "string",
    "lsph": "string",
    "lcyl": "string",
    "laxis": 0,
    "lAdd": "string",
    "lva": "string",
    "repd": number,
    "lepd": number,
    "rFittingHeight": number,
    "lFittingHeight": number,
    "rBifocalHeight": number,
    "lbifocalheight": number,
    "tint": string,
    "amount": number,
    "discount":number,
    "advance": number,
    "outstanding": number,
    "createdBy": string,
    "createdAt": Date
}

// Define the initial state using the Frame interface
interface OrderState {
  orders: Order[];
  ordstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  orderror: string | null;
}

const initialState: OrderState = {
  orders: [],
  ordstatus: 'idle',
  orderror: null,
};

// Async thunk for updating a frame in stock
export const createNewOrder = createAsyncThunk<
  Order,
  Order,
  { rejectValue: string }
>('createNewOrder', async (OrderData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.CreateOrder
    const response = await axios.post<Order>(
      urlFrame,
      OrderData
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    } else {
      return rejectWithValue('An unknown error occurred.');
    }
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.ordstatus = 'loading';
        state.orderror = null;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.ordstatus = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.orders.findIndex(
          (order) => order.orderFolio === action.payload.orderFolio
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.ordstatus = 'failed';
        state.orderror = action.payload ?? 'Failed to update frame in stock';
      });
  },
});

export default orderSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.Order.orders;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.Order.ordstatus;

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.Order.orderror;
