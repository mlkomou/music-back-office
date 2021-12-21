import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class ArtisteService {
songApiUrl = environment.apiUrl;
  constructor(@Inject(DOCUMENT) private document: Document,
  private http: HttpClient) { }

  getArtiste(): Observable<any> {
    return this.http.get(this.songApiUrl + 'artiste');
    }
  UpdateArtiste(data, photo): Observable<any> {
    let form = new FormData();
    form.append('photo', photo);
    form.append('artiste', JSON.stringify(data));
    return this.http.put(this.songApiUrl + 'artiste/edit', form);
    }

  deleteArtiste(id): Observable<any> {
    return this.http.delete(this.songApiUrl + 'artiste/'+id);
    }

  createArtiste(photo , data): Observable<any> {
    let form = new FormData();
    form.append('photo', photo);
    form.append('artiste', JSON.stringify(data));
    return this.http.post(this.songApiUrl + 'artiste/create', form);
    }



}
