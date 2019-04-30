import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
import { HotelSearchFormComponent } from 'src/app/components/hotels/hotel-search-form/hotel-search-form.component';
import { HotelFiltersPipe } from 'src/app/pipes/hotel-filters.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels-listing',
  templateUrl: './hotels-listing.component.html',
  providers: [HotelFiltersPipe],
  styleUrls: ['./hotels-listing.component.css']
})
export class HotelsListingComponent implements OnInit {

    @ViewChild(HotelSearchFormComponent) child;
    
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  searchQuery: object;
  hotelsSearchResult:any;

  isLoading: boolean = true;

  public items: Array<any>;
    public filterSections: Array<any>;
    private _lipsum: any;

  constructor(private _ms: MainService, private _cookieService: CookieService,private _router: Router) { 
     
  }

  ngOnInit(): void {
    this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));

    this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/search',this.searchQuery).subscribe(result => {
        this.hotelsSearchResult = result;
        this.isLoading = false;
    })

    // this.getSearchResults($event);
    
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

    // this.filterSections = [
    //     {   
    //         title: 'Property Types',
    //         items : [
    //             {
    //                 value: 'Hotel',
    //                 title: 'Hotel',
    //                 checked: false
    //               },
    //               {
    //                 value: 'Guesthouse',
    //                 title: 'Guest House',
    //                 checked: false
    //               }
    //         ]
    //     },
    //     {
    //         title: 'Star Rating',
    //         items : [
    //             {
    //               value: '5',
    //               title: '5 Star',
    //               checked: false  
    //             }
    //         ]
    //     }
        
    //   ];
      this.filterSections = [
        {
            value: 'Hotel',
            title: 'Hotel',
            checked: false
          },
          {
            value: 'Guesthouse',
            title: 'Guest House',
            checked: false
          }
        
      ];
  } // on init


  public getSearchResults = ($event) => {
    this.isLoading = true;
    this.hotelsSearchResult = $event;
    console.log('results',this.hotelsSearchResult)
    this.isLoading = false;
  }

  public selectHotel = (id) => {
      this._cookieService.set('hotelId',id);
    this._router.navigate(['/hotel-details']);
  }

  checked() {
    return this.filterSections.filter(item => { return item.checked; });
  }

  createRange(number){
    var items: number[] = [];
    for(var i = 1; i <= number; i++){
       items.push(i);
    }
    return items;
  }

}
