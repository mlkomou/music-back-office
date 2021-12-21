import { Location } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AlbumService } from 'app/modules/services/album.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';
//import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AddSongsComponent } from '../../musique/add-songs/add-songs.component';

@Component({
  selector: 'app-albumdetail',
  templateUrl: './albumdetail.component.html',
  styleUrls: ['./albumdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AlbumdetailComponent implements OnInit {

    displayedSongColumns = ['img', 'titre', 'artiste', 'like', 'action'];
    songUrl = environment.apiUrl;
    @Input() data;
    @ViewChild('paginatorSong', { static: true }) paginatorSong: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    dataSong;
    dataAlbum;
    songs = new MatTableDataSource<any>();
    constructor(
        private dialogRef: MatDialog,
        private service: ImportSongService,
        private AlbumService: AlbumService,
        private toastr: ToastrService,
        private domSanitizer: DomSanitizer,
        private router: Router,
        private _location: Location
    ) {
        // Set the private defaults
        if(!this.router.getCurrentNavigation()?.extras?.state){
            this._location.back()
        }
        this.data = this.router.getCurrentNavigation().extras.state
        console.log(this.data);
        this.songs.data = this.data.songs
        this.dataSong = this.data.songs

    }
    ngAfterViewInit(): void {
        this.songs.paginator = this.paginatorSong

    }
    ngOnInit(): void {

    }
    getSongs() {
        this.service.getSongs().subscribe((res) => {
            console.log(res);
            this.dataSong = res?.data
            this.songs.data = res?.data;
        });
    }

    addSong(type, song, i): void {
        if (type == 'new') {
            let dialog = this.dialogRef.open(AddSongsComponent, {
                panelClass: 'contact-form-dialog',
                data: {
                    action: 'new'
                },
                height: '80%',
                width: '100vw',
            });
            dialog.afterClosed()
                .subscribe((res) => {
                    if (res)
                {
                    this.dataSong.unshift(res)
                    this.songs.data = this.dataSong;
                    this.toastr.success("La music a été ajouté avec succès")
                    this.AlbumService.addSongToAlbum(res.id, this.data.id).subscribe((res) => {
                        this.toastr.success("Le a été ajouté à l'album")
                    })
                }
                if(res == false){
                    this.toastr.error('Désolé une erreur est survenue.')
                }
                });
        } else {
            let dialog = this.dialogRef.open(AddSongsComponent, {
                panelClass: 'contact-form-dialog',
                data: {
                    action: 'edit',
                    data: song
                },
                height: '80%',
                width: '100vw',
            });
            dialog.afterClosed()
                .subscribe((response) => {
                    if (response) {
                        console.log(this.dataSong);
                        this.dataSong.splice(i, 1, response)
                        this.songs.data = this.dataSong
                        //this.musics = new MatTableDataSource(this.data)
                        this.toastr.success("La music a été modifié avec succès")
                    }
                    if (response == false) {
                        this.toastr.error('Désolé une erreur est survenue.')
                    }
                });
        }


    }

    deleteSong(id, i){
        let dialog = this.dialogRef.open(DeleteConfirmationComponent, {
            panelClass: 'contact-form-dialog',

        });
        dialog.afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.service.deleteSong(id).subscribe(
                        (res) => {
                            this.dataSong.splice(i, 1)
                            this.songs.data = this.dataSong
                            //this.musics = new MatTableDataSource(this.data)
                            this.toastr.success("Music supprimé")
                        }
                    )

                }
                if (response == false) {
                   // this.toastr.error('Désolé une erreur est survenue.')
                }
            });
    }

}
