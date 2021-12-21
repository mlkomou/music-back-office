import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AlbumService } from 'app/modules/services/album.service';
import { ArtisteService } from 'app/modules/services/artiste.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { environment } from 'environments/environment';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
//import { ContactsContactFormDialogComponent } from '../../contacts/contact-form/contact-form.component';
//import { Contact } from '../../contacts/contact.model';
import { Album } from '../../modal/album';
import { Artisite } from '../../modal/artiste';
import { Song } from '../../modal/song';
import { SongUserId } from '../../modal/songUser';
@Component({
  selector: 'app-add-artiste',
  templateUrl: './add-artiste.component.html',
  styleUrls: ['./add-artiste.component.scss']
})
export class AddArtisteComponent implements OnInit {

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
    action: string;
    contactForm: FormGroup;
    form: FormGroup;
    dialogTitle: string;
    photo;
    imageUrl;
    validatePhoto: boolean = false;
    artiste: Artisite = new Artisite();
    songFile;
    songUrl;
    data;
    constructor(
        public matDialogRef: MatDialogRef<AddArtisteComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private importService: ImportSongService,
        private artisteService : ArtisteService,
        private domSanitizer: DomSanitizer
    ) {
        // Set the defaults
        this.action = _data.action;
        if (this.action === 'edit') {
            this.dialogTitle = 'Modifié';
            this.data = _data.data
            this.form = this.EditArtisteForm();
            this.songAlbum = this.data.songs
        }
        else {
            this.dialogTitle = 'Ajouté';
            this.form = this.createArtisteForm();

        }
    }
    ngOnInit(): void {

    }


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

    save() {

        console.log({
            photo: this.photo,
            songFiles: this.songFiles,
            form: this.form.value,
            songToSave: this.songToSave
        });


        this.artisteService.createArtiste(this.photo, this.form.value).subscribe((res: any) => {
            console.log(res);
            this.matDialogRef.close();

        }, (err) => {
            console.log(err);

        })
    }
    editArtiste(id){
        this.artisteService.UpdateArtiste(this.form, this.photo).subscribe((res) => {
            console.log(res);

        })
    }

    createArtisteForm(): FormGroup {
        return this._formBuilder.group({
            nom: [''],
            photo: [''],
            biographie: [''],

        });
    }

    EditArtisteForm(): FormGroup {
        this.croppedImage = this.apiUrl + 'artiste/image/' + this.data?.img
        return this._formBuilder.group({
            id:[this.data.id],
            nom: [this.data.nom],
            photo: [this.data.img],
            biographie: [this.data.biographie],
        });
    }

}
