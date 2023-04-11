import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, map, tap } from 'rxjs';
import { Post } from 'src/app/models/post';
import { LoaderService } from 'src/app/services/loader.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-data',
  templateUrl: './post-data.component.html',
  styleUrls: ['./post-data.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostDataComponent {
  showAddPost: boolean = false;

  constructor(
    private postService: PostService,
    private loaderService: LoaderService
  ) {
    this.loaderService.showLoader();
  }

  posts$ = this.postService.allPosts$.pipe(
    tap((posts) => this.postService.selectPost(posts[0].id))
  );

  selectedPostId$ = this.postService.post$;

  viewModel$ = combineLatest([this.posts$, this.selectedPostId$]).pipe(
    map(([posts, selectedPost]) => {
      this.loaderService.hideLoader();
      return { posts, selectedPost };
    })
  );

  onSelectPost(post: Post, event: Event) {
    event.preventDefault();
    this.showAddPost = false;
    this.postService.selectPost(post.id);
  }

  onAddPost() {
    this.showAddPost = true;
  }

  onCancelAddPost() {
    this.showAddPost = false;
  }
}
