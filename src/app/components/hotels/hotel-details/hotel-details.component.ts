import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  hotelData: any;
  hotelDetails: any;
  hotelId;
  hotelObj: object;
  searchQuery: object;
  isLoading: boolean = true;
  checkInDate: Date;
  checkOutDate: Date;
  totalNights: number;

  totalRoomsSelected: number = 0;
  totalPrice: number = 0;
  
  constructor(private _ms: MainService, private _date: DatePipe, private _cookieService: CookieService) { }

  ngOnInit(): void {
    // get search query
    this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));

    this.checkInDate = this.searchQuery['dates']['startDate'];
    this.checkOutDate = this.searchQuery['dates']['endDate'];
    this.totalNights = this.calculateDate(this.checkInDate,this.checkOutDate)
    console.log('nights',this.totalNights)

    this.hotelId = this._cookieService.get('hotelId');
    this.hotelObj = {
        hotel_id: this.hotelId
    }

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/hotelDetails',this.hotelObj).subscribe(result => {
        this.hotelDetails = result;
        this.galleryImages = result['images'];
        this.isLoading = false;
        console.log('hotel data',this.hotelDetails)
    })


    this.galleryOptions = [
      { "previewCloseOnClick": true, "previewCloseOnEsc": true },
        {
            width: '100%',
            height: '600px',
            thumbnailsColumns: 8,
            imagePercent: 100,
            thumbnailsPercent: 10,
            thumbnailsMargin: 5,
            thumbnailMargin: 5,
            imageAnimation: NgxGalleryAnimation.Slide
        },
        // max-width 800
        {
            breakpoint: 800,
            width: '100%',
            height: '500px',
            imagePercent: 100,
            thumbnailsPercent: 25,
            thumbnailsMargin: 5,
            thumbnailMargin: 5
        },
        // max-width 400
        {
            breakpoint: 400,
            preview: false
        }
    ];

    this.galleryImages = [
        {
            small: 'assets/img/destinations/thailand.jpg',
            medium: 'assets/img/destinations/thailand.jpg',
            big: 'assets/img/destinations/thailand.jpg'
        },
        {
            small: 'assets/img/destinations/KL_BG2.jpg',
            medium: 'assets/img/destinations/KL_BG2.jpg',
            big: 'assets/img/destinations/KL_BG2.jpg'
        },
        {
            small: 'assets/img/destinations/sg-trip.jpg',
            medium: 'assets/img/destinations/sg-trip.jpg',
            big: 'assets/img/destinations/sg-trip.jpg'
        }
    ];
  } //

  calculateDate = (date1: any, date2: any) => {
    //our custom function with two parameters, each for a selected date
      let diffc = new Date(date1).getTime() - new Date(date2).getTime();
      //getTime() function used to convert a date into milliseconds. This is needed in order to perform calculations.
     
      let days = Math.round(Math.abs(diffc/(1000*60*60*24)));
      //this is the actual equation that calculates the number of days.
     
    return days;
    }

    public getRoomsPrice = (rooms:number,price:number) => {
        this.totalPrice = this.totalPrice + (+price * +rooms);
        this.totalRoomsSelected = this.totalRoomsSelected + +rooms;
        console.log('rooms',this.totalRoomsSelected)
        console.log('prive', this.totalPrice)
    }

  public getSearchResults = ($event) => {
    this.isLoading = true;
    this.hotelData = $event;
    this.isLoading = false;
  }

}
