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
    deleteUserPhoto: (state, action) => {
      state.myUser.photos = state.myUser.photos.filter(
        (photo) => photo.id !== action.payload
      );
    },
    addUserPhoto: (state, action) => {
      state.myUser.photos = state.myUser.photos.concat(action.payload);
    },
    editMainPic: (state, action) => {
      state.myUser.photos = state.myUser.photos.filter(
        (photo) => photo.main === false
      );
      state.myUser.photos = state.myUser.photos.concat(action.payload);
    }
  },
});

export const { initialiseUser, deleteUserPhoto, addUserPhoto, editMainPic } = userSlice.actions;
export const selectUser = (state) => state.user.myUser;
export default userSlice.reducer;
