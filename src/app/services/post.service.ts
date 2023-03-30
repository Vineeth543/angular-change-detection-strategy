import { combineLatest, map } from 'rxjs';
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
      })
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
    })
  );
}
