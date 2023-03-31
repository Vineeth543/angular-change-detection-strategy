import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY, Subject, catchError } from 'rxjs';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SinglePostComponent {
  errorMessageSubject = new Subject<string>();
  errorMessageAction$ = this.errorMessageSubject.asObservable();
  
  constructor(private postService: PostService) {}

  post$ = this.postService.post$.pipe(
    catchError((error: string) => {
      this.errorMessageSubject.next(error);
      return EMPTY;
    })
  );
}
