import { tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  editPostForm!: FormGroup;

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  post$ = this.postService.post$.pipe(
    tap((post: Post | undefined) => {
      console.log(post);
      this.createForm(post?.title, post?.description, post?.categoryName);
    })
  );

  categories$ = this.categoryService.categories$;

  createForm(
    title: string | undefined,
    description: string | undefined,
    categoryName: string | undefined
  ): void {
    this.editPostForm = new FormGroup({
      title: new FormControl(title, [
        Validators.required,
        Validators.minLength(6),
      ]),
      description: new FormControl(description, [
        Validators.required,
        Validators.minLength(10),
      ]),
      categoryId: new FormControl(),
    });
  }

  showFormErrors(field: string): string | void {
    const targetField = this.editPostForm.get(field);
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

  onUpdatePost() {}

  onCancelUpdatePost() {}
}
