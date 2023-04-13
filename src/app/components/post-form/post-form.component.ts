import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoaderService } from 'src/app/services/loader.service';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { combineLatest, tap } from 'rxjs';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  postId!: string;
  postForm: FormGroup = new FormGroup({
    title: new FormControl(null, [
      Validators.required,
      Validators.minLength(6),
    ]),
    description: new FormControl(null, [
      Validators.required,
      Validators.minLength(10),
    ]),
    categoryId: new FormControl(null, [Validators.required]),
  });

  constructor(
    private categoryService: CategoryService,
    private loaderService: LoaderService,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loaderService.showLoader();
  }

  post$ = this.postService.post$.pipe(
    tap((post) => {
      this.postId &&
        this.postForm.setValue({
          title: post?.title,
          description: post?.description,
          categoryId: post?.categoryId,
        });
    })
  );

  selectedPostId$ = this.route.paramMap.pipe(
    tap((params) => {
      this.postId = params.get('id')!;
      this.postId && this.postService.selectPost(this.postId);
    })
  );

  categories$ = this.categoryService.categories$;

  viewModel$ = combineLatest([this.selectedPostId$, this.post$]).pipe(
    tap(() => this.loaderService.hideLoader())
  );

  showFormErrors(field: string): string | void {
    const targetField = this.postForm.get(field);
    if (targetField?.touched && !targetField.valid) {
      if (targetField.errors?.['required']) {
        if (field === 'categoryId') {
          return 'Category is required';
        }
        return field[0].toUpperCase() + field.slice(1) + ' is required';
      }
      if (targetField.errors?.['minlength'] && field === 'title') {
        return 'Title must atleast have 6 characters';
      }
      if (targetField.errors?.['minlength'] && field === 'description') {
        return 'Description must atleast have 10 characters';
      }
    }
  }

  onPostSubmit(): void {
    if (!this.postForm.valid) return;
    let postDetails: Post = this.postForm.value;
    if (this.postId) {
      postDetails = { ...postDetails, id: this.postId };
      this.postService.updatePost(postDetails);
    } else {
      this.postService.addPost(this.postForm.value);
    }
  }
}
