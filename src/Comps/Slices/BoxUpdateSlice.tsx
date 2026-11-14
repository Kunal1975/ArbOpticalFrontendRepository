// src/features/frame/frameSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"

// Define the Frame interface
export interface updateBox {
    boxId: number,
    boxType: string,
    unitCost: number,
    unitPurchased: number,
    totalPurchased: number,
    purchaseDate: string,
    modifiedDate: string,
    createdBy: string,
    modifyedBy?: string|null
}

// Define the initial state using the Frame interface
interface updateBoxState {
  updateBox: updateBox[];
  updateBoxstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  updatBoxeerror: string | null;
}

const initialState: updateBoxState = {
    updateBox: [],
    updateBoxstatus: 'idle',
    updatBoxeerror: null,
};

// Async thunk for updating a frame in stock
export const updateBoxInStock = createAsyncThunk<
updateBox,
updateBox,
  { rejectValue: string }
>('FrameSearchnStock', async (boxData, { rejectWithValue }) => {
  try {
    var urlFrame=config.Serviceurl.BoxUrlUpdate
    const response = await axios.post<updateBox>(
      urlFrame,
      boxData
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
      .addCase(updateBoxInStock.pending, (state) => {
        state.updateBoxstatus = 'loading';
        state.updatBoxeerror = null;
      })
      .addCase(updateBoxInStock.fulfilled, (state, action) => {
        state.updateBoxstatus = 'succeeded';
        // Update the frame in the state if it exists, otherwise add it
        const index = state.updateBox.findIndex(
          (updateBox) => updateBox.boxId === action.payload.boxId
        );
        if (index !== -1) {
          state.updateBox[index] = action.payload;
        } else {
          state.updateBox.push(action.payload);
        }
      })
      .addCase(updateBoxInStock.rejected, (state, action) => {
        state.updateBoxstatus = 'failed';
        state.updatBoxeerror = action.payload ?? 'Failed to update frame in stock';
      });
  },
});

export default frameSlice.reducer;

// Selector to get all frames
export const selectAllFrames = (state: RootState) => state.BoxUpdeate.updateBox;

// Selector to get the status of the update operation
export const selectFrameStatus = (state: RootState) => state.BoxUpdeate.updateBoxstatus;

// Selector to get any error messages
export const selectFrameError = (state: RootState) => state.BoxUpdeate.updatBoxeerror;
