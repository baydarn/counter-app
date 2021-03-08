import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../models/posts.model";
import { postsReducer } from "../posts/state/posts.reducers";

@Injectable({
  providedIn:'root',
})
export class PostsService {
  constructor(private http: HttpClient){
  }

  getPosts(): Observable<Post[]>{
    return this.http
    .get<Post[]>(`gs://counter-ngrx.appspot.com/posts.json`)
    .pipe(
      map((data) => {
        const posts: Post[] = [];
        for (let key in data) {
          posts.push({ ...data[key], id: key });
        }
        return posts;
      })
    );
}
}
