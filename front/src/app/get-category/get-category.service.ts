import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
export interface Category{
  id: number;
  name: string;
}

interface MusicCategory{
  id: number;
  title: string;
  duration: number;
  file: string;
}
@Injectable({
  providedIn: 'root'
})
export class GetCategoryService {

  constructor(private http: HttpClient) { }

  getCtegoryAll(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:8000/api/get_all_category/', {
      withCredentials: true
    })
  }

  getMusicCategory(category_id: number): Observable<MusicCategory[]>{
    return this.http.get<MusicCategory[]>(`http://localhost:8000/api/get_music_category/${category_id}`, {
      withCredentials: true
    });
  }

  
}
