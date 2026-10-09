import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface GetLink{
  name: string;
  link: string;
}
@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor(private http: HttpClient) { }

  

  getLink(): Observable<GetLink[]>{
    return this.http.get<GetLink[]>('api/get_link/', {
      withCredentials: true
    });
  }
}
