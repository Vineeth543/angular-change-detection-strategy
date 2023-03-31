import {
  map,
  share,
  Subject,
  catchError,
  throwError,
  shareReplay,
  combineLatest,
} from 'rxjs';
import { Post } from '../models/post';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  posts$ = this.http
    .get<{ [id: string]: Post }>(
      'https://rxjs-posts-default-rtdb.firebaseio.com/posts.json'
    )
    .pipe(
      map((response: { [id: string]: Post }) => {
        const posts: Post[] = [];
        for (const id in response) {
          posts.push({ ...response[id], id });
        }
        return posts;
      }),
      catchError((error: Error) =>
        throwError(() => 'Posts Error. Error while fetching posts.')
      ),
      shareReplay(1)
    );

  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) => {
      return posts.map((post: Post) => {
        return {
          ...post,
          categoryName:
            categories.find(
              (category: Category) => category.id === post.categoryId
            )?.title || 'Others',
        };
      });
    }),
    catchError((error: Error) =>
      throwError(() => 'Category Error. Error while fetching categories.')
    )
  );

  private selectedPostSubject = new Subject<string>();
  slectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([
    this.postsWithCategory$,
    this.slectedPostAction$,
  ]).pipe(
    map(([posts, selectedPostId]) =>
      posts.find((post: Post) => post.id === selectedPostId)
    ),
    catchError((error: Error) =>
      throwError(() => 'Post Error. Error while fetching post.')
    )
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }
}
