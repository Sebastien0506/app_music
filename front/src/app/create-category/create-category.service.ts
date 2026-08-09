import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//On fait une interface pour recevoir la reponse
interface ResponseCreateCategory {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreateCategoryService {

  constructor(private http: HttpClient) { }

  //On envoi la requête pour crée la catégorie
  sendRequestCreateCategory(data: any): Observable<ResponseCreateCategory> {
    return this.http.post<ResponseCreateCategory>('http://localhost:8000/api/create_category/', data, {
      withCredentials: true
    })
  }


}
