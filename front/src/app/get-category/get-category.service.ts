import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
interface Category{
  name: string;
}
@Injectable({
  providedIn: 'root'
})
export class GetCategoryService {

  constructor(private http: HttpClient) { }

  // getCategory(): Observable<Category[]>{
  //   return this.http.get<Category[]>('http://localhost:8000/api/')
  // }
}
