import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteMainPic: false,
  deletePic: false,
  likedUser: false,
  viewUser: false,
  notif: false,
  blockUser: false,
  match: null,
  user: null,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    editDeleteMainPic: (state, action) => {
      return { ...initialState, deleteMainPic: !action.payload };
    },
    editDeletePic: (state, action) => {
      return { ...initialState, deletePic: !action.payload };
    },
    editViewUser: (state, action) => {
      return { ...initialState, viewUser: !action.payload };
    },
    editLikedUser: (state, action) => {
      return { ...initialState, likedUser: !action.payload };
    },
    editNotif: (state, action) => {
      return { ...initialState, notif: !action.payload };
    },
    editBlockUser: (state, action) => {
      return { ...initialState, blockUser: !action.payload };
    },
    editMatch: (state, action) => {
      return { ...initialState, match: !action.payload };
    },
    editConcernUser: (state, action) => {
      return { ...state, user: action.payload };
    },
    resetAllModals: (state) => {
      state.likedUser = false;
      state.deletePic = false;
      state.deleteMainPic = false;
      state.viewUser = false;
      state.notif = false;
      state.blockUser = false;
      state.match = false;
    },
  },
});

export const {
  editDeleteMainPic,
  editDeletePic,
  editLikedUser,
  editViewUser,
  editNotif,
  editBlockUser,
  editConcernUser,
  editMatch,
  resetAllModals,
} = modalSlice.actions;
export const selectModalMainPic = (state) => state.modal.deleteMainPic;
export const selectModalPic = (state) => state.modal.deletePic;
export const selectModalLikedUser = (state) => state.modal.likedUser;
export const selectAllModals = (state) => state.modal;
export default modalSlice.reducer;
