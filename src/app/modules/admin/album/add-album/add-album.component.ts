import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AlbumService } from 'app/modules/services/album.service';
import { ArtisteService } from 'app/modules/services/artiste.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { environment } from 'environments/environment';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Album } from '../../modal/album';
import { Artisite } from '../../modal/artiste';
import { Song } from '../../modal/song';
import { SongUserId } from '../../modal/songUser';
import { Utilisateur } from '../../modal/utilisateur';

@Component({
    selector: 'app-add-album',
    templateUrl: './add-album.component.html',
    styleUrls: ['./add-album.component.scss']
})
export class AddAlbumComponent {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    album: Album = new Album();
    categories: any[];
    songAlbum: any[] = [];
    songToSave: any[] = [];
    songFiles: any[] = [];
    currSong: HTMLAudioElement;
    utilisateur = { id: 1 }
    songUser: SongUserId = new SongUserId();
    apiUrl = environment.apiUrl;

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }

    dataURLtoBlob(dataURL) {
        let binary = atob(dataURL.split(',')[1]);
        let array = [];
        for (var index = 0; index < binary.length; index++) {
            array.push(binary.charCodeAt(index));
        }
        return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
    }

    imageBlob;
    imageFile;
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.imageBlob = this.dataURLtoBlob(event.base64);
        this.imageFile = this.blobToFile(this.imageBlob, String(new Date().getTime()));
    }

    public blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        b.lastModifiedDate = new Date();
        b.name = fileName;
        return <File>theBlob;
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }

    action: string;
    contactForm: FormGroup;
    albumForm: FormGroup;
    dialogTitle: string;
    photo;
    imageUrl;
    validatePhoto: boolean = true;
    artiste: Artisite = new Artisite();
    songFile;
    songUrl;
    data;
    myControl = new FormControl();
    filteredOptions: Observable<any>;
    artistes;

    constructor(
        public matDialogRef: MatDialogRef<AddAlbumComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private importService: ImportSongService,
        private albumService : AlbumService,
        private toastr : ToastrService,
        private artisteService : ArtisteService,
        private domSanitizer: DomSanitizer
    ) {
        this.stopMultiplePlay();
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifié';
            this.data = _data.data
            this.albumForm = this.EditAlbumForm();
            this.songAlbum = this.data.songs
        }
        else {
            this.dialogTitle = 'Ajouté';
            this.albumForm = this.createAlbumForm();

        }

        this.getCategorie();
        this.getArtiste();
    }

    stopMultiplePlay() {
        document.addEventListener('play', function (e) {
            var audios = document.getElementsByTagName('audio');
            for (var i = 0, len = audios.length; i < len; i++) {
                if (audios[i] != e.target) {
                    audios[i].pause();
                }
            }
        }, true);
    }
    getArtiste(){
        this.artisteService.getArtiste().subscribe((res) => {
            this.artistes = res?.data
            this.filteredOptions = this.myControl.valueChanges
            .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.name),
            map(name => name ? this._filter(name) : this.artistes.slice()))
            })
    }

    getCategorie() {
        this.importService.getCategorie().subscribe((res) => {
            this.categories = res.response;
        });
    }
    validePhoto() {
        this.validatePhoto = true;
    }

    importPhoto() {
        this.validatePhoto = false;
        this.photo = null;
        this.importService.promptForPhoto().then((photo) => {
            this.photo = photo;
            var reader = new FileReader();
            reader.readAsDataURL(photo);
            console.log(photo);
            reader.onload = (event) => {
                this.imageUrl = (<FileReader>event.target).result;
            }
        });
    }
    importSong() {
        this.songFile = null;
        this.importService.promptForAlbum().then((album: FileList) => {
            this.songFile = album;
            console.log("album", album);

            this.getCurrentSong(album);
        });
    }

    getCurrentSong(data: FileList) {
        for (let i = 0; i < data.length; i++) {
            this.songUrl = URL.createObjectURL(data.item(i));
            this.songAlbum.push({
                songUrl: this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data.item(i))),
                titre: data.item(i).name
            });
            this.songToSave.push({
                titre: data.item(i).name,
                sous_titre: data.item(i).name,
                img: "",
                path: data.item(i).name,
                visibilite: true,
                categorie: null,
                commentaires: null,
                detail: null
            });
            this.songFiles.push(data.item(i));
        }
        console.log("song array", this.songAlbum);

    }

    removeFromList(index) {
        this.songAlbum.splice(index, 1);
    }

    private _filter(value) {
        const filterValue = value.toLowerCase();
        return this.artistes.filter(option => option.nom.toLowerCase().includes(filterValue));
      }

    displayFn(artiste): string {
        return artiste && artiste.nom ? artiste.nom : '';
    }

    saveAlbum() {

        console.log({
            photo: this.photo,
            songFiles: this.songFiles,
            albumForm: this.albumForm.value,
            songToSave: this.songToSave
        });

        if(typeof(this.myControl.value) === 'object' && this.myControl.value != null){
            console.log(this.myControl.value);

            this.albumForm.patchValue({artiste : this.myControl.value})
          }

          if (typeof(this.myControl.value)==='string') {
            this.toastr.warning("Si l'artiste n'existe pas dans la liste créer le d'abord")
            return
          }
        this.importService.saveAlbum(this.photo, this.albumForm.value).subscribe((res: any) => {
            console.log(res);
            this.matDialogRef.close(res?.response);

        }, (err) => {
            console.log(err);

        })
    }
    editAlbum(){
        if(typeof(this.myControl.value) === 'object' && this.myControl.value != null){
            this.albumForm.patchValue({artiste : this.myControl.value})
          }

          if (typeof(this.myControl.value)==='string') {
            this.toastr.warning("Si l'artiste n'existe pas dans la liste créer le d'abord")
            return
          }
        this.albumService.UpdateAlbum(this.albumForm, this.photo).subscribe((res) => {
            this.matDialogRef.close(res?.response);
        })
    }

    createAlbumForm(): FormGroup {

        return this._formBuilder.group({
            nom: [''],
            img: [''],
            description: [''],
            visibilite: true,
            artiste: [''],
            utilisateur: this.utilisateur,
        });
    }
    EditAlbumForm(): FormGroup {
        this.croppedImage = this.apiUrl + 'songs/image/' + this.data?.img
        this.myControl.patchValue(this.data.artiste)

        return this._formBuilder.group({
            id:[this.data.id],
            nom: [this.data.nom],
            img: [this.data.img],
            description: [this.data.description],
            visibilite: true,
            artiste: [this.data.artiste],
            utilisateur: this.utilisateur,
        });
    }

    getCatValue(ev) {
        console.log(ev);
        this.albumForm.value.categorie = ev.value;
    }
    radioChange(ev) {
        console.log(ev);
        this.albumForm.value.visibilite = ev.value;
    }
}
