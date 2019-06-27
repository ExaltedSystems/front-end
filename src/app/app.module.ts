import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { APP_ROUTES } from './app.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatNativeDateModule, MatAutocompleteModule,
  MatSelectModule, MatSidenavModule, MatDrawerContainer, MatDrawer, MatSidenav, MatProgressBarModule, MatCheckboxModule,
   MatExpansionModule, MatStepperModule, MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatTabsModule, MatIconModule} from '@angular/material';
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
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { HotelSearchFormComponent } from './components/hotels/hotel-search-form/hotel-search-form.component';
import { HotelsListingComponent } from './components/hotels/hotels-listing/hotels-listing.component';
import { HotelDetailsComponent } from './components/hotels/hotel-details/hotel-details.component';
import { HotelInlineSearchFormComponent } from './components/hotels/hotel-inline-search-form/hotel-inline-search-form.component';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxGalleryModule } from 'ngx-gallery';
import { DatePipe } from '@angular/common';
import { HotelFiltersPipe } from './pipes/hotel-filters.pipe';
import { ContactusComponent } from './components/contactus/contactus.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ToursComponent } from './components/tours/tours.component';
import { DealsComponent } from './components/deals/deals.component';
import { UmrahComponent } from './components/umrah/umrah.component';
import { VisaComponent } from './components/visa/visa.component';
import { RequstCallBackFormComponent } from './components/requst-call-back-form/requst-call-back-form.component';
import { PopularAirlineAndHotelsComponent } from './components/popular-airline-and-hotels/popular-airline-and-hotels.component';
import { DetailComponent } from './components/popular-airline-and-hotels/detail/detail.component';
import { VisaListsComponent } from './components/visa/visa-lists/visa-lists.component';
import { FilterVisaByNamePipe } from './pipes/filter-visa-by-name.pipe';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { GeneralPagesComponent } from './components/general-pages/general-pages.component';
import { HotelVoucherComponent } from './components/hotels/hotel-voucher/hotel-voucher.component';
import { HotelSubscribeComponent } from './components/hotels/hotel-subscribe/hotel-subscribe.component';
import { RangeSliderModule  } from 'ngx-rangeslider-component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { HotelBookingComponent } from './components/hotels/hotel-booking/hotel-booking.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { StarRatingFilterPipe } from './pipes/star-rating-filter.pipe';
import { BreakfastTypeFilterPipe } from './pipes/breakfast-type-filter.pipe';
import { PriceFilterPipe } from './pipes/price-filter.pipe';
import { FacilityFilterPipe } from './pipes/facility-filter.pipe';
import { IframePipe } from './pipes/iframe.pipe';
import { VisaListingPipe } from './pipes/visa-listing.pipe ';
import {NgxMaskModule} from 'ngx-mask';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { TravelAgentsComponent } from './components/franchise/travel-agents/travel-agents.component';
import { JobsComponent } from './components/jobs/jobs.component';

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
    ThankYouComponent,
    HotelSearchFormComponent,
    HotelsListingComponent,
    HotelDetailsComponent,
    HotelBookingComponent,
    HotelInlineSearchFormComponent,
    HotelFiltersPipe,
    OrderByPipe,
    StarRatingFilterPipe,
    BreakfastTypeFilterPipe,
    PriceFilterPipe,
    FacilityFilterPipe,
    ContactusComponent,
    AboutusComponent,
    ToursComponent,
    DealsComponent,
    UmrahComponent,
    VisaComponent,
    RequstCallBackFormComponent,
    PopularAirlineAndHotelsComponent,
    DetailComponent,
    VisaListsComponent,
    FilterVisaByNamePipe,
    SubscribeComponent,
    GeneralPagesComponent,
    HotelVoucherComponent,
    HotelSubscribeComponent,
    IframePipe,
    VisaListingPipe,
    FranchiseComponent,
    TravelAgentsComponent,
    JobsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // NoopAnimationsModule,
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
    NgxMaskModule.forRoot(),
    MatTabsModule,
    RangeSliderModule,
    FilterPipeModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [MainService, CookieService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
