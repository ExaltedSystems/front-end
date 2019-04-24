import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-hotels-listing',
  templateUrl: './hotels-listing.component.html',
  styleUrls: ['./hotels-listing.component.css']
})
export class HotelsListingComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() { }

  ngOnInit(): void {

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

}
