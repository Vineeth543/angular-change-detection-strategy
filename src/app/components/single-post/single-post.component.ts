import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Subject, catchError } from 'rxjs';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  showUpdatePost!: boolean;
  errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();

  constructor(private postService: PostService) {}

  post$ = this.postService.post$.pipe(
    catchError((error: string) => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    })
  );

  onUpdatePost() {
    this.showUpdatePost = true;
  }

  onCancelUpdatePost() {
    this.showUpdatePost = false;
  }

  onDeletePost(post: Post) {
    if (confirm(`Are you sure you want to delete this post..?`)) {
      this.postService.deletePost(post);
    }
  }
}
