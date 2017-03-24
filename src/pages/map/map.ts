import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {
  @ViewChild("map") mapElement: ElementRef;
  map: any;
  event: any;
  source: any;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.event = this.navParams.get('param');
  }

  ionViewDidLoad() {
    console.log('Hello MapPage Page');
    this.loadMap();
    this.addMarker();
  }

  ionViewDidEnter() {
    google.maps.event.trigger(this.map, 'resize');
    this.map.setCenter(new google.maps.LatLng(this.event.latitude, this.event.longitude));
  }

  loadMap(): void {
    let latLng = new google.maps.LatLng(this.event.latitude, this.event.longitude);
    let mapOptions = {
      center: latLng,
      zoomControl: false,
      zoom: 30,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  addMarker(): void {
    let destination = new google.maps.LatLng(this.event.latitude, this.event.longitude);
    let desMarker = new google.maps.Marker({
      position: destination,
      map: this.map,
      title: this.event.location
    });
  }

  navigate() {
    LaunchNavigator.navigate([Number(this.event.latitude), Number(this.event.longitude) ])
      .then(
      success => alert('Launched navigator'),
      error => alert('Error launching navigator: ' + error)
      );
  }

}
