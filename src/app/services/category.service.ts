import { map, share, shareReplay } from 'rxjs';
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  categories$ = this.http
    .get<{ [id: string]: Category }>(
      'https://rxjs-posts-default-rtdb.firebaseio.com/categories.json'
    )
    .pipe(
      map((response: { [id: string]: Category }) => {
        const categories: Category[] = [];
        for (const id in response) {
          categories.push({ ...response[id], id });
        }
        return categories;
      }),
      shareReplay(1)
    );
}
