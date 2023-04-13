import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpdatePostComponent } from './components/update-post/update-post.component';
import { PostFormComponent } from './components/post-form/post-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SinglePostComponent,
    LoaderComponent,
    AddPostComponent,
    routingComponents,
    UpdatePostComponent,
    PostFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
