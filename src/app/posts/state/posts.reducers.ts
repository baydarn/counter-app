import { state } from '@angular/animations';
import { createReducer, on } from '@ngrx/store';
import { addPost, deletePost, updatePost } from './posts.actions';
import { initialState } from './posts.state';

const _postsReducer = createReducer(initialState,
  on(addPost,(state,action) => {

    let post = {...action.post};

    post.id = (state.posts.length +1).toString();

      return {
        ...state,
        posts: [...state.posts,post], //it should be immutable
      }
    }), on(updatePost, (state,action)=>{
      const updatedPosts = state.posts.map((post) =>{  // updatedPosts immutably will be updated.
        return action.post.id === post.id ? action.post : post;  //if id is matching
      })
      return {
        ...state,
        posts: updatedPosts,
      };
    }), on(deletePost,(state,{id}) => {  //{} içinde yazınca directly kullanmış oluyoruz
      const updatedPosts = state.posts.filter(post => {
        return post.id !==id;
      });

      return {
        ...state,
        posts: updatedPosts,

      }
    })
);

export function postsReducer(state, action) {
  return _postsReducer(state, action);
}
