import { createSlice } from '@reduxjs/toolkit';

const initialState = ['the-verge'];

export const sourcesSlice = createSlice({
  name: 'sources',
  initialState,
  reducers: {
    addSource: (state, action) => {
      state.push(action.payload);
    },
    addAllSources: (state, action) => {
      return (state = action.payload);
    },
    removeSource: (state, action) => {
      return (state = state.filter(source => source !== action.payload));
    },
    removeAllSources: state => (state = initialState),
  },
});

export const { addSource, addAllSources, removeSource, removeAllSources } =
  sourcesSlice.actions;
export const sources = sourcesSlice.reducer;
