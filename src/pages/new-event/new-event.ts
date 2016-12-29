import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, ActionSheetController, LoadingController, ModalController } from 'ionic-angular';
import { JwtHelper } from 'angular2-jwt';
import { Http, Headers } from '@angular/http';
import { EventsPage } from '../events/events';
import { AutocompletePage } from '../autocomplete/autocomplete'
import { File, Camera, Transfer } from 'ionic-native';

declare var google;

@Component({
  selector: 'page-new-event',
  templateUrl: 'new-event.html'
})
export class NewEventPage {
  address: any;
  EVENTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/all_events/";
  PLACE_DETAIL: string = "https://maps.googleapis.com/maps/api/place/details/json?key=AIzaSyBbmBK941GBhwBTyGyoIVqao9cJfqqefto";
  INTERESTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/interests/"
  lat: any;
  lng: any;
  interests: any;
  jwtHelper: JwtHelper = new JwtHelper();
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  token = window.localStorage.getItem('id_token');
  date: string;
  timeStarts: string;
  creator: string = '["' + this.jwtHelper.decodeToken(this.token).username + '"]';
  users: string = '[]'
  location: any;
  event_name: string;
  event_type: string;
  description: string;
  imageChosen: any = 0;
  imagePath: any;
  creator_list: string[] = [this.jwtHelper.decodeToken(this.token).username];
  user_list: Array<string> = null;

  constructor(public navCtrl: NavController, private http: Http, private toastCtrl: ToastController, public actionSheet: ActionSheetController, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {
    this.getInterests();
    this.address = {
      place: ''
    };
  }

  ionViewDidLoad() {
    console.log('Hello NewEventPage Page');
  }

  getInterests() {
    this.http.get(this.INTERESTS_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.interests = data;
      },
      err => alert(err),
    );
  }

  showAddressModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
    });
    modal.present();
  }

  getPlaceDetail() {
    let url = this.PLACE_DETAIL + "&placeid=" + this.address.place.place_id;
    console.log("sdfasdf:" + url);
    this.http.get(url, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.lat = data.result.geometry.location.lat;
        this.lng = data.result.geometry.location.lng;
        alert("lat:" + this.lat + "-lng:" + this.lng);
      },
      err => alert(err),
    );
  }

  showToast() {
    let toast = this.toastCtrl.create({
      message: 'Your event is added!!',
      duration: 3000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  uploadPhoto() {
    this.getPlaceDetail();
    let ft = new Transfer();
    let filename = this.imagePath.substr(this.imagePath.lastIndexOf('/') + 1);
    let options = {
      fileKey: 'file',
      fileName: filename,
      httpMethod: 'POST',
      mimeType: 'image/jpeg',
      chunkedMode: false,
      headers: {
        'Content-Type': undefined,
        'Content-Disposition': "attachment; filename=" + filename
      },
      params: {
        fileName: filename,
        creator: JSON.stringify(this.creator_list),
        name: this.event_name,
        event_type: this.event_type,
        date: this.date,
        start: this.timeStarts,
        location: this.address.place.description,
        latitude: this.lat,
        longitude: this.lng,
        info: this.description
      }
    };
    ft.upload(this.imagePath, "http://campus.us-west-2.elasticbeanstalk.com/imageUpload", options, true)
      .then((result: any) => {
        console.log(JSON.stringify(result));
        this.imageChosen = 0;
        this.imagePath = '';
        this.showToast();
        this.navCtrl.setRoot(EventsPage, { animate: true, direction: 'back' })
      }).catch((error: any) => {
        alert(JSON.stringify(error));
      });
  }

  chooseImage() {

    let actionSheet = this.actionSheet.create({
      title: 'Choose Picture Source',
      buttons: [
        {
          text: 'Gallery',
          icon: 'albums',
          handler: () => {
            this.actionHandler(1);
          }
        },
        {
          text: 'Camera',
          icon: 'camera',
          handler: () => {
            this.actionHandler(2);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  actionHandler(selection: any) {
    var options: any;

    if (selection == 1) {
      options = {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: Camera.DestinationType.FILE_URI,
        quality: 100,
        allowEdit: false,
        targetWidth: 350,
        targetHeight: 200,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: false,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 350,
        targetHeight: 200,
        saveToPhotoAlbum: false
      };
    }

    Camera.getPicture(options)
      .then(file_uri => {
        this.imagePath = file_uri,
          this.imageChosen = 1
      },
      err => {
        console.log(err)
      })
  }
}
