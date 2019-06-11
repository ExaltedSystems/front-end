import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hotel-booking',
  templateUrl: './hotel-booking.component.html',
  styleUrls: ['./hotel-booking.component.css']
})
export class HotelBookingComponent implements OnInit {

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

  roomsInfo: any;
  selectedRooms: any;

  isLinear = false;
  bookingInfoFrom: FormGroup;
  paymentInfoForm: FormGroup;

  constructor(private _ms: MainService, private _cookieService: CookieService,private __fb: FormBuilder) { }

  ngOnInit() {
    // get search query
    this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));
    console.log('serach', this.searchQuery)
    this.checkInDate = this.searchQuery['dates']['startDate'];
    this.checkOutDate = this.searchQuery['dates']['endDate'];
    this.totalNights = this.calculateDate(this.checkInDate, this.checkOutDate)

    this.hotelId = this._cookieService.get('hotelId');
    this.hotelObj = {
      hotel_id: this.hotelId
    }

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/hotelDetails', this.hotelObj).subscribe(result => {
      this.hotelDetails = result;
      this.galleryImages = result['images'];
      this.isLoading = false;
      console.log('hotel details', this.hotelDetails)
    })

    this.getSelectedRooms();

    this.galleryOptions = [
      {
          width: '100%',
          height: '100%',
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
          breakpoint: 800,
          width: '100%',
          height: '100%',
          imagePercent: 100,
          thumbnailsPercent: 20,
          thumbnailsMargin: 5,
          thumbnailMargin: 5
      },
      // max-width 400
      {
          breakpoint: 400,
          width: '100%',
          height: '200px',
          imagePercent: 100,
          thumbnailsPercent: 20,
          thumbnailsMargin: 5,
          thumbnailMargin: 5,
          preview: false
      }
  ];

  this.bookingInfoFrom = this.__fb.group({
    title: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.required],
    confirmEmail: ['', Validators.required],
    bookingFor: ['', Validators.required],
  });
  this.paymentInfoForm = this.__fb.group({
    cardType: ['', Validators.required],
    cardNumber: ['', Validators.required],
    cvn: ['', Validators.required],
    cardHolderFirstName: ['', Validators.required],
    cardholderLastName: ['', Validators.required],
    expiryMonth: ['', Validators.required],
    expiryYear: ['', Validators.required],
    email: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required],
  });
  
  } //

  getSelectedRooms = () => {
    this.roomsInfo = JSON.parse(this._cookieService.get('roomsInfo'));

    let reservedRooms = {
      hotel_id: this.hotelId,
      room_ids: this.roomsInfo
    }

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/reservedHotelDetails',reservedRooms).subscribe(result => {
      console.log(result);
      this.selectedRooms = result['room_details']
    })
  }

  removeSelectedRoom = (id) => {
    for( var i = this.roomsInfo.length-1; i--;){
      if ( this.roomsInfo[i] === id) this.roomsInfo.splice(i, 1);
      }
    this._cookieService.set('roomsInfo',JSON.stringify(this.roomsInfo));
    this.getSelectedRooms();
  }

  calculateDate = (date1: any, date2: any) => {
    //our custom function with two parameters, each for a selected date
    let diffc = new Date(date1).getTime() - new Date(date2).getTime();
    //getTime() function used to convert a date into milliseconds. This is needed in order to perform calculations.

    let days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
    //this is the actual equation that calculates the number of days.

    return days;
  }

  createRange(number) {
    var items: number[] = [];
    for (var i = 1; i <= number; i++) {
      items.push(i);
    }
    return items;
  }

  conformBooking = () => {
    let bookingObj = {
      hotelId: '',
      checkInDate: '',
      checkOutDate: '',
      totalNights: '',
      guests: {
        adults: '',
        children: '',
        childrenAges: []
      },
      rooms: [{
        roomId: '',
        roomsCount: '',
        roomGuests: ''
      }],
      title: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: '',
      paymentInfo: {
        cardType: '',
        cardNo: '',
        ccv: '',
        expiryDate: '',
        cardHolderFirstName: '',
        cardHolderLastName: '',
      }
    }
  }

}
