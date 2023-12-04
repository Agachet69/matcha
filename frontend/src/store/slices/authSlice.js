import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    isAuth:false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        isAuth: (state, action) => {
            state.isAuth = action.payload
        },
    },
})

export const { isAuth } = authSlice.actions;
export const selectAuth = (state) => state.auth.isAuth;
export default authSlice.reducer;