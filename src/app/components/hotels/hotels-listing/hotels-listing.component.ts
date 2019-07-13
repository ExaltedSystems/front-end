import { Component, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { MainService } from 'src/app/services/main.service';
import { CookieService } from 'ngx-cookie-service';
import { HotelSearchFormComponent } from 'src/app/components/hotels/hotel-search-form/hotel-search-form.component';
import { HotelFiltersPipe } from 'src/app/pipes/hotel-filters.pipe';
import { Router } from '@angular/router';
import { OrderByPipe } from 'src/app/pipes/order-by.pipe';
import * as _ from 'lodash';
import { StarRatingFilterPipe } from 'src/app/pipes/star-rating-filter.pipe';
import { isArray } from 'util';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MouseEvent } from '@agm/core';
declare var jQuery;


@Component({
    selector: 'app-hotels-listing',
    templateUrl: './hotels-listing.component.html',
    providers: [HotelFiltersPipe, OrderByPipe, StarRatingFilterPipe],
    styleUrls: ['./hotels-listing.component.css']
})
export class HotelsListingComponent implements OnInit {

    @ViewChild(HotelSearchFormComponent) child;

    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];

    searchQuery: any;
    hotelsSearchResult: any = [];

    order: string = '';
    reverse: boolean;

    isLoading: boolean = true;

    min = 0;
    max = 0;
    range = [];
    propertyTypes: any[] = [];
    starRating;
    popularFacilities;
    breakfastTypes: any[] = [];
    priceList: any = [];
    selectedPriceValue: any;

    public items: Object[];
    public filterSections: any[];
    private _lipsum: any;

    deviceInfo = null;
    isDesktop = null;
    isMobile = false;
    isTablet = null;
    sideForm:boolean = true;

    userFilter: any = { star_rating: '', price: '' };
    
    // initial center position for the map
    lat: number = 33.6844;
    lng: number = 73.0479;
    // google maps zoom level
    zoom: number = 12;

    constructor(private _ms: MainService, private _cookieService: CookieService, private __router: Router, private deviceService: DeviceDetectorService) {
        this.epicFunction();
        window.scroll(0, 0);
		this.__router.routeReuseStrategy.shouldReuseRoute = function () {
			return false;
		}
    }

    ngOnInit() {
        this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));

        this._ms.postData(this._ms.backEndUrl+'HotelQuery/search', this.searchQuery).subscribe(result => {
            this.hotelsSearchResult = result;
            this.isLoading = false;
            console.log('result', result);
            this.getFiltersList(result);
        })

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
                breakpoint: 568,
                width: '100%',
                height: '200px',
                imagePercent: 100,
                thumbnailsPercent: 20,
                thumbnailsMargin: 5,
                thumbnailMargin: 5,
                preview: false
            }
        ];


        this.starRating = [
            {
                value: '5',
                title: '5 Star',
                slelcted: false
            },
            {
                value: '4',
                title: '4 Star',
                slelcted: false
            },
            {
                value: '3',
                title: '3 Star',
                slelcted: false
            },
            {
                value: '2',
                title: '2 Star',
                slelcted: false
            },
            {
                value: '0',
                title: 'Unrated',
                slelcted: false
            }
        ];

        this.popularFacilities = [
            {
                value: 'Yes, Free',
                title: 'Free Parking',
                slelcted: false
            },
            {
                value: 'Yes, Free',
                title: 'Free Internet',
                slelcted: false
            },
            {
                value: 'Wifi',
                title: 'WiFi',
                slelcted: false
            },
            {
                value: 'Yes, Included in Price',
                title: 'Free Breakfast',
                slelcted: false
            },
            {
                value: 'Yes',
                title: 'Extra Bed',
                slelcted: false
            },
            {
                value: 'Private',
                title: 'Private Parking',
                slelcted: false
            }
        ];
        



    } // on init

    clickedMarker(label: string, index: number) {
        console.log(`clicked the marker: ${label || index}`)
    }

    mapClicked($event: MouseEvent) {
        this.markers.push({
            lat: $event.coords.lat,
            lng: $event.coords.lng,
            draggable: true
        });
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    markers: marker[] = [
        {
            lat: 33.7152332,
            lng: 73.0319362,
            label: 'A',
            draggable: false
        },
        {
            lat: 33.7160285,
            lng: 73.0144321,
            label: 'B',
            draggable: false
        },
        {
            lat: 33.7160285,
            lng: 73.0144332,
            label: 'C',
            draggable: false
        }
    ]

    // openDatePicker(){
    //     jQuery('#date-range').data('dateRangePicker').open();
    //   }


    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    epicFunction() {
        this.deviceInfo = this.deviceService.getDeviceInfo();
        this.isMobile = this.deviceService.isMobile();
        this.isTablet = this.deviceService.isTablet();
        this.isDesktop = this.deviceService.isDesktop();
    }

    isJson = (str) => {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    getFiltersList = (arr) => {
        console.log("arr:", arr)
        arr.forEach((element) => {
            // console.log('element',element.price)
            // get property list array
            this.propertyTypes.push({ value: element.prperty_name, title: element.prperty_name, slelcted: false });
            
            // get breakfast types array
            if(element.breakfast_type != null){
                if (element.breakfast_type.length > 0) {
                    element.breakfast_type.forEach((ele) => {
                        this.breakfastTypes.push({ value: ele.name, title: ele.name, slelcted: false });
                    });
                }
            }
            

            // get price array
            this.priceList.push(element.price);
        });

        // get unique porperty types form list
        this.propertyTypes = _.uniqBy(this.propertyTypes, 'value');

        // get unique breakfast types form list
        this.breakfastTypes = _.uniqBy(this.breakfastTypes, 'value');
        console.log(this.breakfastTypes);

        // get min and max price value for range slider
        this.min = Math.min.apply(null, this.priceList)
        this.max = Math.max.apply(null, this.priceList)
        this.range = [this.min, this.max];
    }


    rangeChanged(event: any) {
        this.selectedPriceValue = [event[0], event[1]];
    }

    get selectedPrice() {
        return this.selectedPriceValue;
    }

    get selectedFilters() {
        return this.propertyTypes.reduce((types, type) => {
            if (type.selected) {
                types.push(type.value);
            }
            return types;
        }, [])
    }

    get selectedStarRating() {
        return this.starRating.reduce((types, type) => {
            if (type.selected) {
                types.push(type.value);
            }
            return types;
        }, [])
    }

    get slectedFacilities() {
        return this.popularFacilities.reduce((types, type) => {
            if (type.selected) {
                types.push(type.value);
            }
            return types;
        }, [])
    }

    get slelctedBreakfast() {
        return this.breakfastTypes.reduce((types, type) => {
            if (type.selected) {
                types.push(type.value);
            }
            return types;
        }, [])
    }

    public getSearchResults = ($event) => {
        console.log('evt:', $event)
        this.isLoading = true;
        this.hotelsSearchResult = $event;
        this.isLoading = false;
        this.ngOnInit();
    }

    public selectHotel = (id) => {
        this._cookieService.set('hotelId', id);
        this.__router.navigate(['/hotel-details']);
    }

    public orderBy = (value) => {
        this.order = value;
        this.reverse = !this.reverse;
    }

    // checked() {
    //     return this.filterSections.filter(item => { return item.checked; });
    // }

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            items.push(i);
        }
        return items;
    }

}

// just an interface for type safety.
interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}