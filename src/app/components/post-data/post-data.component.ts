import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
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

  posts$ = this.postService.postsWithCategory$.pipe(
    tap((posts) => this.postService.selectPost(posts[0].id))
  );

  selectedPostId$ = this.postService.post$;

  viewModel$ = combineLatest([this.posts$, this.selectedPostId$]).pipe(
    map(([posts, selectedPost]) => {
      return { posts, selectedPost };
    })
  );

  onSelectPost(post: Post, event: Event) {
    event.preventDefault();
    this.postService.selectPost(post.id);
  }
}
