import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightsListingComponent } from './components/flights-listing/flights-listing.component';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { PnrViewComponent } from './components/pnr-view/pnr-view.component';
import { HotelsListingComponent } from 'src/app/components/hotels/hotels-listing/hotels-listing.component';
import { HotelDetailsComponent } from 'src/app/components/hotels/hotel-details/hotel-details.component';
import { ContactusComponent } from 'src/app/components/contactus/contactus.component';
import { FlightsComponent } from	'src/app/components/flights/flights.component';
import { HotelsComponent } from	'src/app/components/hotels/hotels.component';
import { VisaListsComponent } from	'src/app/components/visa/visa-lists/visa-lists.component';
import { VisaComponent } from	'src/app/components/visa/visa.component';
import { UmrahComponent } from	'src/app/components/umrah/umrah.component';
import { DealsComponent } from	'src/app/components/deals/deals.component';
import { ToursComponent } from	'src/app/components/tours/tours.component';
import { AboutusComponent } from  'src/app/components/aboutus/aboutus.component';
import  { DetailComponent } from 'src/app/components/popular-airline-and-hotels/detail/detail.component';



export const APP_ROUTES: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'flights', component: FlightsComponent },
	{ path: 'hotels', component: HotelsComponent },
	{ path: 'visa', component: VisaListsComponent },
	{ path: 'visa/:visa', component: VisaComponent },
	{ path: 'umrah', component: UmrahComponent },
	{ path: 'umrah-packages/:package', component: UmrahComponent },
	{ path: 'flight-deals/:deal', component: DealsComponent },
	{ path: 'deals', component: DealsComponent },
	{ path: 'tours', component: ToursComponent },
	{ path: 'aboutUs', component: AboutusComponent },
	{ path: 'bank-details', component: AboutusComponent },
	{ path: 'contactUs', component: ContactusComponent },
	{ path: 'flights-listing', component: FlightsListingComponent },
	{ path: 'flight-booking', component: FlightBookingComponent },
	{ path: 'pnrView', component: PnrViewComponent },
	{ path: 'hotels-listing', component: HotelsListingComponent },
	{ path: 'hotel-details', component: HotelDetailsComponent },
	{ path: 'airlines/:airline', component : DetailComponent},
	{ path: 'hotels/:hotel', component : DetailComponent}
];