import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { MessagePage } from '../message/message'
import { HomePage } from '../home/home'
import { JwtHelper } from 'angular2-jwt';

/*
  Generated class for the Messagebox page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-messagebox',
  templateUrl: 'messagebox.html'
})
export class MessageboxPage {
  jwtHelper: JwtHelper = new JwtHelper();
  token = window.localStorage.getItem('id_token');
  user_id = this.jwtHelper.decodeToken(this.token).user_id;
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  DELETE_MSG_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/delete_message/"
  MSG_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/list_unread_messages/" + this.user_id + "/";
  messages: any;

  constructor(public navCtrl: NavController, private http: Http, private navParams: NavParams) {
    this.getMessages();
    //this.messages = this.navParams.get('param');

  }

  ionViewDidLoad() {
    console.log('Hello MessageboxPage Page');
  }

  replyMessage(owner) {
    this.navCtrl.push(MessagePage, { param: this.user_id, param2: owner }, { animate: true, direction: 'back' });
  }

  getMessages() {
    this.http.get(this.MSG_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.messages = data;
        console.log(JSON.stringify(this.messages));
      },
      err => alert(err),
    );
  }

  deleteMessage(id) {
    let url = this.DELETE_MSG_URL + id + "/"
    this.http.delete(url)
      .subscribe(
      (response) => {
        if (response.status === 204) {
          this.getMessages();
          this.navCtrl.push(MessageboxPage);
        }
      });
  }
}

