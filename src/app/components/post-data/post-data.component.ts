import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-data',
  templateUrl: './post-data.component.html',
  styleUrls: ['./post-data.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDataComponent {
  constructor(private postService: PostService) {}

  posts$ = this.postService.postsWithCategory$;

  onSelectPost(post: Post, event: Event) {
    event.preventDefault();
    this.postService.selectPost(post.id);
  }
}
