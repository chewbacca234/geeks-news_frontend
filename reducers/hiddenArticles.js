import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const hiddenArticlesSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    hideArticle: (state, action) => {
      const title = action.payload
      state.push(title);
    },
    showAll: (state) => state = [],
  },
});

export const { hideArticle, showAll } = hiddenArticlesSlice.actions;
export default hiddenArticlesSlice.reducer;
