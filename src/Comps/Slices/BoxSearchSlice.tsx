import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../Store/Store';
import config  from "../../Configsettings/appsettings.json"
export interface SearchBox {
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
  interface BoxState {
    searchboxes: SearchBox[];
    searchboxstatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    searchboxerror: string | null;
  }
  
  const initialState: BoxState = {
    searchboxes: [],
    searchboxstatus: 'idle',
    searchboxerror: null,
  };
  
  // Async thunk for updating a frame in stock
  export const BoxSearch = createAsyncThunk<
  SearchBox,
  SearchBox,
    { rejectValue: string }
  >('BoxSearch', async (BoxSearchData, {rejectWithValue }) => {
    try {
       
      var urlBox=config.Serviceurl.BoxUrlSearch;
      const response = await axios.post<SearchBox>(
        urlBox,
        BoxSearchData
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
  
  const BoxSearchSlice = createSlice({
    name: 'boxsearch',
    initialState,
    reducers: {
      // You can add synchronous actions here if needed
    },
    extraReducers: (builder) => {
      builder
        .addCase(BoxSearch.pending, (state) => {
          state.searchboxstatus = 'loading';
          state.searchboxerror = null;
        })
        .addCase(BoxSearch.fulfilled, (state, action) => {
          state.searchboxstatus = 'succeeded';
          // Update the frame in the state if it exists, otherwise add it
          const index = state.searchboxes.findIndex(
            (searchboxes) => searchboxes.boxId === action.payload.boxId
          );
          if (index !== -1) {
            state.searchboxes[index] = action.payload;
          } else {
            state.searchboxes.push(action.payload);
          }
        })
        .addCase(BoxSearch.rejected, (state, action) => {
          state.searchboxstatus = 'failed';
          state.searchboxerror = action.payload ?? 'Invalid Criteria for Box Search ';
        });
    },
  });
  
  export default BoxSearchSlice.reducer;
  
  // Selector to get all frames
  export const selectAllFrames = (state: RootState) => state.FrameSearch.searchframes;
  
  // Selector to get the status of the update operation
  export const selectFrameStatus = (state: RootState) => state.FrameSearch.searchstatus;
  
  // Selector to get any error messages
  export const selectFrameError = (state: RootState) => state.FrameSearch.searcherror;
  