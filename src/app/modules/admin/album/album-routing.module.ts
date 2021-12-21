import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumdetailComponent } from './album-detail/albumdetail.component';
import { AlbumComponent } from './album.component';

const routes: Routes = [
    {
    path : '',
    component : AlbumComponent
    },{
        path:'detail',
        component: AlbumdetailComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
