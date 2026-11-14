// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface updateFrame {
  frameID: number;
  brandName: string;
  model: string;
  asize: number;
  temple: number;
  bridge: number;
  color: string;
  price: number;
  unitPurchased: number;
  totalPurchased: number;
  createdDate: string;
  createdBy: string;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

// Define the initial state using the Frame interface
interface FrameState {
  updateframes: updateFrame[];
  updatestatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updateerror: string | null;
}

const initialState: FrameState = {
  updateframes: [],
  updatestatus: 'idle',
  updateerror: null,
};

// Async thunk for updating a frame in stock
export const updateFrameInStock = createAsyncThunk<
  updateFrame,
  updateFrame,
  { rejectValue: string }
>('FrameSearchnStock', async (frameData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.FrameUrlUpdate
    const response = await axios.post<updateFrame>(
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

const frameSlice = createSlice({
  name: 'frame',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateFrameInStock.pending, (state) => {
        state.updatestatus = 'loading';
        state.updateerror = null;
      })
      .addCase(updateFrameInStock.fulfilled, (state, action) => {
        state.updatestatus = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.updateframes.findIndex(
          (updateframe) => updateframe.frameID === action.payload.frameID
        );
        if (index !== -1) {
          state.updateframes[index] = action.payload;
        } else {
          state.updateframes.push(action.payload);
        }
      })
      .addCase(updateFrameInStock.rejected, (state, action) => {
        state.updatestatus = 'failed';
        state.updateerror = action.payload ?? 'Failed to update frame in stock';
      });
  },
});

export default frameSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.Frame.frames;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.Frame.status;

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.Frame.error;
