import { Component } from '@angular/core';
import { NgModule } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import { Auth } from '../../providers/auth';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map'


/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',

})
export class LoginPage {
  authType: string = "login";
  LOGIN_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/api/login/";
  SIGNUP_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/registration/";
  user: string;
  date: any;
  jwtHelper: JwtHelper = new JwtHelper();
  username: string;
  password: string;
  password2: string;
  email: string;
  auth: Auth;
  error: any;

  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

  constructor(public navCtrl: NavController, private http: Http, private navParams: NavParams, public storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');
  }

  login() {
    var parameter = JSON.stringify({ username: this.username, password: this.password });

    this.http.post(this.LOGIN_URL, parameter, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => this.authSuccess(data.token),
      error => alert(error),
    );
  }

  signup() {
    var parameter = JSON.stringify({ username: this.username, email: this.email, password1: this.password, password2: this.password2 });
    this.http.post(this.SIGNUP_URL, parameter, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => alert(data),
      error => alert(error),
    );
  }



  authSuccess(token) {
    window.localStorage.setItem('id_token',token);
    this.user = this.jwtHelper.decodeToken(token).username;
    console.log("username:" + this.user);
    this.navCtrl.setRoot(TabsPage, { param: this.user }, { animate: true, direction: 'back' });
  }
}
