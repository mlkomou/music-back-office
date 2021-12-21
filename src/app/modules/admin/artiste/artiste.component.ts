import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AlbumService } from 'app/modules/services/album.service';
import { ArtisteService } from 'app/modules/services/artiste.service';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';
//import { FuseUtils } from '@fuse/utils';
import { environment } from 'environments/environment';
import { ToastrService } from 'ngx-toastr';
import { AddArtisteComponent } from './add-artiste/add-artiste.component';

@Component({
  selector: 'app-artiste',
  templateUrl: './artiste.component.html',
  styleUrls: ['./artiste.component.scss']
})
export class ArtisteComponent implements OnInit {


    displayedColumns = ['img', 'nom', 'biographie', 'action'];
    apiUrl = environment.apiUrl;

    @ViewChild('paginator', { static: true }) paginatorSong: MatPaginator;

    @ViewChild(MatSort, { static: true })
    sort: MatSort;

    @ViewChild('filter', { static: true })
    filter: ElementRef;
    dataArtiste;
    artiste = new MatTableDataSource<any>();
    constructor(private artisteService: ArtisteService,
        private dialogRef: MatDialog,
        private toastr: ToastrService) { }

    ngOnInit(): void {
        this.getArtiste()
    }

    getArtiste(){
        this.artisteService.getArtiste().subscribe((res) => {
            this.dataArtiste = res?.data
            this.artiste.data = res?.data
        })
    }

    add(type, song, i): void {
        if (type == 'new') {
            let dialog = this.dialogRef.open(AddArtisteComponent, {
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
                    this.dataArtiste.unshift(res)
                    this.artiste.data = this.dataArtiste;
                    this.toastr.success("Artiste ajouté")
                }
                if(res == false){
                    this.toastr.error('Désolé une erreur est survenue.')
                }
                });
        } else {
            let dialog = this.dialogRef.open(AddArtisteComponent, {
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
                        this.dataArtiste.splice(i, 1, response)
                        this.artiste.data = this.dataArtiste
                        //this.musics = new MatTableDataSource(this.data)
                        this.toastr.success("Artiste modifié")
                    }
                    if (response == false) {
                        this.toastr.error('Désolé une erreur est survenue.')
                    }
                });
        }


    }

    delete(id, i){
        let dialog = this.dialogRef.open(DeleteConfirmationComponent, {
            panelClass: 'contact-form-dialog',
            height: '80%',
            width: '100vw',
        });
        dialog.afterClosed()
            .subscribe((response) => {
                if (response) {
                    this.artisteService.deleteArtiste(id).subscribe(
                        (res) => {
                            this.dataArtiste.splice(i, 1)
                            this.artiste.data = this.dataArtiste
                            //this.musics = new MatTableDataSource(this.data)
                            this.toastr.success("Artiste supprimé")
                        }
                    )

                }
                if (response == false) {
                   this.toastr.error('Désolé une erreur est survenue.')
                }
            });
    }

}
