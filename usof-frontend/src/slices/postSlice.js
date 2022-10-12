import {
    createAsyncThunk,
    createSlice,
    createEntityAdapter,
  } from '@reduxjs/toolkit';
  import axios from 'axios';

  
  export const fetchPosts = createAsyncThunk('posts/allPost', async (page=1) => {
    const response = await axios.get(`/api/posts/?page=${page}`);
    return response.data;
  });
  
//   export const fetchPostCategory = createAsyncThunk(
//     'posts/postCategories',
//     async (id) => {
//       const response = await axios.get(routes.categoriesPost(id));
//       return response.data;
//     }
//   );
  
//   export const fetchPostLike = createAsyncThunk('posts/postLike', async (id) => {
//     const response = await axios.get(routes.likesPost(id));
//     return response.data;
//   });
  
//   export const fetchPostComments = createAsyncThunk(
//     'posts/postComments',
//     async (id) => {
//       const response = await axios.get(routes.commentsPost(id));
//       return response.data;
//     }
//   );
  
  const postsAdapter = createEntityAdapter();
  
  const initialState = postsAdapter.getInitialState({
    error: null,
    loading: true,
    countPages: null,
  });
  
  const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
      addPost: postsAdapter.addOne,
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchPosts.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchPosts.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.countPages = payload.values.meta.totalPages;
          postsAdapter.addMany(state, payload.values.data);
        })
        .addCase(fetchPosts.rejected, (state) => {
          state.loading = false;
          state.error = 'Error load post try later :(';
        })
        // .addCase(fetchPostCategory.fulfilled, (state, { payload }) => {
        //   state.postCategories[payload.postId] = payload.category;
        // })
        // .addCase(fetchPostLike.fulfilled, (state, { payload }) => {
        //   state.postLikes[payload.postId] = {
        //     countLike: payload.countLike,
        //     likeInfo: payload.like,
        //   };
        // })
        // .addCase(fetchPostComments.fulfilled, (state, { payload }) => {
        //   state.postComments[payload.postId] = {
        //     countComments: payload.countComments,
        //     comments: payload.comments,
        //   };
        // });
    },
  });
  
  export const { action } = postsSlice;
  
  export const selectors = postsAdapter.getSelectors((state) => state.posts);
  
  export const getFetchStatus = (state) => state.posts.loading;
  
  export default postsSlice.reducer;