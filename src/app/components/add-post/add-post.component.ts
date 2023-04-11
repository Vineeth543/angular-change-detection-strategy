import {
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/services/category.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPostComponent {
  addPostForm!: FormGroup;

  @Output() cancelAddPost = new EventEmitter<void>();

  constructor(
    private categoryService: CategoryService,
    private postService: PostService
  ) {}

  categories$ = this.categoryService.categories$;

  ngOnInit(): void {
    this.addPostForm = new FormGroup({
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
  }

  onAddPost(): void {
    if (!this.addPostForm.valid) return;
    this.postService.addPost(this.addPostForm.value);
    this.addPostForm.reset();
  }

  showFormErrors(field: string): string | void {
    const targetField = this.addPostForm.get(field);
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

  onCancelAddPost(): void {
    this.cancelAddPost.emit();
  }
}
