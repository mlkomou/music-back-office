import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusiqueOrderComponent } from './musique-order/musique-order.component';
import { MusiqueOrdersComponent } from './musique-orders/musique-orders.component';
import { SongComponent } from './song/song.component';
import { SongsComponent } from './songs/songs.component';

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

import { AddSongsComponent } from './add-songs/add-songs.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatRadioModule } from '@angular/material/radio';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AlbumService } from 'app/modules/services/album.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { DeleteConfirmationComponent } from 'app/modules/widgets/delete-confirmation/delete-confirmation.component';

const routes: Routes = [
    {
        path     : '',
        component: SongsComponent,

    },
    {
        path     : 'add-song',
        component: AddSongsComponent,

    },
    {
        path     : 'products/:id',
        component: SongComponent,

    },
    {
        path     : 'products/:id/:handle',
        component: SongComponent,

    },
    {
        path     : 'orders',
        component: MusiqueOrderComponent,

    },
    {
        path     : 'orders/:id',
        component: MusiqueOrderComponent,

    }
];

@NgModule({
  declarations: [
    MusiqueOrdersComponent,
    SongComponent,
    SongsComponent,
    AddSongsComponent,
    DeleteConfirmationComponent
    ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
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
    MatMenuModule,
    MatDialogModule

  ],
  providers   : [
    ImportSongService, AlbumService, ToastrService
]
})
export class MusiqueModule { }
