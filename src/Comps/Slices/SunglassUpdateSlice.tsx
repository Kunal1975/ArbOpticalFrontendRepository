// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface updateFrame {
  "glassId":number,
    "brandName": string,
    "model": string,
    "color": string,
    "unit": number,
    "price": number,
    "mrp": number,
    "createdBy": "string"
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
export const updateGlassInStock = createAsyncThunk<
  updateFrame,
  updateFrame,
  { rejectValue: string }
>('FrameSearchnStock', async (frameData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.GlassUpdate
    const response = await axios.put<updateFrame>(
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
      .addCase(updateGlassInStock.pending, (state) => {
        state.updatestatus = 'loading';
        state.updateerror = null;
      })
      .addCase(updateGlassInStock.fulfilled, (state, action) => {
        state.updatestatus = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.updateframes.findIndex(
          (updateframe) => updateframe.glassId === action.payload.glassId
        );
        if (index !== -1) {
          state.updateframes[index] = action.payload;
        } else {
          state.updateframes.push(action.payload);
        }
      })
      .addCase(updateGlassInStock.rejected, (state, action) => {
        state.updatestatus = 'failed';
        state.updateerror = action.payload ?? 'Failed to update frame in stock';
      });
  },
});

export default frameSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.Sunglass.glasses;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.Sunglass.status;

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.Sunglass.error;
