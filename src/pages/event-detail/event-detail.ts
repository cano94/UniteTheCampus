import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import{MapPage} from '../map/map'


@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  event: any;
  showMap: boolean = false;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.event = this.navParams.get('param');

  }

  ionViewDidLoad() {
    console.log('Hello EventDetailPage Page');
  }

  pushMapPage(){
    this.navCtrl.push(MapPage, {param:this.event}, { animate: true, direction: 'back' })
  }
}
