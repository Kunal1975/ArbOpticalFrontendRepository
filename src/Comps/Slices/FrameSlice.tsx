// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface Frame {
  frameID: number;
  brandName: string;
  model: string;
  asize: number;
  temple: number;
  bridge: number;
  color: string;
  price: number;
  mrp:number;
  unitPurchased: number;
  totalPurchased: number;
  createdDate: string;
  createdBy: string;
  modifiedDate?: string | null;
  modifiedBy?: string | null;
}

// Define the initial state using the Frame interface
interface FrameState {
  frames: Frame[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FrameState = {
  frames: [],
  status: 'idle',
  error: null,
};

// Async thunk for updating a frame in stock
export const addFrameInStock = createAsyncThunk<
  Frame,
  Frame,
  { rejectValue: string }
>('FrameSearchnStock', async (frameData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.FrameUrlAdd
    const response = await axios.post<Frame>(
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
      .addCase(addFrameInStock.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addFrameInStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.frames.findIndex(
          (frame) => frame.frameID === action.payload.frameID
        );
        if (index !== -1) {
          state.frames[index] = action.payload;
        } else {
          state.frames.push(action.payload);
        }
      })
      .addCase(addFrameInStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update frame in stock';
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
