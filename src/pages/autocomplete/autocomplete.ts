import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';

declare var google: any;

@Component({
    selector: 'page-modal-autocomplete-items',
    templateUrl: 'autocomplete.html'
})
export class AutocompletePage implements OnInit{

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;

    constructor(public viewCtrl: ViewController) { 
    }

    ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();        
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        console.log('modal > chooseItem > item > ', item);
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        console.log('modal > updateSearch');
        if (this.autocomplete.query == '') {
            this.autocompleteItems = [];
            return;
        }
        let self = this;
        let config = { 
            //types:  ['geocode'], // other types available in the API: 'establishment', 'regions', and 'cities'
            input: this.autocomplete.query, 
            componentRestrictions: { country: 'TR' } 
        }
        this.acService.getPlacePredictions(config, function (predictions, status) {
            console.log('modal > getPlacePredictions > status > ', status);
            self.autocompleteItems = [];            
            predictions.forEach(function (prediction) {              
                self.autocompleteItems.push(prediction);
            });
        });
    }

}