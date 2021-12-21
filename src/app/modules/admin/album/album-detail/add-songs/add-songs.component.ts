import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ArtisteService } from 'app/modules/services/artiste.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { environment } from 'environments/environment';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';



@Component({
    selector: 'app-add-songs',
    templateUrl: './add-songs.component.html',
    styleUrls: ['./add-songs.component.scss']
})
export class AddSongsComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    song;
    categories: any[];
    currSong: HTMLAudioElement;
    apiUrl = environment.apiUrl;
    utilisateur = { id: 1 }
    songUser;
    myControl = new FormControl();
    filteredOptions: Observable<any>;
    action: string;
    contactForm: FormGroup;
    artisteForm: FormGroup;
    dialogTitle: string;
    photo;
    imageUrl;
    validatePhoto: boolean = true;
    artiste;
    artistes;
    songFile;
    songUrl;
    data;
    imageBlob;
    imageFile;
    artisteId: any;

    constructor(
        public matDialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private importService: ImportSongService,
        private artisteService: ArtisteService,
        private domSanitizer: DomSanitizer,
        private toastr: ToastrService
    ) {
        this.action = _data.action;

        if (this.action === 'edit') {
            this.dialogTitle = 'Modifié';
            this.data = _data.data
            this.artisteForm = this.createArtisteEditForm();

        }
        else {
            this.data = _data.data
            this.artisteForm = this.createArtisteForm();
            this.dialogTitle = 'Ajouté';
        }

        this.getCategorie();
    }
    ngOnInit(): void {
        this.getArtiste()
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



    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
        this.imageBlob = this.dataURLtoBlob(event.base64);
        console.log("image blob", this.imageBlob);
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
    private _filter(value) {
        const filterValue = value.toLowerCase();
        return this.artistes.filter(option => option.nom.toLowerCase().includes(filterValue));
      }

    displayFn(artiste): string {
        return artiste && artiste.nom ? artiste.nom : '';
    }

    saveSong() {

        this.importService.publishSong(this.artisteForm.value, this.artisteId, this.songFile, this.photo).subscribe((res: any) => {
            if (res.type === HttpEventType.Response) {

                if (res.body.code == 100) {
                    this.matDialogRef.close(res.body.response);
                }
            }
        })
    }

    editSong() {

        this.importService.editSong(this.artisteForm.value, this.imageFile).subscribe((res: any) => {
            if (res.type === HttpEventType.Response) {
                console.log(res);
                this.matDialogRef.close(res?.body.response);
            }
        },
            (error) => {
                this.matDialogRef.close(false)
            })

    }

    createArtisteForm(): FormGroup {
        return this._formBuilder.group({
            titre: [''],
            sous_titre: [''],
            img: [this.data.img],
            path: [''],
            visibilite: this.data.visibilite,
            categorie: [''],
            artiste: [this.data.artiste],
        });
    }
    createArtisteEditForm(): FormGroup {
        this.croppedImage = this.apiUrl + 'songs/image/' + this.data?.img
        this.songUrl = this.apiUrl + 'songs/path/' + this.data?.path
        this.myControl.patchValue(this.data.artiste)
        return this._formBuilder.group({
            id: [this.data.id],
            titre: [this.data.titre],
            sous_titre: [this.data.sous_titre],
            img: [this.data.img],
            path: [this.data.path],
            visibilite: this.data.visibilite,
            categorie: [this.data.categorie],
            artiste: [this.data.artiste.nom],
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
