import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  myUser: {
    username: null,
    lastName: null,
    firstName: null,
    email: null,
    gender: null,
    sexuality: null,
    age: null,
    bio: null,
    id: null,
    notifs: [],
    likes: [],
    liked_by: [],
    photos: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initialiseUser: (state, action) => {
      state.myUser = action.payload;
    },
  },
});

export const { initialiseUser } = userSlice.actions;
export const selectUser = (state) => state.user.myUser;
export default userSlice.reducer;
