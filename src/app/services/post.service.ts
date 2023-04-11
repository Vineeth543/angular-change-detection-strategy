import {
  of,
  map,
  scan,
  share,
  merge,
  Subject,
  concatMap,
  catchError,
  throwError,
  combineLatest,
  BehaviorSubject,
} from 'rxjs';
import { Post, CRUDAction } from '../models/post';
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
      'https://angular-rxjs-project-default-rtdb.firebaseio.com/posts.json'
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
      share()
    );

  postsWithCategory$ = combineLatest([
    this.posts$,
    this.categoryService.categories$,
  ]).pipe(
    map(([posts, categories]) =>
      posts.map((post: Post) => ({
        ...post,
        categoryName: categories.find(
          (category: Category) => category.id === post.categoryId
        )?.title,
      }))
    ),
    catchError((error: Error) =>
      throwError(() => 'Category Error. Error while fetching categories.')
    ),
    share()
  );

  private postCRUDSubject = new Subject<CRUDAction<Post>>();
  postCRUDAction$ = this.postCRUDSubject.asObservable();

  allPosts$ = merge(
    this.postsWithCategory$,
    this.postCRUDAction$.pipe(
      concatMap((postAction) =>
        this.savePost(postAction).pipe(
          map((post) => ({ ...postAction, data: post }))
        )
      )
    )
  ).pipe(
    scan((posts, value) => {
      return this.modifyPosts(posts, value);
    }, [] as Post[]),
    share()
  );

  modifyPosts(posts: Post[], value: Post[] | CRUDAction<Post>) {
    if (!(value instanceof Array)) {
      if (value.action === 'add') {
        return [...posts, value.data];
      }
    } else {
      return value;
    }
    return posts;
  }

  savePost(postAction: CRUDAction<Post>) {
    if (postAction.action === 'add') {
      return this.addPostToServer(postAction.data).pipe(
        concatMap((post) =>
          this.categoryService.categories$.pipe(
            map((categories) => ({
              ...post,
              categoryName: categories.find(
                (category) => category.id === post.categoryId
              )?.title,
            }))
          )
        )
      );
    }
    return of(postAction.data);
  }

  addPostToServer(post: Post) {
    return this.http
      .post<{ name: string }>(
        `https://angular-rxjs-project-default-rtdb.firebaseio.com/posts.json`,
        post
      )
      .pipe(map((id) => ({ ...post, id: id.name })));
  }

  addPost(post: Post) {
    this.postCRUDSubject.next({ action: 'add', data: post });
  }

  private selectedPostSubject = new BehaviorSubject<string>('');
  slectedPostAction$ = this.selectedPostSubject.asObservable();

  post$ = combineLatest([this.allPosts$, this.slectedPostAction$]).pipe(
    map(([posts, selectedPostId]) =>
      posts.find((post: Post) => post.id === selectedPostId)
    ),
    catchError((error: Error) =>
      throwError(() => 'Post Error. Error while fetching post.')
    ),
    share()
  );

  selectPost(postId: string) {
    this.selectedPostSubject.next(postId);
  }
}
