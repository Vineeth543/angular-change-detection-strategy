import { Component } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less'],
})
export class PostComponent {
  constructor(private postService: PostService) {}

  posts$ = this.postService.getPostWithCategory();
}
