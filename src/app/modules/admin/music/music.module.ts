import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Route, RouterModule} from "@angular/router";
import {MusicComponent} from "./music.component";

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: MusicComponent
    }
];

@NgModule({
  declarations: [MusicComponent],
  imports: [
    CommonModule,
      RouterModule.forChild(exampleRoutes)
  ]
})
export class MusicModule { }
