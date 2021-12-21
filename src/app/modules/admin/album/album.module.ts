import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlbumRoutingModule } from './album-routing.module';

//import { AgmCoreModule } from '@agm/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { Routes, RouterModule } from '@angular/router';
//import { FuseConfirmDialogModule, FuseSidebarModule, FuseWidgetModule } from '@fuse/components';
//import { FuseSharedModule } from '@fuse/shared.module';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatRadioModule } from '@angular/material/radio';
import { AddAlbumComponent } from '../album/add-album/add-album.component';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AlbumService } from 'app/modules/services/album.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';
import { AlbumComponent } from './album.component';
import { AlbumdetailComponent } from './album-detail/albumdetail.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddSongsComponent } from './album-detail/add-songs/add-songs.component';

@NgModule({
  declarations: [AddAlbumComponent, AlbumComponent, AlbumdetailComponent, AddSongsComponent],
  imports: [
    CommonModule,
    AlbumRoutingModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatRippleModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatRadioModule,
    ImageCropperModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatMenuModule
  ],
  providers : [AlbumService, ToastrService, ImportSongService]
})
export class AlbumModule { }
