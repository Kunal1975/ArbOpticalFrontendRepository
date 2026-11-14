// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface Sunglass {
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
interface GlassState {
  glasses: Sunglass[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: GlassState = {
  glasses: [],
  status: 'idle',
  error: null,
};

// Async thunk for updating a frame in stock
export const addGlassInStock = createAsyncThunk<
Sunglass,
Sunglass,
  { rejectValue: string }
>('FrameSearchnStock', async (frameData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.GlassAddStock
    const response = await axios.post<Sunglass>(
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

const glassSlice = createSlice({
  name: 'sunglass',
  initialState,
  reducers: {
    // You can add synchronous actions here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(addGlassInStock.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addGlassInStock.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.glasses.findIndex(
          (Sunglass) => Sunglass.glassId === action.payload.glassId
        );
        if (index !== -1) {
          state.glasses[index] = action.payload;
        } else {
          state.glasses.push(action.payload);
        }
      })
      .addCase(addGlassInStock.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to update glass in stock';
      });
  },
});

export default glassSlice.reducer;

// Selector to get all frames
export const selectAllGlasses = (state: RootState) => state.Sunglass.glasses

// Selector to get the status of the update operation
export const selectGlassStatus = (state: RootState) => state.Sunglass.status;

// Selector to get any error messages
export const selectGlassError = (state: RootState) => state.Sunglass.error;
