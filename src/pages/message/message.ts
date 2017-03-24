import { Component } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { EventsPage } from '../events/events'

/*
  Generated class for the Message page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  MESSAGE_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/send_message"
  sender: any;
  owner: any;
  msg: any;

  constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http, private toastCtrl: ToastController) {
    this.sender = navParams.get('param');
    this.owner = navParams.get('param2');
  }

  ionViewDidLoad() {
    console.log('Hello MessagePage Page');
  }

  sendMessage() {
    var parameter = JSON.stringify({ sender: this.sender, owner: this.owner, message: this.msg });
    this.http.post(this.MESSAGE_URL, parameter, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.showToast(data);
        this.navCtrl.setRoot(EventsPage, { animate: true, direction: 'back' });
      },
      error => alert(error),
    );
  }

  showToast(result) {
    let toast = this.toastCtrl.create({
      message: result,
      duration: 3000,
      position: 'bottom'
    });

    toast.present(toast);
  }
}
