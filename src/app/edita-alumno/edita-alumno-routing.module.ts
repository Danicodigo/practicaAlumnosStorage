import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditaAlumnoPage } from './edita-alumno.page';

const routes: Routes = [
  {
    path: '',
    component: EditaAlumnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditaAlumnoPageRoutingModule {}
