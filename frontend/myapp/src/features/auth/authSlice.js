import api from "../../services/axiosInstance";
import { loginAPI, registerAPI } from "./authAPI";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, thunkAPI) => {
        try{
            return await loginAPI(credentials);
        }catch(err)
        {
            return thunkAPI.rejectWithValue(
                err.response?.data  || "Login Failed"
            );
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (data, thunkAPI) => {
        try{
            return await registerAPI(data);
        }catch(err){
            return thunkAPI.rejectWithValue(
                err.response?.data || "Registration Failed"
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        isAuthenticated: !!token,
        token: token || null,
        user: user ? JSON.parse(user) : null,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;

            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }

    },
    extraReducers: (builder) => {
        builder
            //Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                console.log(action.payload);
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
                //Persist
                localStorage.setItem("token", action.payload.accessToken);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
                //  persist
                localStorage.setItem("token", action.payload.accessToken);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;