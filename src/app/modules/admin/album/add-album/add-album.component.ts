import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AlbumService } from 'app/modules/services/album.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { environment } from 'environments/environment';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
//import { ContactsContactFormDialogComponent } from '../../contacts/contact-form/contact-form.component';
//import { Contact } from '../../contacts/contact.model';
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
        console.log("image blob", this.imageBlob);
        this.imageFile = this.blobToFile(this.imageBlob, String(new Date().getTime()));

    }
    public blobToFile = (theBlob: Blob, fileName: string): File => {
        var b: any = theBlob;
        console.log("blllllob", b);

        //A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;
        //Cast to a File() type
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
    validatePhoto: boolean = false;
    artiste: Artisite = new Artisite();
    songFile;
    songUrl;
    data;

    /**
     * Constructor
     *
     * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<AddAlbumComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private importService: ImportSongService,
        private albumService : AlbumService,
        private domSanitizer: DomSanitizer
    ) {
        this.stopMultiplePlay();
        // Set the defaults
        this.action = _data.action;
        console.log(_data.data);

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

    saveAlbum() {

        console.log({
            photo: this.photo,
            songFiles: this.songFiles,
            albumForm: this.albumForm.value,
            songToSave: this.songToSave
        });


        this.importService.saveAlbum(this.photo, this.songFiles, this.albumForm.value, this.songToSave).subscribe((res: any) => {
            console.log(res);
            this.matDialogRef.close();

        }, (err) => {
            console.log(err);

        })
    }
    editAlbum(id){
        this.albumService.UpdateAlbum(this.albumForm, this.photo).subscribe((res) => {
            console.log(res);

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
