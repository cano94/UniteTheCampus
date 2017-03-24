import { NgModule} from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import {AutocompletePage} from '../pages/autocomplete/autocomplete'
import { HomePage } from '../pages/home/home';
import { EventsPage } from '../pages/events/events';
import { NewEventPage } from '../pages/new-event/new-event';
import { LoginPage } from '../pages/login/login';
import { TournamentsPage } from '../pages/tournaments/tournaments';
import {EventDetailPage} from '../pages/event-detail/event-detail';
import {MapPage} from '../pages/map/map';
import {MessagePage} from '../pages/message/message'
import {MessageboxPage} from '../pages/messagebox/messagebox'
import { TabsPage } from '../pages/tabs/tabs';
import { EventParticipantsPage } from '../pages/event-participants/event-participants';
import {AuthHttp, AuthConfig} from 'angular2-jwt';
import {Http} from '@angular/http';
import { Auth } from '../providers/auth';
import { Storage } from '@ionic/storage';
import { Ionic2RatingModule } from 'ionic2-rating';




@NgModule({
  
  declarations: [
    MyApp,
    LoginPage,
    TabsPage,
    HomePage,
    MessageboxPage,
    EventsPage,
    EventDetailPage,
    MapPage,
    EventParticipantsPage,
    MessagePage,
    AutocompletePage,
    NewEventPage,
    TournamentsPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    MessageboxPage,
    TabsPage,
    EventsPage,
    EventDetailPage,
    MapPage,
    EventParticipantsPage,
    MessagePage,
    AutocompletePage,
    NewEventPage,
    TournamentsPage,
  ],
  providers: [
    LoginPage,
    Auth,
    Storage
    ]
})
export class AppModule {}
