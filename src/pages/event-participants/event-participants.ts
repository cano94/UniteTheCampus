import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';

/*
  Generated class for the EventParticipants page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-participants',
  templateUrl: 'event-participants.html'
})
export class EventParticipantsPage {
participants: any[];
PARTICIPANTS_URL: any;
contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
   this.PARTICIPANTS_URL = this.navParams.get('param');
   this.getParticipants();
  }

  ionViewDidLoad() {
    console.log('Hello EventParticipantsPage Page');
  }

  getParticipants(){
    this.http.get(this.PARTICIPANTS_URL,{headers: this.contentHeader})
    .map(res => res.json())
      .subscribe(
      data => this.participants=data.users,
      err => alert(err),
    );
  }

}
