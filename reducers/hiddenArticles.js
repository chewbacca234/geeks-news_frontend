import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const hiddenArticlesSlice = createSlice({
  name: 'hiddenArticles',
  initialState,
  reducers: {
    hideArticle: (state, action) => {
      const title = action.payload;
      state.push(title);
    },
    addAllHiddenArticles: (state, action) => {
      return (state = action.payload);
    },
    showAllArticles: state => (state = []),
  },
});

export const { hideArticle, addAllHiddenArticles, showAllArticles } =
  hiddenArticlesSlice.actions;
export const hiddenArticles = hiddenArticlesSlice.reducer;
