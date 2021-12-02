import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthentictionComponent} from "./authentiction/authentiction.component"

const routes: Routes = [

  {path : 'login', component : AuthentictionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
