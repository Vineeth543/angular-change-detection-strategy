import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostComponent } from './components/post/post.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { PostDataComponent } from './components/post-data/post-data.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'post', component: PostComponent },
  { path: 'post/add', component: PostFormComponent },
  { path: 'post/edit/:id', component: PostFormComponent },
  { path: 'post-data', component: PostDataComponent },
];

export const routingComponents = [
  HomeComponent,
  PostComponent,
  PostDataComponent,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
