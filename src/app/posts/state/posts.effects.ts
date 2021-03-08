import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { dispatch } from "rxjs/internal/observable/pairs";
import { map, mergeMap } from "rxjs/operators";
import { PostsService } from "src/app/services/posts.service";
import { loadPosts, loadPostsSuccess } from "./posts.actions";

@Injectable()
export class PostsEffects {
  constructor(private actions$:Actions,private postsService:PostsService){}


  loadPosts$ = createEffect(
    () => {
    return this.actions$.pipe(
      ofType(loadPosts),
      mergeMap((action) => {
        return this.postsService.getPosts().pipe(
          map((posts) => {
            return loadPostsSuccess({ posts })
          })
        );
      })
    );
  });
}
