import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PostComponent } from './components/post/post.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { PostDataComponent } from './components/post-data/post-data.component';
import { SinglePostComponent } from './components/single-post/single-post.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, PostComponent, HomeComponent, PostDataComponent, SinglePostComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
