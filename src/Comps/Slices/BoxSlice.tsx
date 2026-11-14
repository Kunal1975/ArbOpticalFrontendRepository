// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface Box {
  boxId: number,
 boxType: string,
  unitCost: number,
  unitPurchased: number,
  totalPurchased: number,
  purchaseDate: string,
  modifiedDate: string,
  createdBy: string,
  modifyedBy: string
}

// Define the initial state using the Frame interface
interface BoxState {
  boxes: Box[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BoxState = {
  boxes: [],
  status: 'idle',
  error: null,
};

// Async thunk for updating a frame in stock
export const addBoxInStock = createAsyncThunk<
  Box,
  Box,
  { rejectValue: string }
>('BoxInStock', async (frameData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.BoxUrlAdd
    const response = await axios.post<Box>(
      urlFrame,
      frameData
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

const boxSlice = createSlice({
  name: 'box',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBoxInStock.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBoxInStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.boxes.findIndex(
          (boxes) => boxes.boxId=== action.payload.boxId
        );
        if (index !== -1) {
          state.boxes[index] = action.payload;
        } else {
          state.boxes.push(action.payload);
        }
      })
      .addCase(addBoxInStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update box in stock';
      });
  },
});

export default boxSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.Box.boxes;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.Box.status

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.Box.error;
