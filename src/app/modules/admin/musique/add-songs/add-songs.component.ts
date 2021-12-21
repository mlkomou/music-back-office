import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { environment } from 'environments/environment';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { Artisite } from '../../modal/artiste';
import { Song } from '../../modal/song';
import { SongUserId } from '../../modal/songUser';
import { Utilisateur } from '../../modal/utilisateur';

@Component({
  selector: 'app-add-songs',
  templateUrl: './add-songs.component.html',
  styleUrls: ['./add-songs.component.scss']
})
export class AddSongsComponent {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    song: Song = new Song();
    categories: any[];
    currSong: HTMLAudioElement;
    apiUrl = environment.apiUrl;
    utilisateur: Utilisateur = {
        id:1,
        date_creation:new Date("2021-07-21 22:40:14.087000"),
        date_modification:new Date("2021-07-21 22:40:14.087000"),
        supprime:false,
        mot_de_passe:"77114120",
        telephone:"77114120",
        artiste:null,
        fan: {
            id:1, nom: "Mamadou Koné",
            photo: "1627119131414teacher1.png",
            date_creation: new Date("2021-07-24 09:25:00.324000"),
            date_modification: new Date("2021-07-24 09:25:00.324000"),
            supprime: false
        }
    }
    songUser: SongUserId = new SongUserId();
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
    public blobToFile = (theBlob: Blob, fileName:string): File => {
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
    artisteForm: FormGroup;
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
        public matDialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private importService: ImportSongService,
        private domSanitizer: DomSanitizer
    )
    {
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Modifié';
            this.data = _data.data
            this.artisteForm = this.createArtisteEditForm();

        }
        else
        {
            this.artisteForm = this.createArtisteForm();
            this.dialogTitle = 'Ajouté';
        }

        this.getCategorie();
    }

    getCategorie() {
        this.importService.getCategorie().subscribe((res) => {
            console.log(res);
            this.categories = res.data;
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
        this.importService.promptForPhoto().then((song) => {
          this.songFile = song;
          this.getCurrentSong(song);
        });
      }

      getCurrentSong(data) {
        setTimeout(() => {
          console.log(data);
          this.songUrl = this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data));
          setTimeout(() => {
              this.songUrl = URL.createObjectURL(data);
            this.currSong = new Audio(URL.createObjectURL(data));
            console.log(this.currSong);
          }, 500);
        }, 500);
      }


      saveArtiste() {

          this.songUser.utilisateur = this.utilisateur;
          this.importService.pblishSong(this.artisteForm.value, this.utilisateur, this.songFile, this.photo).subscribe((res: any) => {
            if (res.type === HttpEventType.Response) {

               if(res.body.code == 100) {
                   this.matDialogRef.close(res.body.response);
               }
            }
          })
      }
      editSong(){
        //if(this.photo){
          this.importService.editSong(this.artisteForm.value, this.imageFile).subscribe((res: any) => {
            if (res.type === HttpEventType.Response) {
              console.log(res);
              this.matDialogRef.close(res?.body.response);
            }
          },
          (error)=>{
            this.matDialogRef.close(false)
          })

      }

    createArtisteForm(): FormGroup
    {
        return this._formBuilder.group({
            titre: [''],
            sous_titre: [''],
            img: [''],
            path: [''],
            visibilite: true,
            categorie: [''],
            artiste: [''],
            album: null
        });
    }
    createArtisteEditForm(): FormGroup
    {
        this.croppedImage = this.apiUrl + 'songs/image/' + this.data?.img
        this.songUrl = this.apiUrl + 'songs/path/' + this.data?.path
        return this._formBuilder.group({
            id:[this.data.id],
            titre: [this.data.titre],
            sous_titre: [this.data.sous_titre],
            img: [this.data.img],
            path: [this.data.path],
            visibilite: this.data.visibilite,
            categorie: [this.data.categorie],
            artiste: [this.data.artiste],
            album: null
        });
    }

    getCatValue(ev) {
        console.log(ev);
        this.artisteForm.value.categorie = ev.value;
    }
    radioChange(ev) {
        console.log(ev);
        this.artisteForm.value.visibilte = ev.value;
    }
}
