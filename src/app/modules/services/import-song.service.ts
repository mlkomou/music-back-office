import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Utilisateur } from '../admin/modal/utilisateur';
import { Album } from '../admin//modal/album';
import { Song } from '../admin/modal/song';
import { SongUserId } from '../admin/modal/songUser';


@Injectable({
  providedIn: 'root'
})
export class ImportSongService {
    songApiUrl = environment.apiUrl;
  constructor(@Inject(DOCUMENT) private document: Document,
  private http: HttpClient) { }


  public promptForMusic(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const fileInput: HTMLInputElement = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'audio/*';
      fileInput.addEventListener('error', event => {
        reject(event.error);
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files[0]);
     });
      fileInput.click();
    });
  }

  public promptForPhoto(): Promise<File> {
    return new Promise<File>((resolve, reject) => {
      const fileInput: HTMLInputElement = this.document.createElement('input');
      fileInput.type = 'file';
    //   fileInput.accept = 'image/*';
      fileInput.addEventListener('error', event => {
        reject(event.error);
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files[0]);
     });
      fileInput.click();
    });
  }
  public promptForAlbum(): Promise<FileList> {
    return new Promise<FileList>((resolve, reject) => {
      const fileInput: HTMLInputElement = this.document.createElement('input');
      fileInput.type = 'file';
      fileInput.multiple = true;
    //   fileInput.accept = 'image/*';
      fileInput.addEventListener('error', event => {
        reject(event.error);
      });
      fileInput.addEventListener('change', event => {
        resolve(fileInput.files);
     });
      fileInput.click();
    });
  }

  saveArtiste(photo, artiste): Observable<any> {
      let form = new FormData();
      form.append('photo', photo);
      form.append('artiste', JSON.stringify(artiste));
      return this.http.post(this.songApiUrl + 'artistes/create', form);
  }

  pblishSong(song: Song, utilisateur: Utilisateur, songFile, photo): Observable<HttpEvent<any>> {
    let form = new FormData();
    form.append('song', JSON.stringify(song));
    form.append('user', JSON.stringify(utilisateur));
    form.append('photo', photo);
    form.append('songFile', songFile);

    const req = new HttpRequest('POST', this.songApiUrl + "songs/create", form, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
  editSong(song, photo): Observable<HttpEvent<any>> {
    let form = new FormData();
    form.append('song', JSON.stringify(song));
    form.append('photo', photo);

    const req = new HttpRequest('POST', this.songApiUrl + "songs/edit", form, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  deleteSong(id){
    return this.http.delete(this.songApiUrl + 'songs/' + id);
  }
  getArtiste(): Observable<any> {
      return this.http.get(this.songApiUrl + 'artistes/liste');
  }
  getSongs(): Observable<any> {
      return this.http.get(this.songApiUrl + 'songs');
  }

  getCategorie(): Observable<any> {
    return this.http.get(this.songApiUrl + 'categorie');
  }

  saveAlbum(imgAlbum, songFiles: File[], albumString: Album, songString: Song[]): Observable<any> {
      let form = new FormData();
      form.append('imgAlbum', imgAlbum);
      songFiles.forEach(fileToSave => {
          form.append('songFiles', fileToSave);
      });
    //   form.append('songFiles', JSON.stringify(songFiles));
      form.append('albumString', JSON.stringify(albumString));
      form.append('songString', JSON.stringify(songString));
      return this.http.post(this.songApiUrl + 'albums/create', form);
  }

  testUpload(image): Observable<any> {
    let form = new FormData();
    form.append('imagebase64', image);
      return this.http.post(this.songApiUrl + "test/upload", form);
  }
}
