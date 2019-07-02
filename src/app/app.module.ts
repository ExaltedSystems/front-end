import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { APP_ROUTES } from './app.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatNativeDateModule, MatAutocompleteModule, 
  MatSelectModule, MatSidenavModule, MatDrawerContainer, MatDrawer, MatSidenav, MatProgressBarModule, MatCheckboxModule,
   MatExpansionModule, MatStepperModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule, MatTooltipModule} from '@angular/material';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FlightsComponent } from './components/flights/flights.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { FlightsSearchComponent } from './components/flights-search/flights-search.component';
import { HotelsSearchComponent } from './components/hotels-search/hotels-search.component';
import { HomeComponent } from './components/home/home.component';
import { IconsModule } from './icons/icons.module';
import { MainService } from './services/main.service';
import { FlightsListingComponent } from './components/flights-listing/flights-listing.component';
import { AirPortsPipe } from './air-ports.pipe';
import { SecondsPipePipe } from './pipes/seconds-pipe.pipe';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { PnrViewComponent } from './components/pnr-view/pnr-view.component';
import { CookieService } from 'ngx-cookie-service';
import {StickyModule} from 'ng2-sticky-kit';
import { HotelSearchFormComponent } from './components/hotels/hotel-search-form/hotel-search-form.component';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { HotelDetailsComponent } from './components/hotels/hotel-details/hotel-details.component';
import { HotelInlineSearchFormComponent } from './components/hotels/hotel-inline-search-form/hotel-inline-search-form.component';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxGalleryModule } from 'ngx-gallery';
import { RangeSliderModule  } from 'ngx-rangeslider-component';
import { DatePipe } from '@angular/common';
import { HotelFiltersPipe } from './pipes/hotel-filters.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { StarRatingFilterPipe } from './pipes/star-rating-filter.pipe';
import { BreakfastTypeFilterPipe } from './pipes/breakfast-type-filter.pipe';
import { PriceFilterPipe } from './pipes/price-filter.pipe';
import { FacilityFilterPipe } from './pipes/facility-filter.pipe';
import { HotelBookingComponent } from './components/hotels/hotel-booking/hotel-booking.component';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {TooltipModule} from "ngx-tooltip";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    FlightsComponent,
    HotelsComponent,
    FlightsSearchComponent,
    HotelsSearchComponent,
    HomeComponent,
    FlightsListingComponent,
    AirPortsPipe,
    SecondsPipePipe,
    FlightBookingComponent,
    
    DateFormatPipe,
    
    PnrViewComponent,
    
    HotelSearchFormComponent,
    
    HotelsListingComponent,
    
    HotelDetailsComponent,
    
    HotelInlineSearchFormComponent,
    
    HotelFiltersPipe,
    
    OrderByPipe,
    
    StarRatingFilterPipe,
    
    BreakfastTypeFilterPipe,
    
    PriceFilterPipe,
    
    FacilityFilterPipe,
    
    HotelBookingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    HttpModule,
    // Material Modules
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatIconModule,
    IconsModule,
    MatSidenavModule,
    MatProgressBarModule,
    InfiniteScrollModule,
    MatExpansionModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSidenavModule,
    StickyModule,
    RouterModule.forRoot(APP_ROUTES),
    NgxDaterangepickerMd.forRoot({
      separator: '  -  ', 
      format: "DD/MM/YYYY",
    }),
    NgxGalleryModule,
    RangeSliderModule,
    FilterPipeModule,
    MatProgressSpinnerModule,
    DeviceDetectorModule.forRoot(),
    MatTooltipModule,
    TooltipModule
    
  ],
  providers: [MainService, CookieService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
