import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtisteComponent } from './artiste.component';
import {Route, RouterModule} from "@angular/router";
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { ImageCropperModule } from 'ngx-image-cropper';
import { MatRadioModule } from '@angular/material/radio';
import { ImportSongService } from 'app/modules/services/import-song.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ArtisteService } from 'app/modules/services/artiste.service';
import { AddArtisteComponent } from './add-artiste/add-artiste.component';

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ArtisteComponent
    }
];

@NgModule({
  declarations: [
    ArtisteComponent,
    AddArtisteComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(exampleRoutes),
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
  providers:[
    ToastrService, ArtisteService
  ]
})
export class ArtisteModule { }
