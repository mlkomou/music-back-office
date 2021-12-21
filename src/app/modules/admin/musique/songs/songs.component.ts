import { DataSource } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AlbumService } from 'app/modules/services/album.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';
//import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Song } from '../../modal/song';
//import { AddAlbumComponent } from '../../album/add-album/add-album.component';
import { AddSongsComponent } from '../add-songs/add-songs.component';

@Component({
    selector: 'e-commerce-products',
    templateUrl: './songs.component.html',
    styleUrls: ['./songs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SongsComponent implements OnInit, AfterViewInit {

    dataSource;
    displayedSongColumns = ['img', 'titre', 'artiste', 'prix', 'categorie', 'like', 'action'];
    songUrl = environment.apiUrl;

    @ViewChild('paginatorSong', { static: true }) paginatorSong: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    dataSong;
    dataAlbum;
    songs = new MatTableDataSource<any>();
    albums = new MatTableDataSource<any>();
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialog,
        private service: ImportSongService,
        private AlbumService: AlbumService,
        private toastr: ToastrService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngAfterViewInit(): void {
        this.songs.paginator = this.paginatorSong

    }
    ngOnInit(): void {
        this.getSongs();
    }
    getSongs() {
        this.service.getSongs().subscribe((res) => {
            console.log(res);
            this.dataSong = res?.data
            this.songs.data = res?.data;
        });
    }
    getAlbums() {
        this.AlbumService.getAlbum().subscribe((res) => {
            this.dataAlbum = res?.data
            this.albums.data = res?.data
        })
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
            height: '80%',
            width: '100vw',
        });
        dialog.afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.service.deleteSong(id).subscribe(
                        (res) => {
                            this.dataSong.splice(i, 1)
                            this.songs.data = this.dataSong
                            //this.musics = new MatTableDataSource(this.data)
                            this.toastr.success("La music a été modifié avec succès")
                        }
                    )

                }
                if (response == false) {
                   // this.toastr.error('Désolé une erreur est survenue.')
                }
            });
    }







}






