import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightsListingComponent } from './components/flights-listing/flights-listing.component';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { PnrViewComponent } from './components/pnr-view/pnr-view.component';
import { HotelsListingComponent } from 'src/app/components/hotels/hotels-listing/hotels-listing.component';

export const APP_ROUTES: Routes = [
  	{ path: '', component: HomeComponent },
  	{ path: 'flights-listing', component: FlightsListingComponent },
  	{ path: 'flight-booking', component: FlightBookingComponent },
  	{ path: 'pnrView', component: PnrViewComponent },
  	{ path: 'hotels-listing', component: HotelsListingComponent }
];