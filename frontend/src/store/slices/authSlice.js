import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuth:false,
    token:null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        isAuth: (state, action) => {
            state.isAuth = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        }
    },
})

export const { isAuth, setToken } = authSlice.actions;
export const selectAuth = (state) => state.auth.isAuth;
export const getToken = (state) => state.auth.token;
export default authSlice.reducer;