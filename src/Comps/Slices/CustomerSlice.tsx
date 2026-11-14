// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface Customer {
    customerID: number,
    custTitle: string,
    firstName: string,
    middleName: string,
    lastName: string,
    surName: string,
    sex: string,
    custEmail: string,
   dateOfbirth: string,
   age: number,
    address1: string,
  address2: string,
   address3: string,
    areaPin: string,
    dateofEnquiry: string,
    mobile: string,
    createdOn: string,
    createdBy: string,
    modifiedBy: string|null,
    modifiedOn: string|null
}

// Define the initial state using the Frame interface
interface CustomerState {
  customer: Customer[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CustomerState = {
  customer: [],
  status: 'idle',
  error: null,
};

// Async thunk for updating a frame in stock
export const addnewCustomer = createAsyncThunk<
  Customer,
  Customer,
  { rejectValue: string }
>('CiustomerAdd', async (customerData, { rejectWithValue }) => {
  try {
    var urlCustomer=config.Serviceurl.AddCustomer
   
    const response = await axios.post<Customer>(
        urlCustomer,
      customerData
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

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addnewCustomer.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addnewCustomer.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.customer.findIndex(
          (customer) => customer.customerID === action.payload.customerID
        );
        if (index !== -1) {
          state.customer[index] = action.payload;
        } else {
          state.customer.push(action.payload);
        }
      })
      .addCase(addnewCustomer.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update Customer';
      });
  },
});

export default customerSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.Frame.frames;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.Frame.status;

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.Frame.error;
