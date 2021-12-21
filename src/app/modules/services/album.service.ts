import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class AlbumService {
songApiUrl = environment.apiUrl;
  constructor(@Inject(DOCUMENT) private document: Document,
  private http: HttpClient) { }

  getAlbum(): Observable<any> {
    return this.http.get(this.songApiUrl + 'albums');
    }
  UpdateAlbum(album, photo): Observable<any> {
    let form = new FormData();
    form.append('imgAlbum', photo);
  //   form.append('songFiles', JSON.stringify(songFiles));
    form.append('albumString', JSON.stringify(album));
    return this.http.put(this.songApiUrl + 'albums/edit/', form);
    }
  deleteAlbum(id): Observable<any> {
    return this.http.delete(this.songApiUrl + 'albums/'+id);
    }
  createAlbum(album): Observable<any> {
    return this.http.post(this.songApiUrl + 'albums', album);
    }

    addSongToAlbum(idSong, idAlbum){
      return this.http.get(this.songApiUrl + 'albums/addSong/'+idAlbum+'/'+idSong);
    }

}
