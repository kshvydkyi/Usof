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

export const fetchPersonalPosts = createAsyncThunk('posts/personalPosts', async ({page=1, id}) => {
    // console.log('fetch', page, id)
    const response = await axios.get(`/api/posts/user/${id}?page=${page}`);
    return response.data;
})
  
  export const fetchPostCategory = createAsyncThunk(
    'posts/postCategories',
    async (id) => {
      const response = await axios.get(`/api/posts/${id}/categories`);
      // console.log(`caterories fetch post id:${id}`, response.data)
      return response.data;
    }
  );
  
  export const fetchPostLike = createAsyncThunk('posts/postLike', async (id) => {
    const response = await axios.get(`/api/posts/${id}/like`);
    // console.log('likes', response.data);
    return response.data;
  });
  
  export const fetchPostComments = createAsyncThunk(
    'posts/postComments',
    async (id) => {
      const response = await axios.get(`/api/posts/${id}/comments`);
      // console.log('coments', response.data);
      return response.data;
    }
  );
  
  const postsAdapter = createEntityAdapter();
  
  const initialState = postsAdapter.getInitialState({
    postCategories: {},
    postLikes: {},
    likesInfo: {},
    postComments: {},
    personalPosts: {},
    error: null,
    loading: true,
    countPages: null,
    personalCountPages: null
  });
  // console.log('initial state', initialState);
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
     
        // .addCase(fetchPostLike.pending, (state) => {
        //   state.loading = true;
        // })
        // .addCase(fetchPosts.pending, (state) => {
        //   state.loading = true;
        // })
        .addCase(fetchPosts.fulfilled, (state, { payload }) => {
          state.loading = false;
          state.countPages = payload.values.meta.totalPages;
          postsAdapter.addMany(state, payload.values.data);
        })
        .addCase(fetchPosts.rejected, (state) => {
          state.loading = false;
          state.error = 'Error load post try later :(';
        })
        .addCase(fetchPersonalPosts.fulfilled, (state, {payload}) => {
            // console.log('payload',payload);
            state.personalCountPages = payload.values.meta.totalPages;
            state.personalPosts = payload.values.data; 
            state.loading = false;
            
        })
        .addCase(fetchPersonalPosts.pending, (state, {payload}) => {
          // console.log('payload',payload);
          state.loading = true;
          
      })
      .addCase(fetchPersonalPosts.rejected, (state, {payload}) => {
        // console.log('payload',payload);
        state.loading = false;
        state.error = 'Error load post try later :(';
        
      })
        .addCase(fetchPostCategory.fulfilled, (state, { payload }) => {
          state.postCategories[payload.values.postId] = [...payload.values.categories];
        })
        .addCase(fetchPostLike.fulfilled, (state, { payload }) => {
          // console.log('payload likes', payload);
          // const post = +payload.values.postId;
          // console.log(post);
          state.postLikes[payload.values.postId] = payload.values.likes.length;
          state.likesInfo[payload.values.postId] = payload.values.likes;
        })
        .addCase(fetchPostComments.fulfilled, (state, { payload }) => {
          // console.log('payload comments', payload);
          state.postComments[payload.values.postId] = {
            countComments: payload.values.coments.length,
            comments: payload.values,
          };
        });
    },
  });
  
  export const { action } = postsSlice;
  
  export const selectors = postsAdapter.getSelectors((state) => state.posts);
  
  export const getFetchStatus = (state) => state.posts.loading;
  
  export default postsSlice.reducer;