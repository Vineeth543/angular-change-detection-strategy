import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Post } from 'src/app/models/post';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent {
  selectedCategoryId: string = '';
  selectedCategorySubject = new BehaviorSubject<string>('');
  selectedCategoryAction$ = this.selectedCategorySubject.asObservable();

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  categories$ = this.categoryService.categories$;

  posts$ = combineLatest([
    this.postService.postsWithCategory$,
    this.selectedCategoryAction$,
  ]).pipe(
    map(([posts, selectedCategoryId]) => {
      return posts.filter((post: Post) =>
        selectedCategoryId === 'other'
          ? post.categoryName === 'Others'
          : selectedCategoryId
          ? post.categoryId === selectedCategoryId
          : true
      );
    })
  );

  onCategoryChange(event: Event) {
    this.selectedCategoryId = (event.target as HTMLSelectElement).value;
    this.selectedCategorySubject.next(this.selectedCategoryId);
  }
}
