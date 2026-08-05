import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Response {
  message: string;
}
@Injectable({
  providedIn: 'root'
})
export class AddMusicService {

  constructor(private http: HttpClient) { }

  uploadMusic(formData: FormData): Observable<Response> {
    return this.http.post<Response>(
      "http://localhost:8000/api/add_music/", formData, {
        withCredentials: true
      }
    )
  }
}
