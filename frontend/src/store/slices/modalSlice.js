import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteMainPic: false,
  deletePic: false,
  likedUser: false,
  viewUser: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    editDeleteMainPic: (state) => {
      state.deletePic = false;
      state.likedUser = false;
      state.viewUser = false;
      state.deleteMainPic = !state.deleteMainPic;
    },
    editDeletePic: (state) => {
      state.deleteMainPic = false;
      state.likedUser = false;
      state.viewUser = false;
      state.deletePic = !state.deletePic;
    },
    editViewUser: (state) => {
      state.deleteMainPic = false;
      state.deletePic = false;
      state.likedUser = false;
      state.viewUser = !state.viewUser;
    },
    editLikedUser: (state) => {
      state.deleteMainPic = false;
      state.deletePic = false;
      state.viewUser = false;
      state.likedUser = !state.likedUser;
    },
    resetAllModals: (state) => {
      state.likedUser = false;
      state.deletePic = false;
      state.deleteMainPic = false;
      state.viewUser = false;
    },
  },
});

export const {
  editDeleteMainPic,
  editDeletePic,
  editLikedUser,
  resetAllModals,
  editViewUser,
} = modalSlice.actions;
export const selectModalMainPic = (state) => state.modal.deleteMainPic;
export const selectModalPic = (state) => state.modal.deletePic;
export const selectModalLikedUser = (state) => state.modal.likedUser;
export const selectAllModals = (state) => state.modal;
export default modalSlice.reducer;
