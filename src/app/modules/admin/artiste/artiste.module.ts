import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtisteComponent } from './artiste.component';
import {Route, RouterModule} from "@angular/router";

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ArtisteComponent
    }
];

@NgModule({
  declarations: [
    ArtisteComponent
  ],
  imports: [
    CommonModule,
      RouterModule.forChild(exampleRoutes)
  ]
})
export class ArtisteModule { }
