import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { EventParticipantsPage } from '../event-participants/event-participants';
import{EventDetailPage} from '../event-detail/event-detail'
import { NewEventPage } from '../new-event/new-event';


/*
  Generated class for the Events page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {
  jwtHelper: JwtHelper = new JwtHelper();
  token = window.localStorage.getItem('id_token');
  user_id: any = this.jwtHelper.decodeToken(this.token).user_id
  eventType: string = "recommended";
  EVENTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/live_events/";
  RECOMMENDED_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/?types="
  USER_INTEREST_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/user_interest/" + this.user_id + "/"
  UPDATE_PARTICIPANTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/updatePart"
  PARTICIPANTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/participants"
  events: any;
  recommended_events: any;
  user_interests: any;
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

  username = '["' + this.jwtHelper.decodeToken(this.token).username + '"]';

  constructor(public navCtrl: NavController, private http: Http) {
    this.getUserInterests();
    this.getEvents();
  }

  ionViewDidLoad() {
    console.log('Hello EventsPage Page');
  }

  getEvents() {
    this.http.get(this.EVENTS_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.events = data;
      },
      err => alert(err),
    );
  }

  getUserInterests() {
    this.http.get(this.USER_INTEREST_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.getRecommendedEvents(data.interests);
        this.user_interests = data;
      },
      err => alert(err),
    );
  }

  getRecommendedEvents(data) {
    let s = "";
    for (let interest of data) {
      s += interest + ","
    }
    s = s.substring(0, s.length - 1);
    let url = this.RECOMMENDED_URL + s +"&"+this.user_id;
    this.http.get(url, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.recommended_events = data;
      },
      err => alert(err),
    );
  }

  addParticipant(event) {
    let url = this.UPDATE_PARTICIPANTS_URL + "/" + JSON.stringify(event) + "/";
    var parameter = '{"users":' + this.username + '}';

    this.http.put(url, parameter, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => console.log("adding success"),
      err => alert(err),
    );
  }

  pushParticipants(event) {
    let url = this.PARTICIPANTS_URL + "/" + JSON.stringify(event);
    this.navCtrl.push(EventParticipantsPage, { param: url }, { animate: true, direction: 'back' })
  }

  pushEventDetail(event){
    this.navCtrl.push(EventDetailPage, {param:event}, { animate: true, direction: 'back' })
  }

  pushNewEvent() {
    this.navCtrl.push(NewEventPage);
  }

}
