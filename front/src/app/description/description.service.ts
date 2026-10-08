import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface AddDescriptionAndLink{
  success?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})


export class DescriptionService {

  constructor(private http: HttpClient) { }

  addDescriptionAndlink(data: any): Observable<AddDescriptionAndLink> {
    return this.http.post<AddDescriptionAndLink>('api/add_description_and_link/', data , {
      withCredentials: true
    });
  }
}
