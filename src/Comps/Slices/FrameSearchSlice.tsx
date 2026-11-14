import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"
export interface SearchFrame {
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
    searchframes: SearchFrame[];
    searchstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    searcherror: string | null;
  }
  
  const initialState: FrameState = {
    searchframes: [],
    searchstatus: 'idle',
    searcherror: null,
  };
  
  // Async thunk for updating a frame in stock
  export const searchFrame = createAsyncThunk<
  SearchFrame,
  SearchFrame,
    { rejectValue: string }
  >('FramePutinStock', async (frameSearchData, { rejectWithValue }) => {
    try {
      var urlFrame=config.Serviceurl.FrameUrlSearch;
      const response = await axios.post<SearchFrame>(
        urlFrame,
        frameSearchData
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
        .addCase(searchFrame.pending, (state) => {
          state.searchstatus = 'loading';
          state.searcherror = null;
        })
        .addCase(searchFrame.fulfilled, (state, action) => {
          state.searchstatus = 'succeeded';
          // Update the frame in the state if it exists, otherwise add it
          const index = state.searchframes.findIndex(
            (searchframe) => searchframe.frameID === action.payload.frameID
          );
          if (index !== -1) {
            state.searchframes[index] = action.payload;
          } else {
            state.searchframes.push(action.payload);
          }
        })
        .addCase(searchFrame.rejected, (state, action) => {
          state.searchstatus = 'failed';
          state.searcherror = action.payload ?? 'Invalid search criteria for Frame';
        });
    },
  });
  
  export default frameSlice.reducer;
  
  // Selector to get all frames
  export const selectAllFrames = (state: RootState) => state.FrameSearch.searchframes;
  
  // Selector to get the status of the update operation
  export const selectFrameStatus = (state: RootState) => state.FrameSearch.searchstatus;
  
  // Selector to get any error messages
  export const selectFrameError = (state: RootState) => state.FrameSearch.searcherror;
  