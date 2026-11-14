// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface OrderDetails {
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
// Define the initial state using the Frame interface
interface OrderDetailsState {
  details: OrderDetails[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderDetailsState = {
  details: [],
  status: 'idle',
  error: null,
};

// Async thunk for updating a frame in stock
export const addOrderdetails = createAsyncThunk<
  OrderDetails,
  OrderDetails,
  { rejectValue: string }
>('OrderDetails', async (orderDetailsData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.profitBook
    const response = await axios.post<OrderDetails>(
      urlFrame,
      orderDetailsData
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

const OrderDetailsSlice = createSlice({
  name: 'OrderDetails',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addOrderdetails.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addOrderdetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.details.findIndex(
          (details) => details.ordid=== action.payload.ordid
        );
        if (index !== -1) {
          state.details[index] = action.payload;
        } else {
          state.details.push(action.payload);
        }
      })
      .addCase(addOrderdetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update Orderdetails ';
      });
  },
});

export default OrderDetailsSlice.reducer;

// Selector to get all frames
export const selectOrderdetails = (state: RootState) => state.OrderDetails.details;

// Selector to get the status of the update operation
export const selectOrderdetailsstatus = (state: RootState) => state.OrderDetails.status

// Selector to get any error messages
export const selectOrderDetailsError = (state: RootState) => state.OrderDetails.error;
