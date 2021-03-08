import { getPosts } from './../state/posts.selector';
import { Post } from './../../models/posts.model';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.state';
import { deletePost } from '../state/posts.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  posts: Observable<Post[]>;
  constructor(private store: Store<AppState>,private router:Router) {}

  ngOnInit(): void {
    this.posts = this.store.select(getPosts);
  }

  onDeletePost(id: string) {
    if (confirm('Are you sure you want to delete')) {
         // console.log('delete the post');
      this.store.dispatch(deletePost({ id }));
      this.router.navigate(['/posts']);
    }
  }
}

