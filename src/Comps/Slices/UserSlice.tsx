import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import React from "react";
import config  from "../../Configsettings/appsettings.json"
import axios from 'axios'

// src/features/auth/authSlice.ts
interface ResponseModel {
   status:string;
   message:string
  
  }
  interface  ResponseModelState
  {
    ResponseModel:ResponseModel | null,
    isLoading: boolean,
    error: string|null
  }
  const initialState: ResponseModelState={
    ResponseModel:null,
    isLoading: false,
    error: null
  }
  
  export const VerifyCode= createAsyncThunk<ResponseModel,string>(
    'VerifyCode',
    async (verificationCode, { rejectWithValue }) => {
      try {
        const url=config.Serviceurl.VerifyUrl
       
        const response = await axios.get<ResponseModel>(
          url,
          {
            params: { Code: verificationCode },
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        return response.data; // Return the response data typed as ResponseModel
      } 
      catch (error: any) {
        return rejectWithValue(
          error.response?.data?.message || error.message || 'Failed to verify code'
        );
    }
  }
);
  const UserSlice = createSlice({
    name: 'UserSliceReducer',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(VerifyCode.pending, (state) => {
          state.isLoading = true;
          state.error = null;
        })
        .addCase(VerifyCode.fulfilled, (state, action) => {
          state.isLoading = false;
          state.ResponseModel = action.payload;
        })
        .addCase(VerifyCode.rejected, (state, action) => {
          state.isLoading = false;
          state.error = action.payload as string;
        });
    },
  });
  
  export default UserSlice.reducer;
  
