import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import {LoginPage} from '../pages/login/login';
import {HomePage} from '../pages/home/home';
import {tokenNotExpired} from 'angular2-jwt';
import {Storage} from '@ionic/storage';


@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage : any;

  constructor(platform: Platform, public storage:Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
    this.setRoot();
  }

  authenticated() {
    return tokenNotExpired();
  }

  setRoot(){
    if(this.authenticated && window.localStorage.getItem('id_token') !== null){
      this.rootPage = TabsPage;
    }else{
      this.rootPage = LoginPage;
    }
  }
}
