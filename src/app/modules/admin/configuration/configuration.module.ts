import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigurationComponent } from './configuration.component';
import {Route, RouterModule} from "@angular/router";

const exampleRoutes: Route[] = [
    {
        path     : '',
        component: ConfigurationComponent
    }
];

@NgModule({
  declarations: [
    ConfigurationComponent
  ],
  imports: [
    CommonModule,
      RouterModule.forChild(exampleRoutes)
  ]
})
export class ConfigurationModule { }
