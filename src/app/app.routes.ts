import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { FlightsListingComponent } from './components/flights-listing/flights-listing.component';
import { FlightBookingComponent } from './components/flight-booking/flight-booking.component';
import { PnrViewComponent } from './components/pnr-view/pnr-view.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';
import { HotelsListingComponent } from 'src/app/components/hotels/hotels-listing/hotels-listing.component';
import { HotelDetailsComponent } from 'src/app/components/hotels/hotel-details/hotel-details.component';
import { ContactusComponent } from 'src/app/components/contactus/contactus.component';
import { FlightsComponent } from 'src/app/components/flights/flights.component';
import { HotelsComponent } from 'src/app/components/hotels/hotels.component';
import { VisaListsComponent } from 'src/app/components/visa/visa-lists/visa-lists.component';
import { VisaComponent } from 'src/app/components/visa/visa.component';
import { UmrahComponent } from 'src/app/components/umrah/umrah.component';
import { DealsComponent } from 'src/app/components/deals/deals.component';
import { ToursComponent } from 'src/app/components/tours/tours.component';
import { AboutusComponent } from 'src/app/components/aboutus/aboutus.component';
import { DetailComponent } from 'src/app/components/popular-airline-and-hotels/detail/detail.component';
import { HotelBookingComponent } from './components/hotels/hotel-booking/hotel-booking.component';
import { GeneralPagesComponent } from './components/general-pages/general-pages.component';
import { HotelVoucherComponent } from './components/hotels/hotel-voucher/hotel-voucher.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { FranchiseComponent } from './components/franchise/franchise.component';
import { PaymentErrorComponent } from './components/payment-error/payment-error.component';
import { TourCalculatorComponent } from './components/tour-calculator/tour-calculator.component';


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
	{ path: 'thank-you', component: ThankYouComponent },
	{ path: 'paymentError', component: PaymentErrorComponent },
	{ path: 'hotels-listing', component: HotelsListingComponent },
	{ path: 'hotel-details', component: HotelDetailsComponent },
	{ path: 'airlines/:airline', component: DetailComponent },
	{ path: 'hotels/:hotel', component: DetailComponent },
	{ path: 'hotel-booking', component: HotelBookingComponent },
	{ path: 'hotel-voucher', component: HotelVoucherComponent },
	{ path: 'jobs', component: JobsComponent },
	{ path: 'franchise-reg', component: FranchiseComponent },
	{ path: 'tour-calculator', component: TourCalculatorComponent },
	{ path: '**', component: GeneralPagesComponent }
];
