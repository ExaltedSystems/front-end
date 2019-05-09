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

    searchQuery: object;
    hotelsSearchResult: any = [];

    order: string = 'price';
    reverse: boolean = false;

    isLoading: boolean = true;

    min = 0;
    max = 0;
    range = [0, 0];
    propertyTypes: any[] = [];
    starRating;
    popularFacilities;
    breakfastTypes: any[] = [];
    priceList: any = [];
    selectedPriceValue: any;

    public items: Object[];
    public filterSections: any[];
    private _lipsum: any;

    userFilter: any = { star_rating: '', price: '' };

    constructor(private _ms: MainService, private _cookieService: CookieService, private _router: Router) {

    }

    ngOnInit(): void {
        this.searchQuery = JSON.parse(this._cookieService.get('hotelQuery'));

        this._ms.postData('http://cheapfly.pk/rgtapp/index.php/services/HotelQuery/search', this.searchQuery).subscribe(result => {
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
                breakpoint: 400,
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
                value: 'Yes, Its Free',
                title: 'Free Parking',
                slelcted: false
            },
            {
                value: 'Yes its Free',
                title: 'Free Internet',
                slelcted: false
            },
            {
                value: 'Wifi',
                title: 'WiFi',
                slelcted: false
            },
            {
                value: 'Yes, Its Free',
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

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    getFiltersList = (arr) => {
        arr.forEach((element) => {
            // console.log('element',element.price)
            // get property list array
            this.propertyTypes.push({ value: element.prperty_name, title: element.prperty_name, slelcted: false });

            // get property list array
            let breakfastArr = JSON.parse(element.breakfast_type);
            if (isArray(breakfastArr)) {
                breakfastArr.forEach((ele) => {
                    this.breakfastTypes.push({ value: ele.id, title: ele.name, slelcted: false });
                });
            }

            // get price array
            this.priceList.push(element.price);
        });

        // get unique porperty types form list
        this.propertyTypes = _.uniqBy(this.propertyTypes, 'value');

        // get unique breakfast types form list
        this.breakfastTypes = _.uniqBy(this.breakfastTypes, 'value');

        // get min and max price value for range slider
        this.max = Math.max.apply(null, this.priceList)
        this.min = Math.min.apply(null, this.priceList)
        this.range = [this.min, this.max];
    }


    rangeChanged(event: any) {
        this.selectedPriceValue = [event[0],event[1]];
    }

    get selectedPrice(){
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
        this.isLoading = true;
        this.hotelsSearchResult = $event;
        this.isLoading = false;
    }

    public selectHotel = (id) => {
        this._cookieService.set('hotelId', id);
        this._router.navigate(['/hotel-details']);
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
