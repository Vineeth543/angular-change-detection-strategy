import { tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePostComponent {
  postId!: string;
  editPostForm!: FormGroup;

  @Output() cancelUpdatePost = new EventEmitter<void>();

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  post$ = this.postService.post$.pipe(
    tap((post: Post | undefined) => {
      this.postId = post?.id!;
      this.editPostForm = new FormGroup({
        title: new FormControl(post?.title, [
          Validators.required,
          Validators.minLength(6),
        ]),
        description: new FormControl(post?.description, [
          Validators.required,
          Validators.minLength(10),
        ]),
        categoryId: new FormControl(post?.categoryId, [Validators.required]),
      });
    })
  );

  categories$ = this.categoryService.categories$;

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

  onUpdatePost() {
    let post: Post = {
      id: this.postId,
      ...this.editPostForm.value,
    };
    this.postService.updatePost(post);
  }

  onCancelUpdatePost() {
    this.cancelUpdatePost.emit();
  }
}
