import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditaAlumnoPageRoutingModule } from './edita-alumno-routing.module';

import { EditaAlumnoPage } from './edita-alumno.page';


@NgModule({

  imports: [

    CommonModule,
    FormsModule,
    IonicModule,
    EditaAlumnoPageRoutingModule,
    ReactiveFormsModule

  ],

  declarations: [EditaAlumnoPage]

})



export class EditaAlumnoPageModule {}
