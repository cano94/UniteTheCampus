import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { MapPage } from '../map/map'
import { MessagePage } from '../message/message'
import { EventParticipantsPage } from '../event-participants/event-participants'
import * as Enumerable from 'linq';


@Component({
    selector: 'page-event-detail',
    templateUrl: 'event-detail.html'
})
export class EventDetailPage {
    jwtHelper: JwtHelper = new JwtHelper();
    token = window.localStorage.getItem('id_token');
    user_id: any = this.jwtHelper.decodeToken(this.token).user_id
    username = '["' + this.jwtHelper.decodeToken(this.token).username + '"]';
    event: any;
    user_ratings: any;
    showMap: boolean = false;
    UPDATE_PARTICIPANTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/updatePart"
    PARTICIPANTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/participants"
    USER_RATING_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/event_user_ratings/";
    contentHeader: Headers = new Headers({ "Content-Type": "application/json" });

    constructor(public navCtrl: NavController, private navParams: NavParams, private http: Http) {
        this.event = this.navParams.get('param');
        //this.getUserRating();

    }

    ionViewDidLoad() {
        console.log('Hello EventDetailPage Page');
    }

    getUserRating() {
        //let url = this.USER_RATING_URL + this.e
        this.http.get(this.USER_RATING_URL, { headers: this.contentHeader })
            .map(res => res.json())
            .subscribe(
            data => {
                this.calculateAvgRating(data)
            },
            err => alert(err),
        );
    }

    calculateAvgRating(data) {
        this.user_ratings = Enumerable.from(data).groupBy("$.rating_type", null,
            function(key, g) {
                var result = {
                    rating_type: key,
                    total: g.sum("$.rating"),
                    avg: g.average("$.rating")
                }
                return result;
            }).toArray();
    }

    pushMapPage() {
        this.navCtrl.push(MapPage, { param: this.event }, { animate: true, direction: 'back' })
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
        this.navCtrl.push(EventParticipantsPage, { param: url, param2:this.user_id }, { animate: true, direction: 'back' })
    }

    pushMessagePage() {
        this.navCtrl.push(MessagePage, { param: this.user_id, param2:this.event.creator[0]}, { animate: true, direction: 'back' });
    }
}
