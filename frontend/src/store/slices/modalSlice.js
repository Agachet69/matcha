import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deleteMainPic: false,
  deletePic: false
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    editDeleteMainPic: (state) => {
      state.deleteMainPic = !state.deleteMainPic;
    },
    editDeletePic: (state) => {
      state.deletePic = !state.deletePic;
    },
  },
});

export const { editDeleteMainPic, editDeletePic } = modalSlice.actions;
export const selectModalMainPic = (state) => state.modal.deleteMainPic;
export const selectModalPic = (state) => state.modal.deletePic;
export default modalSlice.reducer;
