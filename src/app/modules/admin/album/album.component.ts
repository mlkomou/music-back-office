import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AlbumService } from 'app/modules/services/album.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';
//import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import {  Subject } from 'rxjs';
import { AddAlbumComponent } from '../album/add-album/add-album.component';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.scss']
})
export class AlbumComponent implements OnInit {


    dataSource;
    displayedAlbumColumns = ['img', 'titre', 'artiste', 'action'];
    songUrl = environment.apiUrl;

    @ViewChild('paginatorAlbum', { static: true }) paginatorAlbum: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    dataAlbum;
    albums = new MatTableDataSource<any>();
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialog,
        private service: ImportSongService,
        private AlbumService: AlbumService,
        private toastr: ToastrService,
        private router: Router

    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngAfterViewInit(): void {
        this.albums.paginator = this.paginatorAlbum

    }
    ngOnInit(): void {
        this.getAlbums();
    }
    go(data){

        this.router.navigateByUrl('album/detail', { state: data });
    }
    getAlbums() {
        this.AlbumService.getAlbum().subscribe((res) => {
            this.dataAlbum = res?.data
            this.albums.data = res?.data
        })
    }


    addAlbum(type, album, i) {
        if (type == 'new') {
            let dialog = this.dialogRef.open(AddAlbumComponent, {
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
                            this.dataAlbum.unshift(res)
                            this.albums.data = this.dataAlbum;
                            this.toastr.success("La music a été ajouté avec succès")
                        }
                        if(res == false){
                            this.toastr.error('Désolé une erreur est survenue.')
                        }
                });
        } else {
            let dialog = this.dialogRef.open(AddAlbumComponent, {
                panelClass: 'contact-form-dialog',
                data: {
                    action: 'edit',
                    data: album
                },
                height: '80%',
                width: '100vw',
            });
            dialog.afterClosed()
                .subscribe((response) => {
                    if (response) {
                        console.log(response);
                        this.dataAlbum.splice(i, 1, response)
                        this.albums.data = this.dataAlbum
                        //this.musics = new MatTableDataSource(this.data)
                        this.toastr.success("La music a été modifié avec succès")
                    }
                    if (response == false) {
                        this.toastr.error('Désolé une erreur est survenue.')
                    }
                });
        }
    }


    deleteAlbum(id, i){
        let dialog = this.dialogRef.open(DeleteConfirmationComponent, {
            panelClass: 'contact-form-dialog',
            height: '80%',
            width: '100vw',
        });
        dialog.afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.AlbumService.deleteAlbum(id).subscribe(
                        (res) => {
                            this.dataAlbum.splice(i, 1)
                            this.albums.data = this.dataAlbum
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
