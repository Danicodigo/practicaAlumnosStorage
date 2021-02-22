import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { FirebaseAuthService } from 'src/providers/firebase-auth.service';
import { User } from '../modelo/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validations_form: FormGroup;
  user:User;
  constructor(public formBuilder: FormBuilder, public firebaseAuthService: FirebaseAuthService, private navCtrl: NavController) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      password: new FormControl("", Validators.compose([
        Validators.maxLength(6),
        Validators.required
      ])),
      email: new FormControl("", Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+[@]{1}[a-zA-Z0-9-]+[.]{1}[a-zA-Z]+$'),
        Validators.required
      ])),
    });
  }
  onSubmit(values) {
    this.firebaseAuthService.loginUser(values.email, values.password)

      .then((data) => {
        this.navCtrl.navigateForward('home');
        console.log("login correcto");

      })

      .catch((error) => {

        console.log("Error en el login: " + error['message']);

      });
  }

}
