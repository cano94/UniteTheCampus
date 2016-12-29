import { Component } from '@angular/core';
import { Auth } from '../../providers/auth';
import { NavController, NavParams, ActionSheetController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { TournamentsPage } from '../tournaments/tournaments';
import { EventsPage } from '../events/events';
import { Slides } from 'ionic-angular';
import { File, Camera, Transfer } from 'ionic-native';
import * as Enumerable from 'linq';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  eventType: string = "favorites";
  contentHeader: Headers = new Headers({ "Content-Type": "application/json" });
  jwtHelper: JwtHelper = new JwtHelper();
  token = window.localStorage.getItem('id_token');
  username: string = this.jwtHelper.decodeToken(this.token).username;
  user_id = this.jwtHelper.decodeToken(this.token).user_id;
  USER_RATING_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/event_user_ratings/" + this.user_id + "/";
  PAST_USER_EVENTS: string = "http://campus.us-west-2.elasticbeanstalk.com/user_past_events/" + this.user_id + "/";
  UPDATE_PROFILE_IMAGE: string = "http://campus.us-west-2.elasticbeanstalk.com/update_profile_image/" + this.user_id + "/";
  PROFILE_IMAGE_DETAIL: string = "http://campus.us-west-2.elasticbeanstalk.com/profile_image_detail/" + this.user_id + "/";
  INTERESTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/interests/"
  USER_INTERESTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/user_interest_list/" + this.user_id + "/";
  UPDATE_INTERESTS_URL: string = "http://campus.us-west-2.elasticbeanstalk.com/user_interest/" + this.user_id + "/";
  user_ratings: any;
  interests: any;
  user_interests: any;
  profile_image: any;
  past_events: any;
  past_events_size: any;
  avgRate: any;
  imagePath: any;
  gridPressed: boolean = false;
  testCheckboxOpen: boolean;
  testCheckboxResult;
  local: string = "http://campus.us-west-2.elasticbeanstalk.com/";
  mySlideOptions = {
    pager: true
  };

  constructor(public navCtrl: NavController, private authService: Auth, private navParams: NavParams,
    public storage: Storage, private http: Http, public actionSheet: ActionSheetController, private alertCtrl: AlertController) {
    this.getProfileImage();
    this.getInterests();
    this.getUserInterests();
    this.getUserRating();
    this.getPastEvents();
  }

  ionViewDidLoad() {
    console.log('Hello Home Page');
  }

  getProfileImage() {
    this.http.get(this.PROFILE_IMAGE_DETAIL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.profile_image = data.profile_image;
      },
      err => alert(err),
    );
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

  getUserInterests() {
    this.http.get(this.USER_INTERESTS_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.user_interests = data.interests;
      },
      err => alert(err),
    );
  }

  getTriples() {
    let triples = [];
    let length = this.user_interests.length;
    for (let i = 0; i < length; i += 3) {
      let trio = [];
      trio.push(this.user_interests[i]);
      if (i + 1 < length) {
        trio.push(this.user_interests[i + 1]);
      }
      if (i + 2 < length) {
        trio.push(this.user_interests[i + 2]);
      }

      triples.push(trio);
    }
    return triples;
  }

  getUserRating() {
    this.http.get(this.USER_RATING_URL, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.calculateAvgRating(data)
      },
      err => alert(err),
    );
  }

  showCheckbox() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Interests');
    for (let interest of this.interests) {
      alert.addInput({
        type: 'checkbox',
        label: interest.name,
        value: interest.name,
      });
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Update',
      handler: data => {
        console.log('Checkbox data:', data);
        this.testCheckboxOpen = false;
        this.testCheckboxResult = data;
        this.updateInterest(this.testCheckboxResult);
      }
    });
    alert.present();
  }

  updateInterest(data) {
    var params = {
      interests: data
    }
    this.http.put(this.UPDATE_INTERESTS_URL, params, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.navCtrl.setRoot(HomePage, { animate: true, direction: 'back' })
      },
      err => alert(err),
    );
  }

  calculateAvgRating(data) {
    this.user_ratings = Enumerable.from(data).groupBy("$.rating_type", null,
      function (key, g) {
        var result = {
          rating_type: key,
          total: g.sum("$.rating"),
          avg: g.average("$.rating")
        }
        return result;
      }).toArray();
  }

  getPastEvents() {
    this.http.get(this.PAST_USER_EVENTS, { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
      data => {
        this.past_events = data;
        console.log(JSON.stringify(this.past_events));
        this.past_events_size = data.length;
      },
      err => alert(err),
    );
  }

  uploadProfileImage() {
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
        user_id: this.user_id
      }
    };
    ft.upload(this.imagePath, this.UPDATE_PROFILE_IMAGE, options, true)
      .then((result: any) => {
        console.log(JSON.stringify(result));
        this.imagePath = '';
        this.navCtrl.setRoot(HomePage, { animate: true, direction: 'back' });
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
        allowEdit: true,
        targetWidth: 240,
        targetHeight: 240,
        encodingType: Camera.EncodingType.JPEG,
        saveToPhotoAlbum: false
      };
    } else {
      options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 240,
        targetHeight: 240,
        saveToPhotoAlbum: false
      };
    }

    Camera.getPicture(options)
      .then(file_uri => {
        this.imagePath = file_uri;
        this.uploadProfileImage();
      },
      err => {
        console.log(err)
      })
  }

  logout() {
    window.localStorage.removeItem('id_token');
    this.username = null;
    this.navCtrl.parent.parent.setRoot(LoginPage);
  }

}
