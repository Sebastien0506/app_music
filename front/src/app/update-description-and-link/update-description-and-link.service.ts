import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

//On crée les interface pour la description et les lien

export interface Description{
  description: string;
}

export interface Link{
  name: string;
  link: string;
}
@Injectable({
  providedIn: 'root'
})
export class UpdateDescriptionAndLinkService {

  constructor(private http: HttpClient) { }

  //On fait les requêtes pour récupérer les liens et la description
  get_description(): Observable<Description>{
    return this.http.get<Description>('api/get_description/', {
      withCredentials: true
    });
  }

  get_link(): Observable<Link[]>{
    return this.http.get<Link[]>('api/get_link/', {
      withCredentials: true
    });
  }
}
