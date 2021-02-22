import {Injectable} from '@angular/core';


import { Observable } from 'rxjs';

import { AngularFirestore } from '@angular/fire/firestore';
import { Alumno } from 'src/app/modelo/Alumno';
import { AngularFireStorage } from '@angular/fire/storage';






@Injectable()

export class ApiServiceProvider {

    

  constructor(private angularFirestore: AngularFirestore,
    private afStorage: AngularFireStorage){
}

    getAlumnos():Observable<any> {

      //al llamar al método snapshotChanges se nos devuelve un observable
   
       //si nos subscribimos al observable nos saltará el evento cuando halla algún cambio en los 
   
       //datos que produce el observable
   
       return this.angularFirestore.collection("alumnos").snapshotChanges();
   
   }
   
   
   
   eliminarAlumno(id:number):Promise<void>{
   
       return this.angularFirestore.collection("alumnos").doc(""+id).delete();
   
   }//end_eliminar_alumno
   
   
   
   modificarAlumno(idAlumno:number, nuevosDatosAlumno:Alumno):Promise<void>{
   
       let nuevosDatosAlumnoJson=nuevosDatosAlumno.getJsonObject();
   
       delete nuevosDatosAlumno.id;
   
       return this.angularFirestore.collection("alumnos").doc(""+idAlumno).set(nuevosDatosAlumnoJson);
   
   }//end_modificarAlumno
   
   
   
   insertarAlumno(datosNuevoAlumno:Alumno):Promise<any>{
   
       let alumnoJson=datosNuevoAlumno.getJsonObject();
   
       delete alumnoJson.id;
   
       return this.angularFirestore.collection("alumnos").add(alumnoJson);
   
   }//end_insertarAlumno
   
   uploadImage(file: File, name:string):Promise<string> {

    var promise:Promise<string> = new Promise<string>( (resolve, reject)=>{
  
      //Se comprueba que el tipo del fichero pertenece a un tipo imagen
  
      if (file.type.split('/')[0] !== 'image') { 
  
        console.log('File type is not supported!')
  
        reject("El fichero no es de tipo imagen");
  
      }
  
      //se calcula el path dentro del storage de firebase
  
      //se guarda dentro de una carpeta avatar
  
      //el nombre del fichero es igual al id del alumno precedido de la hora dada por getTime 
  
      const fileStoragePath = `avatar/${name}`;
  
  
  
      // Image reference
  
      const imageRef = this.afStorage.ref(fileStoragePath);
  
  
  
      // File upload task
  
      this.afStorage.upload(fileStoragePath, file)
  
      .then((data)=>{
  
        imageRef.getDownloadURL().subscribe(resp=>{
  
            resolve(resp);
  
        });
  
      })
  
      .catch((error)=>{
  
            reject(error);
  
      });
  
    });
  
    return(promise);  
  
  }//end_uploadImage
  
  
  
  removeImage(imageUrl:string):Promise<string> {
  
    var promise:Promise<string> = new Promise<string>( (resolve, reject)=>{
  
      var imageRef = this.afStorage.refFromURL(imageUrl);
  
      imageRef.delete().subscribe(resp=>{
  
        resolve;
  
      },
  
      error => {
  
        reject(error);
  
      });
  
    });
  
    return(promise);  
  
  
  }//end_uploadImage
   
   }