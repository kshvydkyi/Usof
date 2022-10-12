import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../slices/postSlice';


export default configureStore({
  reducer: {
    posts: postsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});