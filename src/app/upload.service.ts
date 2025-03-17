import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = 'https://campainha-api.onrender.com/upload';

  constructor(private http: HttpClient) { }

  uploadFile(file: File | null, name: string): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('file', file); // Só adiciona se houver arquivo
    }
    if (name) {
      formData.append('name', name); // Adiciona o nome opcionalmente
    }
    return this.http.post(this.apiUrl, formData);
  }
}
