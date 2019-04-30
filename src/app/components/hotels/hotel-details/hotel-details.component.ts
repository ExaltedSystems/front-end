import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css']
})
export class HotelDetailsComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  hotelData: any;
  hotelId
  isLoading: boolean = true;
  constructor(private _ms: MainService, private _cookieService: CookieService) { }

  ngOnInit(): void {

    this.hotelId = this._cookieService.get('hotelId');
    console.log('id',this.hotelId)

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/hotelDetails',this.hotelId).subscribe(result => {
        this.hotelData = result;
        console.log('hotel data',this.hotelData)
    })


    this.galleryOptions = [
      { "previewCloseOnClick": true, "previewCloseOnEsc": true },
        {
            width: '100%',
            height: '600px',
            thumbnailsColumns: 8,
            imageAnimation: NgxGalleryAnimation.Slide
        },
        // max-width 800
        {
            breakpoint: 800,
            width: '100%',
            height: '500px',
            imagePercent: 100,
            thumbnailsPercent: 100,
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
  }

  public getSearchResults = ($event) => {
    this.isLoading = true;
    this.hotelData = $event;
    console.log('results',this.hotelData)
    this.isLoading = false;
  }

}
