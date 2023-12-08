import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

export const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    addBookmark: (state, action) => {
      state.push(action.payload);
    },
    removeBookmark: (state, action) => {
      return (state = state.filter(
        bookmark => bookmark.title !== action.payload.title
      ));
    },
    removeAllBookmarks: state => (state = []),
  },
});

export const { addBookmark, removeBookmark, removeAllBookmarks } =
  bookmarksSlice.actions;
export const bookmarks = bookmarksSlice.reducer;
