import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"
export interface SearchGlass {
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
  interface GlassSearchState{
    searchglass: SearchGlass[];
    searchstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    searcherror: string | null;
  }
  
  const initialState: GlassSearchState = {
    searchglass: [],
    searchstatus: 'idle',
    searcherror: null,
  };
  
  // Async thunk for updating a frame in stock
  export const glassSearch = createAsyncThunk<
  SearchGlass,
  SearchGlass,
    { rejectValue: string }
  >('FramePutinStock', async (frameSearchData, { rejectWithValue }) => {
    try {
      var urlFrame=config.Serviceurl.GlassSearch
      const response = await axios.post<SearchGlass>(
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
  
  const glassSearchSlice = createSlice({
    name: 'glasssearch',
    initialState,
    reducers: {
      // You can add synchronous actions here if needed
    },
    extraReducers: (builder) => {
      builder
        .addCase(glassSearch.pending, (state) => {
          state.searchstatus = 'loading';
          state.searcherror = null;
        })
        .addCase(glassSearch.fulfilled, (state, action) => {
          state.searchstatus = 'succeeded';
          // Update the frame in the state if it exists, otherwise add it
          const index = state.searchglass.findIndex(
            (searchglass) => searchglass.glassId === action.payload.glassId
          );
          if (index !== -1) {
            state.searchglass[index] = action.payload;
          } else {
            state.searchglass.push(action.payload);
          }
        })
        .addCase(glassSearch.rejected, (state, action) => {
          state.searchstatus = 'failed';
          state.searcherror = action.payload ?? 'Invalid search criteria for Frame';
        });
    },
  });
  
  export default glassSearchSlice.reducer;
  
  // Selector to get all frames
  export const selectAllFrames = (state: RootState) => state.SunGlassSearch.glasses;
  
  // Selector to get the status of the update operation
  export const selectFrameStatus = (state: RootState) => state.SunGlassSearch.status;
  
  // Selector to get any error messages
  export const selectFrameError = (state: RootState) => state.SunGlassSearch.error;
  