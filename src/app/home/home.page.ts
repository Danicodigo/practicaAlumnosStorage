import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ApiServiceProvider } from 'src/providers/api-service/api-service';
import { EditaAlumnoPage } from '../edita-alumno/edita-alumno.page';
import { Alumno } from '../modelo/Alumno';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private alumnos = new Array<Alumno>();


  constructor(private apiService: ApiServiceProvider,
    public alertController: AlertController, public modalController: ModalController,
     public toastController: ToastController) {
  }


  /*
  
  cuando se carga la pantalla se llama al método getAlumnos de la Api. Este es un método asíncrono que devuelve un objeto Promise del que debe ser evaluado el resultado.
  
  Si el acceso a la Api ha ido bien se ejecuta el código asociado a la cláusula then.  Símplemente se coge el array de alumnos que llega y se asocia a él el atributo alumnos de la clase.
  
  Si ha ido mal el acceso (por ejemplo si no hemos lanzado jsonServer) se coge el error que llega y se muestra por consola.
  
  */


  ngOnInit(): void {
    this.apiService.getAlumnos().subscribe((resultadoConsultaAlumnos) => {

      this.alumnos = new Array<Alumno>();

      resultadoConsultaAlumnos.forEach((datosTarea: any) => {

        let alumnoJsonObject=datosTarea.payload.doc.data();

        alumnoJsonObject.id=datosTarea.payload.doc.id,

        this.alumnos.push(

          Alumno.createFromJsonObject(alumnoJsonObject)

        );

      });

    });
  }



  /*
  
  este método llama al método eliminarAlumno de la Api y le pasa el id del alumno a eliminar. Se devuelve un objeto Promise. Si el borrado ha ido bien se ejecuta el código asociado a la cláusula then. Símplemente se muestra por consola un mensaje y se elimina el alumno del array de alumnos de la clase, lo que hará que deje de verse en la vista.
  
  Si el borrado ha ido mal muestro por consola el error que ha ocurrido.
  
  */

  eliminarAlumno(indice:number){

    var urlAvatar=this.alumnos[indice].avatar;

    this.apiService.eliminarAlumno(this.alumnos[indice].id)

    .then( () => {

      //los datos del alumno se han eliminado correctamente de cloud firestore

      //elimino la imagen de avatar del storage de firebase

      this.apiService.removeImage(urlAvatar);

      //this.alumnos.splice(indice,1);  No hace falta quitarlo del array. Se recarga todo el array de forma automática

    })

    .catch( (error:string) => {

        this.presentToast("Error al borrar: "+error);

    });
//end_eliminar_alumno
  }//end_eliminar_alumno
  /*
  async modificarAlumno(indice:number) {
    let alumno=this.alumnos[indice];
    const alert = await this.alertController.create({
      header: 'Modificar',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          value: alumno.first_name,
          placeholder: 'first_name'
        },
        {
          name: 'last_name',
          type: 'text',
          id: 'last_name',
          value: alumno.last_name,
          placeholder: 'last_name'
        },
        {
          name: 'email',
          id: 'email',
          type: 'text',
          value: alumno.email,
          placeholder: 'email'
        },
        {
          name: 'gender',
          id: 'gender',
          type: 'text',
          value: alumno.gender,
          placeholder: 'gender'
        },
        {
          name: 'avatar',
          value: alumno.avatar,
          type: 'url',
          placeholder: 'avatar'
        },
        {
          name: 'address',
          value: alumno.address,
          type: 'text',
          placeholder: 'address'
        },
        {
          name: 'city',
          value: alumno.city,
          type: 'text',
          placeholder: 'city'
        },
        {
          name: 'postalcode',
          value: alumno.postalCode,
          type: 'text',
          placeholder: 'Codigo postal'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log(data);
            var alumnoModificado:Alumno=new Alumno(alumno.id,
              data['first_name'],
              data['last_name'],
              data['email'],
              data['gender'],
              data['avatar'],
              data['address'],
              data['city'],
              data['postalCode']);
            this.apiService.modificarAlumno(alumno.id,alumnoModificado)
              .then( (alumno:Alumno)=> {
                this.alumnos[indice]=alumno;
              })
              .catch( (error:string) => {
                  console.log(error);
              });
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }//end_modificarAlumno
  */
  async modificarAlumno(indice: number) {
    const modal = await this.modalController.create({
      component: EditaAlumnoPage,
      componentProps: {
        'alumnoJson': JSON.stringify(this.alumnos[indice])
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data['data'] != null) {
        let alumnoJSON = JSON.parse(data['data']);
        let alumnoModificado: Alumno = Alumno.createFromJsonObject(alumnoJSON);
        this.apiService.modificarAlumno(alumnoModificado.id, alumnoModificado)  //se hace PUT a la API
          //.then(() => {
           // this.alumnos[indice] = alumno;  //si se ha modificado en la api se actualiza en la lista
          //})
          .catch((error: string) => {
            console.log(error);
          });
      }
    });

    return await modal.present();
  }
  async nuevoAlumno() {

    const modal = await this.modalController.create({

      component: EditaAlumnoPage,

      componentProps: {

        'alumnoJson': JSON.stringify(new Alumno(-1,

          "", "", "", "", "", "", "", ""))

      }

    });

    modal.onDidDismiss().then((data) => {

      if (data['data'] != null) {

        let alumnoJSON = JSON.parse(data['data']);

        let alumnoNuevo: Alumno = Alumno.createFromJsonObject(alumnoJSON);

        this.apiService.insertarAlumno(alumnoNuevo)  //se hace POST a la API

          //.then((alumno: Alumno) => {

            //this.alumnos.push(alumno);  //si se ha insertado en la api se añade en la lista

          //})

          .catch((error: string) => {

            this.presentToast("Error al insertar: " + error);

          });

      }

    });

    return await modal.present();

  }
  async presentToast(message: string) {

    const toast = await this.toastController.create({

      message: message,

      duration: 2000

    });

    toast.present();

  }
}//end_class
