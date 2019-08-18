<?php
if ($this->uri->segment(14) == "try") {
    $error_msg = "<span id='msg_error' style='color:red; font-size:14px;'>No More Ticket Issuing Is Possible As Your Credit Limit Is Exceeded. Please Clear Your Balance Amount..</span>";
}
if ($this->uri->segment(15) == 'reset') {
    $error_msg = "<span id='msg_error' style='color:red; font-size:14px;'> MarkUp Successfully Remove !</span>";
}
if ($this->uri->segment(15) == 'sv') {
    $error_msg = "<span id='msg_error' style='color:green; font-size:14px;'> MarkUp Successfully !</span>";
}

//error_reporting(0);
bkend_auto_complete();
$TravelItineraryReadRS = $SWSLLRS["TravelItineraryReadRS"]["TravelItinerary"];
$ItineraryRef = $TravelItineraryReadRS["ItineraryRef"];
$CustomerInfo = $TravelItineraryReadRS["CustomerInfo"];
$Telephone = $TravelItineraryReadRS["CustomerInfo"]["Telephone"];
$Address = $TravelItineraryReadRS["CustomerInfo"]["Address"];
bkend_itineraryRef($ItineraryRef, $Address);
$ItineraryInfo = $TravelItineraryReadRS["ItineraryInfo"];
if (!empty($ItineraryInfo["ReservationItems"]["Item"])) {
    $ReservationItems = $ItineraryInfo["ReservationItems"]["Item"];
}

if (!empty($TravelItineraryReadRS["AccountingInfo"])) {
    accountingInfo($TravelItineraryReadRS["AccountingInfo"]);
}

$Ticketings = $ItineraryInfo["Ticketing"];
//echo "ffffffffffffffff<pre>";
//print_r($AccountingInfo);
$eTicketNumbers = array_slice($ItineraryInfo["Ticketing"], 1);
$void_html = "";
foreach ($eTicketNumbers as $eTicketNumber) {
    eTicketNumber($eTicketNumber);

//    $void = bkend_expodeString("*VOID*", $eTicketNumber["attr"]["eTicketNumber"]);
//    if (!empty($void[1])) {
//        $void_html = '<img src="http://rehmantravel.com/application/modules/RT-agent/views/images/void-img.png"  style="position: absolute;z-index: 9999; height: 400px;width: 460px;top: 32%;left: 27%;"/>';
//    }
}
    if(bkend_e_ticket_number_void($Ticketings) == 0){
     $void_html = '<img src="http://rehmantravel.com/application/modules/RT-agent/views/images/void-img.png"  style="position: absolute;z-index: 9999; height: 400px;width: 460px;top: 32%;left: 27%;"/>';   
    }

if (is_array($TravelItineraryReadRS["ItineraryInfo"]["ItineraryPricing"]["PriceQuote"]) && array_key_exists(0, $TravelItineraryReadRS["ItineraryInfo"]["ItineraryPricing"]["PriceQuote"])) {
    $PriceQuotes = $TravelItineraryReadRS["ItineraryInfo"]["ItineraryPricing"]["PriceQuote"];
    $ValidatingCarrier = $PriceQuotes[0]["PricedItinerary"]["attr"]["ValidatingCarrier"];
} else {
    $PriceQuotes = $TravelItineraryReadRS["ItineraryInfo"]["ItineraryPricing"]["PriceQuote"];
    $ValidatingCarrier = $PriceQuotes["PricedItinerary"]["attr"]["ValidatingCarrier"];
}
//$uriPNR = $this->uri->segment(4);
//$uriSg4 = $this->uri->segment(5);
//$uriSg5 = $this->uri->segment(6);
//$uriSg6 = $this->uri->segment(7);
//$service_type = $this->uri->segment(8);
//$uriSg_09 = $this->uri->segment(9);
//$service_type_10 = $this->uri->segment(10);
//$uriSg_11 = $this->uri->segment(11);
//$service_type_12 = $this->uri->segment(12);

$get_pnr = $this->uri->segment(4);
$get_trip_info = $this->uri->segment(5);
$get_total_quantity = $this->uri->segment(6);
$get_asft_fee = $this->uri->segment(7);
$get_service_type = $this->uri->segment(8);
$get_agent_services_type = $this->uri->segment(9);
$get_agent_services_fee = $this->uri->segment(10);
$get_sub_agent_services_type = $this->uri->segment(11);
$get_sub_agent_services_fee = $this->uri->segment(12);

if (empty($PriceQuotes)) {
    ?>
    <script type="text/javascript">
        // window.location.assign("http://rehmantravel.com/RT-agent/Flight/update_WPRQ/<?php echo $uriPNR; ?>/<?php echo $uriSg4; ?>/<?php echo $uriSg5; ?>/<?php echo $uriSg6; ?>/<?php echo $service_type; ?>/<?php echo $uriSg_09; ?>/<?php echo $service_type_10; ?>/<?php echo $uriSg_11; ?>/<?php echo $service_type_12; ?>");
        window.location.assign("http://rehmantravel.com/RT-agent/Flight/update_WPRQ/<?php echo $get_pnr; ?>/<?php echo $get_trip_info; ?>/<?php echo $get_total_quantity; ?>/<?php echo $get_asft_fee; ?>/<?php echo $get_service_type; ?>/<?php echo $get_agent_services_type; ?>/<?php echo $get_agent_services_fee; ?>/<?php echo $get_sub_agent_services_type; ?>/<?php echo $get_sub_agent_services_fee; ?>");
    </script>
    <?php
    exit();
}
?>
<script type="text/javascript">
    function printTktPnr(divID) {
        var divElements = document.getElementById(divID).innerHTML;
        var oldPage = document.body.innerHTML;
        document.body.innerHTML =
                "<html><head><title></title></head><body>" +
                divElements + "</body>";
        window.print();
        document.body.innerHTML = oldPage;
    }
</script>

<?php
$pnr = bkend_url_query_decode($this->uri->segment(4));
$width = "728px";
$pdf_fare_width = "720px";
$pdf_email_ftr_width = "100%";
$pdf_email_fare_width = "720px";
$pdf_email_hdr_width = "49%";
$pdf_email_hdr_td_width = "15%";
$pdf_email_hdr_img_width = "40px";
$pdf_email_tkt_hdr_width = "100%";

$html = "";
$html .='<br style="clear:both;">
<div class="row">
    <div class="col-sm-offset-1 col-sm-10">
        <div class="panel panel-primary">
          <div class="panel-heading">Ticket</div>
            <div class="panel-body">
            <div class="row">' . $error_msg . '</div>

';
$bgallowances = $TravelItineraryReadRS["ItineraryInfo"]["ItineraryPricing"]["PriceQuote"];
$flight_matching_array = array();
if (is_array($bgallowances) && array_key_exists(0, $bgallowances)) {
    foreach ($bgallowances as $bgallowance) {
        $flights = $bgallowance["PricedItinerary"]["AirItineraryPricingInfo"]["PTC_FareBreakdown"]["FlightSegment"];
        $flight_matching_array[] = $flights;
    }
} else {
    $flights = $bgallowances["PricedItinerary"]["AirItineraryPricingInfo"]["PTC_FareBreakdown"]["FlightSegment"];
    if (is_array($flights) && array_key_exists(0, $flights)) {
        $flight_matching_array[] = $flights;
    }
}
$flight_matchings = array_unique($flight_matching_array);
foreach ($flight_matchings as $flight_matching) {
    $FlightNumber_array = array();
    $Baggage_Allowance = array();
    foreach ($flight_matching as $flightmatching) {
        if (is_array($flightmatching) && array_key_exists("attr", $flightmatching)) {
            $FlightNumber_array[] = $flightmatching["attr"]["ConnectionInd"];
            $Baggage_Allowance[] = $flightmatching["BaggageAllowance"]["attr"]["Number"];
        }
    }
}
if (!empty($TravelItineraryReadRS["ItineraryInfo"]["ReservationItems"]["Item"])) {
    $SWSLLRSItineraryInfos = $TravelItineraryReadRS["ItineraryInfo"]["ReservationItems"]["Item"];
    $airlineFlage = "";
    $row_airline_array = array();
    if (is_array($SWSLLRSItineraryInfos) && array_key_exists(0, $SWSLLRSItineraryInfos)) {
        foreach ($SWSLLRSItineraryInfos as $SWSLLRSItineraryInfo) {
            $MarketingAirline = $SWSLLRSItineraryInfo["Air"]["MarketingAirline"]["attr"]["Code"];
            $row_airline_array[] = $MarketingAirline;
        }
    } else {
        $MarketingAirline = $SWSLLRSItineraryInfos["Air"]["MarketingAirline"]["attr"]["Code"];
        $airline_Flage = $MarketingAirline;
    }
    if (!empty($airline_Flage)) {
        $airlineFlage = '<img src="http://rehmantravel.com/AirlineLogos/' . $airline_Flage . '.png" width="30%" alt="">';
        $pdf_airlineFlage = '<td width="40px"><img src="http://rehmantravel.com/AirlineLogos/' . $airline_Flage . '.png" width="40px" alt=""></td>';
    } else {
        $airline_array_sets = array_unique($row_airline_array);

        foreach ($airline_array_sets as $airline_row) {
            $airlineFlage .= '<img src="http://rehmantravel.com/AirlineLogos/' . $airline_row . '.png" width="30%" alt="">';
            $pdf_airlineFlage .= '<td width="40px"><img src="http://rehmantravel.com/AirlineLogos/' . $airline_row . '.png" width="40px" alt=""></td>';
        }
    }
}
// this script is only use for auto email
$email_html = '';
$email_html .= '<table  style="border:1px solid gray; width:734px" >'
        . '<tr style="background-color: #565656;color:#f8f8f8">
                 <td colspan="4"><span>Client Contact Details</span></td>
         </tr>'
        . '<tr>'
        . '<td>Email</td>'
        . '<td>xyz@gmail.com</td>'
        . '<td>contact no</td>'
        . '<td>1231231313132323</td>';
$email_html .= '</tr>';
$email_html .= '</table><br/>';


$email_html .='<table  style="border:1px solid gray; width:' . $width . '" >

<tr><td>
<table class="" width="100%">
        <tbody><tr>
            <td>';
$email_html .='<table class="ticket-header" width="100%">
                    <tbody>
                                          <tr>
                           <td width="50px">' . get_logo() . '</td>
                            <td align="center" width="50px" ><img src="http://rehmantravel.com/img/sm-rt-iso.jpg" width="40px" alt=""></td>
                            <td align="center" width="50px"><img src="http://rehmantravel.com/img/sm-rt-iata.jpg" width="40px" alt=""></td>
                            ' . $airlineFlage . '
                            <td rowspan="2" width="58%" align="right" style="vertical-align:top">
                                <table border="1" width="100%" cellpadding="0" class="pax-info">';
$email_html .='<tr class="pax-info-header" style="background-color: #565656;color: #f8f8f8;">
                                                    <td align="left" width="20px">S.No</td>
                                                    <td align="left" width="50%">Passenger Name</td>
                                                    <td align="left">Ticket Number</td>
                                                </tr>';
// end of  auto email
// this script is only use for pdf
$pdf_html = '';

$pdf_html .='<table  style="border:1px solid gray; width:100%" >
<tr><td>
<table class="" width="100%">
        <tbody><tr>
            <td>';
$pdf_html .='<table class="ticket-header" width="100%">
                    <tbody>
                        <tr>
                           <td width="50px">' . get_logo() . '</td>
                            <td align="center" width="50px" ><img src="http://rehmantravel.com/img/sm-rt-iso.jpg" width="40px" alt=""></td>
                            <td align="center" width="50px"><img src="http://rehmantravel.com/img/sm-rt-iata.jpg" width="40px" alt=""></td>
                            ' . $pdf_airlineFlage . '
                            <td rowspan="2" width="58%" align="right" style="vertical-align:top">
                                <table border="1" width="100%" cellpadding="0" class="pax-info">';
$pdf_html .='<tr class="pax-info-header" style="background-color: #565656;color: #f8f8f8;">
                                                    <td align="left" width="20px">S.No</td>
                                                    <td align="left" width="50%">Passenger Name</td>
                                                    <td align="left">Ticket Number</td>

                                                </tr>';
// end of  pdf

$html .='<div class="table-responsive" id="printdivId">
    ' . $void_html . '
                    <table class="" width="100%">
                        <tr>
                            <td>
                                <!-- ticket header -->
                                <table class="ticket-header" width="100%">
                                    <tr>
                                        <td width="116px">' . get_logo("100%") . '</td>
                                        <td align="center"><img src="http://rehmantravel.com/img/iso.jpg" width="58px" alt=""></td>
                                        <td align="center"><img src="http://rehmantravel.com/img/rt-iata.png" width="68px" alt=""></td>
                                        <td align="center">' . $airlineFlage . '</td>
                                        <td rowspan="2" width="400px" align="right">
                                            <table border="1" width="100%" cellpadding="0" cellpadding="0" class="pax-info">
                                                <tr class="pax-info-header" >
                                                    <td align="center">S.No</td>
                                                    <td>Passenger Name</td>
                                                    <td>Ticket Number</td>
                                                     <td align="left">Fare</td>
                                                </tr>';
$SWSLLRSTravelItineraryReadRS = $SWSLLRS["TravelItineraryReadRS"]["TravelItinerary"];

$SWSLLRSCustomerInfos = $SWSLLRSTravelItineraryReadRS["CustomerInfo"]["PersonName"];
bkend_client_contact_details($SWSLLRSCustomerInfos, $Telephone);


$SpecialServices = $SWSLLRSTravelItineraryReadRS["SpecialServices"];
if (is_array($SpecialServices) && array_key_exists(0, $SpecialServices)) {
    $sp = 0;
    foreach ($SpecialServices as $SpecialService) {
        $html .= bkend_specialService($SpecialService, $sp);
        $sp++;
    }
} else {
    $html .= bkend_specialService($SpecialServices, 1);
}

$total_psg = 0;
   $html .=bkend_e_ticketings($Ticketings);
if (is_array($SWSLLRSCustomerInfos) && array_key_exists(0, $SWSLLRSCustomerInfos)) {
    $qc = 1;
    $psgNames = '';
 
    foreach ($SWSLLRSCustomerInfos as $SWSLLRSCustomerInfo) {
        bkend_customerInfo($SWSLLRSCustomerInfo, $qc, $Ticketings, $Ticketings);
//        $html .= bkend_customerInfo($SWSLLRSCustomerInfo, $qc, $Ticketings, $Ticketings);
        $email_html .= bkend_email_pdf_customerInfo($SWSLLRSCustomerInfo, $qc, $Ticketings);
        $pdf_html .= bkend_email_pdf_customerInfo($SWSLLRSCustomerInfo, $qc, $Ticketings);
        $total_psg = $qc;
        $qc++;
    }
} else {
    bkend_customerInfo($SWSLLRSCustomerInfos, 1, $Ticketings);
//     $html .= bkend_customerInfo($SWSLLRSCustomerInfos, 1, $Ticketings);
    $email_html .= bkend_email_pdf_customerInfo($SWSLLRSCustomerInfos, 1, $Ticketings);
    $pdf_html .= bkend_email_pdf_customerInfo($SWSLLRSCustomerInfos, 1, $Ticketings);
    $total_psg = 1;
}
// this script is only use for auto email
$email_html .='</table>
                 </td>
                 </tr>
                 <tr>
                 <td colspan="4"><h2>E-Ticket Receipt</h2></td>
                 </tr>
                 </tbody>
                </table>';
$email_html .='<table class="table travel-info" style="font-size: 1.0 em;width: 100%;background-color: #F2F2F2; border: solid 1px #444;clear: both;padding: 5px;">
                <tbody>
                <tr>
                <td><b>Your Travel Information</b> / Booking Refrence (PNR) : <b>' . $pnr . '</b></td>
                </tr>';

// end of auto email
// this script is only use for pdf
$pdf_html .='</table>
                 </td>
                 </tr>
                 <tr>
                 <td colspan="4"><h2>E-TICKET RECEIPT</h2></td>
                 </tr>
                 </tbody>
                </table>';
$pdf_html .='<table class="table travel-info" style="font-size: 1.0 em;width: 100%;background-color: #F2F2F2; border: solid 1px #444;clear: both;padding: 5px;">
                <tbody>
                <tr>
                <td><b>Your Travel Information</b> / Booking Refrence (PNR) : <b>' . $pnr . '</b></td>
                </tr>';

// end of pdf

$html .='</table>
          </td>
          </tr>
          <tr>
          <td colspan="4"><h2>E-TICKET RECEIPT</h2></td>
          </tr>
          </table>
          <table class="table travel-info" style="font-size: 1.5em;">
          <tr>
          <td><b>Your Travel Information</b> / Booking Refrence (PNR) : <b>' . bkend_url_query_decode($this->uri->segment(4)) . '</b></td>
          </tr>';

if (!empty($ReservationItems) && is_array($ReservationItems) && array_key_exists(0, $ReservationItems)) {
    $counter = 0;
    $constantRph = 0;
    foreach ($ReservationItems as $ReservationItem) {
        if ($FlightNumber_array[$counter] == "O") {
            $constantRph++;
        }
        $BagAllowance = $Baggage_Allowance[$counter];
        $html .= bkend_reservationItems($ReservationItem, $FlightNumber_array[$counter], $BagAllowance, $constantRph);
        $email_html .= bkend_email_pdf_reservationItems($ReservationItem, $FlightNumber_array[$counter], $BagAllowance, $constantRph);
        $pdf_html .= bkend_email_pdf_reservationItems($ReservationItem, $FlightNumber_array[$counter], $BagAllowance, $constantRph);
        $counter++;
    }
} else {
    $html .= bkend_singlereservationItem($ReservationItems, $Baggage_Allowance);
    $email_html .= bkend_email_pdf_singlereservationItem($ReservationItems, $Baggage_Allowance);
    $pdf_html .= bkend_email_pdf_singlereservationItem($ReservationItems, $Baggage_Allowance);
}

//Head Office 01 & 03,Allay Plaza Near PIA Head Office,Fazl-e-Haq Road Blue Area Islamabad,Pakistan.
//Phone: +92-51-111-768-785, Email: info@rehmantravel.com,
$html .='</table>
           <b>Fare Details</b>
           <table class="table table-bordered fare-details">';
$html .= bkend_priceQuotes($PriceQuotes, $Address, $Telephone);
$html .='<tr>
          <td class="ticket-footer">' . get_footer() . '</td>
          </tr>
          </table> </table>
          </div>
          </div>';

// this script is only use for auto email
$email_html .='</tbody></table>';

$email_html .='<table  style="width:' . $pdf_fare_width . ';margin-bottom: 5px;padding:4px;" >';
$email_html .='<tr><td>';
$email_html .='<h4><span>Fare Details</span></h4>';
$email_html .='</td></tr>';
$email_html .='</table>';
$email_html .='<table  style="width:' . $pdf_email_fare_width . ';margin-bottom: 5px;padding:4px;" >';
$email_html .= bkend_email_pdf_priceQuotes($PriceQuotes, $Address, $Telephone);
$email_html .='</table>';
$email_html .='</td>
                </tr>
                <tr>
                    <td class="ticket-footer" style="width:' . $pdf_email_ftr_width . ';">';
$email_html .='<table style="width:' . $pdf_email_ftr_width . '">';
$email_html .='<tr><td>';
$email_html .='<img  src="http://rehmantravel.com/img/sm-pdf-email-footer.jpg" style="width:' . $pdf_email_ftr_width . ';"/>';
$email_html .='</td></tr>';
$email_html .='</table>';

$email_html .='</td>
                </tr>
            </tbody>
        </table>
        </td>
                </tr>
    </table>';

// end  auto email
// this script is only use for pdf
$pdf_html .='</tbody></table>';

$pdf_html .='<table  style="width:620px;margin-bottom: 5px;padding:4px;" >';
$pdf_html .='<tr><td>';
$pdf_html .='<h4><span>Fare Details</span></h4>';
$pdf_html .='</td></tr>';
$pdf_html .='</table>';
$pdf_html .='<table  style="width:610px;margin-bottom: 5px;padding:4px;" >';
$pdf_html .= bkend_email_pdf_priceQuotes($PriceQuotes, $Address, $Telephone);
$pdf_html .='</table>';
$pdf_html .='</td>
                </tr>
                <tr>
                    <td class="ticket-footer" style="width:525px;">';
$pdf_html .='<table style="width:525px">';
$pdf_html .='<tr><td>';
$pdf_html .='<img  src="http://rehmantravel.com/img/sm-pdf-email-footer.jpg" style="width:525px;"/>';
$pdf_html .='</td></tr>';
$pdf_html .='</table>';

$pdf_html .='</td>
                </tr>
            </tbody>
        </table>
        </td>
                </tr>
    </table>';

// end  of pdf

echo $html;
bkend_pnr_full_html_send_email($email_html, $html, $Ticketings);
airline_validating_carrier(bkend_url_query_encode($ValidatingCarrier), $total_psg);
?>
            
<?php
$psf_amount = bkend_url_query_decode($this->uri->segment(14));
if (current_pnr_issue_status() == 0) {
    ?>
    <div class="form-group form-panel" style="border:0px !important">
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
            Percentage
            <input class="addPrcnTg form-control" id="addPrcnTg"  style="width: 45%;" value="<?php
            if (bkend_url_query_decode($this->uri->segment(13)) != "" && bkend_url_query_decode($this->uri->segment(13)) != "0.00") {
                echo bkend_url_query_decode($this->uri->segment(13));
            }
            ?>" />
        </div>
        <div class="col-lg-3 col-md-3 col-sm-3 col-xs-12">
            Fixed Amount
            <input type="text" class="addPrcnTgVal form-control" style="width: 80%;" id="addPrcnTgVal" value="<?php
            if (bkend_url_query_decode($this->uri->segment(14)) != "" && bkend_url_query_decode($this->uri->segment(14)) != "0.00") {
                echo bkend_url_query_decode($this->uri->segment(14));
            }
            ?>"  /><br/>
        </div>
        <br/>
        <button id="addMarkup" class="addMarkup">Add MarkUp</button>
        <button id="btnReset" class="btnReset">Remove MarkUp</button>
    </div>

<?php } ?>
<br style="clear:both"/>
<div class="row" style="padding: 10px;">

    <?php
//    $segment_array = array(
//        'uriPNR' => $this->uri->segment(4),
//        'uriSg4' => $this->uri->segment(5),
//        'uriSg5' => $this->uri->segment(6),
//        'uriSg6' => $this->uri->segment(7),
//        'service_type' => $this->uri->segment(8),
//        'services_01' => $this->uri->segment(9),
//        'services_02' => $this->uri->segment(10),
//        'services_11' => $this->uri->segment(11),
//        'services_12' => $this->uri->segment(12),
////        'services_14' => $this->uri->segment(14),
////        'services_15' => $this->uri->segment(15),
//        'ValidatingCarrier' => $ValidatingCarrier
//    );

    $segment_array = array(
        'get_pnr' => $this->uri->segment(4),
        'get_trip_info' => $this->uri->segment(5),
        'get_total_quantity' => $this->uri->segment(6),
        'get_asft_fee' => $this->uri->segment(7),
        'get_service_type' => $this->uri->segment(8),
        'get_agent_services_type' => $this->uri->segment(9),
        'get_agent_services_fee' => $this->uri->segment(10),
        'get_sub_agent_services_type' => $this->uri->segment(11),
        'get_sub_agent_services_fee' => $this->uri->segment(12),
//        'services_14' => $this->uri->segment(14),
//        'services_15' => $this->uri->segment(15),
        'ValidatingCarrier' => $ValidatingCarrier
    );

//    echo "<pre>";
//    print_r($segment_array);
    $total_old_remaining_amounts = get_total_remaining_amount_agent_wise();
    $total_tkt_amount_with_all_taxes = current_pnr_amount();
//    echo "get_debit_amount_from_accounts".get_debit_amount_from_accounts()."<br/>";
//   echo "get_agent_current_limit_from_accounts" . get_agent_current_limit_from_accounts();
    if (current_pnr_issue_status() == 0) {
        if (get_debit_amount_from_accounts() != 0 || RT_WBS_AGENT_ID() == 1) {
            if (!empty(get_agent_sub_agent_single_permission(21)->permission_Id) || RT_BK_WBS_AGENT_RIGHTS() == 1) {
                ?>
                <a href="#verify_password" data-toggle="modal"  class="btn btn-success btn-xs issueTkt" id="pnrdownload" style="width:9%">Issue Ticket</a>
                <!--DIALOG FOR ISSUE TICKET PASSWORD VERIFICATION-->
                <div id="verify_password" class="modal fade" >
                    <div class="modal-dialog" style="width: 50%;">
                        <div class="modal-content">
                            <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                                <h5 class="modal-title">Verify Password</h5>
                                <style>
                                    .ui-autocomplete{ z-index: 99999 !important; }
                                </style>

                            </div>
                            <div class="modal-body verify_password">
                                <div class="form-horizontal">
                                    <div class="form-horizontal filters dlog-msg-show-error fielderror" style="display: none;">
                                        <span class="dlog-msg-error" style="display: none;">Your Password Is Wrong ?.Please Enter Correct Password !</span>
                                    </div>
                                    <div class="form-group passField">
                                        <div class="col-sm-6">
                                            Enter Password :<span style="color: red; margin-left:5px;">*</span><br>
                                            <input type="password" name="pwd" id="pwd" class="form-control pwd clrValues" />
                                        </div>
                                        <br>
                                        <button id="verifyPassword" class="btn btn-info" onclick="verifyPassword()">Verify Now</button>
                                    </div>

                                    <div class="form-group hideFields" style="display: none;">
                                        <div class="col-sm-6">
                                            Receivable Account :<span style="color: red; margin-left:5px;">*</span><br>
                                            <input type="text" name="receivableClient" id="receivableClient" class="form-control receivableClient clrValues" />
                                            <input type="hidden" name="receivableId" id="receivableId" class="receivableId clrValues" />
                                            <input type="hidden" name="receivableCode" id="receivableCode" class="receivableCode clrValues" />
                                        </div>
                                        <div class="col-sm-6">
                                            FOP :<span style="color: red; margin-left:5px;">*</span><br>
                                            <input type="text" name="FOPID" id="FOPID" class="form-control FOPID clrValues"  value="" readonly="true"/>
                                        </div>
                                    </div>
                                    <div class="form-group hideFields" style="display: none;">
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            Amount :<span style="color: red; margin-left:5px;">*</span><br>
                                            <input type="text"  id="typeAmount" class="form-control clrValues" readonly="readonly" />
                                        </div>
                                        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                            Retype Amount :<span style="color: red; margin-left:5px;">*</span><br>
                                            <input type="text" name="reTypeAmount" id="reTypeAmount" class="form-control reTypeAmount clrValues" />
                                        </div>
                                    </div>
                            
                                    <?php
                                    if (current_pnr_issue_status() == 0) {
                                        if (get_debit_amount_from_accounts() != 0 || RT_WBS_AGENT_ID() == 1) {
                                            if (!empty(get_agent_sub_agent_single_permission(21)->permission_Id) || RT_BK_WBS_AGENT_RIGHTS() == 1) {
                                                ?>
                                                                                                <!--<a href="RT_Agent/issue_ticket/<?php //echo bkend_url_query_encode($segment_array);     ?>" class="btn btn-success btn-xs issueTicket hideFields" id="pnrdownload" style="width:9%; display: none;">Issue Ticket</a>-->
                                                <div class="form-group hideFields" style="display: none;">
                                                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                        <br>
                                                        <button class="btn btn-success btn-xs hideFields" id="issueTicket" style="width:45%; display: none;">Issue Ticket</button>
                                                    </div>
                                                </div>
                                                <?php
                                            }
                                        }
                                    }
                                    ?>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-default closeModel" data-dismiss="modal" id="closeModel">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            

                <!--DIALOG FOR ISSUE TICKET PASSWORD VERIFICATION-->
                                <!--<a href="RT_Agent/issue_ticket/<?php echo bkend_url_query_encode($segment_array); ?>" class="btn btn-success btn-xs" id="pnrdownload" style="width:9%">Issue Ticket</a>-->
                <?php
            }
        } else {
            ?>
            <script type="text/javascript">
                $(document).ready(function () {
                    var colors = ['red', 'pink', 'crimson', 'firebrick', 'DarkRed'];
                    var colorIndex = 1;
                    setInterval(function () {
                        $('#updatePayment').css('color', colors[colorIndex]);
                        $("#updatePayment").css("font-size", "12px");
                        if (colorIndex < colors.length)
                            colorIndex += 1;
                        else
                            colorIndex = 1;
                    }, 2000);

                    //                    setInterval(function () {
                    //                        $("#updatePayment").is(":visible") ? $("#updatePayment").fadeIn() : $("#updatePayment").fadeOut();
                    //                    }, 3000);

                });
            </script>
            <span style='color:red;font-size: 12px;' class="updatePayment" id="updatePayment">Please Contact Us: +92-51-111-768-785, Email: info@rehmantravel.com</span>
            <?php
        }
    }
    if (!empty(get_agent_sub_agent_single_permission(22)->permission_Id) || RT_WBS_AGENT_ID() == 1) {
        ?>
        <a href="javascript:printTktPnr('printdivId')" class="btn btn-success btn-xs" style="width:9%">Print</a>
    <?php } if (!empty(get_agent_sub_agent_single_permission(34)->permission_Id) || RT_WBS_AGENT_ID() == 1) { ?>
        <a href="Pdfgenerator/create_send_email_pdf/<?php echo bkend_url_query_encode($pdf_html) ?>/<?php echo bkend_url_query_encode($segment_array) ?>/send" class="btn btn-success btn-xs" id="pnrdownload" style="width:9%">Email</a>
    <?php } if (!empty(get_agent_sub_agent_single_permission(33)->permission_Id) || RT_WBS_AGENT_ID() == 1) { ?>
        
        <a href="Pdfgenerator/create_send_email_pdf/<?php echo bkend_url_query_encode($pdf_html) ?>/<?php echo bkend_url_query_encode($segment_array) ?>/pdf" class="btn btn-success btn-xs" id="pnrdownload" style="width:9%">Download</a>
    <?php } ?>
</div>
</div> </div> </div> </div>
<input  type="hidden" id="sabre_pnr" name="sabre_pnr" value="<?php echo $this->uri->segment(4); ?>" />

<script>
    $(document).ready(function () {
        setInterval(function () {
            $("#msg_error").css("display", "none");
        }, 3000);
        $(".Email").on("click", function () {
            var pnrId = $(".pnrId").val();
            var sendId = $(".sendId").val();
            $.ajax({
                type: "POST",
                url: "Pdfgenerator/generator_pdf",
                data: {pnrId: pnrId, sendId: sendId},
                success: function (data) {
                    alert(data);
                }
            });
        });

        $("#addMarkup").click(function () {
            if ($("#addPrcnTgVal").val() != '') {
                var addPrcnTg = $("#addPrcnTg").val();
                var TotalFare = $("#addPrcnTgVal").val();
                window.location = "RT_Agent/add_markup_on_fare/<?php echo bkend_url_query_encode($segment_array); ?>/" + addPrcnTg + "/" + TotalFare + '/sv';
            }
        });
        $("#btnReset").click(function () {
            window.location = "RT_Agent/add_markup_on_fare/<?php echo bkend_url_query_encode($segment_array); ?>/0/0/reset";
        });


        $('.addPrcnTg').on("keypress", function (e) {
            var TotalFare = 0;
            var addPrcnTg = 0;
            if (e.keyCode == 13) {
                var TotalFareAmt = Number($("#TotalFateVl").val());
                if ($("#addPrcnTg").val() != '' && $("#addPrcnTg").val() != 0) {
                    addPrcnTg = Number($("#addPrcnTg").val());
                    TotalFare = (TotalFareAmt * addPrcnTg) / 100;
                }
                $("#addPrcnTgVal").val(TotalFare);
            }
        });

        $('#addPrcnTgVal').on("keypress", function (e) {
            var TotalFare = 0;
            var addPrcnTg = 0;
            if (e.keyCode == 13) {
                var TotalFareAmt = Number($("#TotalFateVl").val());
                if ($("#addPrcnTgVal").val() != '' && $("#addPrcnTgVal").val() != 0) {
                    TotalFare = Number($("#addPrcnTgVal").val());
                    addPrcnTg = (100 * $("#addPrcnTgVal").val()) / TotalFareAmt;
                }
                $("#addPrcnTg").val(Math.round(addPrcnTg, 2));
            }
        });

        $(".issueTkt").click(function () {
            $(".clrValues").val('');
            $(".hideFields").hide();
            $(".passField").show();
            var amount = $("#TotalBasicFareAmount").val();
            $("#typeAmount").val(amount);
        });
        /////////////////// Link on Issue Ticket
        $("#issueTicket").click(function () {
            var Flag = confirm("Are You Sure !. You Want To Issue ETicket ?");
            if (Flag == true) {
                var chkString = /^[A-Za-z]{3,50}$/;
                var receivableID = $("#receivableId").val();
                var recCode = $("#receivableCode").val();
                var amount = $("#typeAmount").val();
                var FOPID = $("#FOPID").val();
                var reTypeAmount = $("#reTypeAmount").val();
                if (receivableID != '' && reTypeAmount != '' && reTypeAmount == amount) {
                    var addPrcnTg;
                    var TotalFare;
                    if ($("#addPrcnTg").val() != '') {
                        addPrcnTg = $("#addPrcnTg").val();
                    } else {
                        addPrcnTg = 0;
                    }
                    if ($("#addPrcnTgVal").val() != '') {
                        TotalFare = $("#addPrcnTgVal").val();
                    } else {
                        TotalFare = 0;
                    }
                    window.location = "RT_Agent/issue_ticket/<?php echo bkend_url_query_encode($segment_array); ?>/" + receivableID + "/" + recCode + "/" + addPrcnTg + "/" + TotalFare + "/" + FOPID;
                } else {
                    if (receivableID == "") {
                        var msg = "Please select accounts and then try .....!";
                    }
                    if (reTypeAmount == '' || reTypeAmount != amount) {
                        var msg = "Please Enter Correct Amount";
                    }
                    if (FOPID == '') {
                        var msg = "Please Enter Form Of Payment";
                    } else if (!chkString.test(FOPID)) {
                        var msg = "Please Enter Valid  Form Of Payment";
                    }

                    $(".dlog-msg-error").html(msg);
                    $(".dlog-msg-show-error").addClass("fielderror");
                    $('.dlog-msg-show-error, .dlog-msg-error').fadeIn('fast');
                    setTimeout(function () {
                        $('.dlog-msg-show-error, .dlog-msg-error').fadeOut('fast');
                    }, 3000);
                    return false
                }
            } else {
                return false;
            }

        });
        /////////////////// Autocomplete Functions
        $("#receivableClient").autocomplete({
            minLength: 0,
            source: "RT_Booking/get_receivable_client/",
            autoFocus: true,
            scroll: true,
            dataType: 'jsonp',
            select: function (event, ui) {
                $("#FOPID").val(ui.item.accountTitle);
                $("#receivableId").val(ui.item.id);
                $("#receivableCode").val(ui.item.code);
                
            }
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
        /// Payable
        $("#payableClient").autocomplete({
            minLength: 0,
            source: "RT_Booking/get_payable_airline/",
            autoFocus: true,
            scroll: true,
            dataType: 'jsonp',
            select: function (event, ui) {
//                alert(ui.item.id);
                $("#payableId").val(ui.item.id);
                $("#payableCode").val(ui.item.code);
            }
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
        /// Profit Loss
        $("#profitLoss").autocomplete({
            minLength: 0,
            source: "RT_Booking/get_profit_loss/",
            autoFocus: true,
            scroll: true,
            dataType: 'jsonp',
            select: function (event, ui) {
//                alert(ui.item.id);
                $("#profitLossId").val(ui.item.id);
                $("#profitLossCode").val(ui.item.code);
            }
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
        ////////////////////
    });

    // Verify Password
    function verifyPassword() {
        if ($("#pwd").val() == '') {
            $(".dlog-msg-error").html("Please provide password and then verify!");
            $(".dlog-msg-show-error").addClass("fielderror");
            $('.dlog-msg-show-error, .dlog-msg-error').fadeIn('fast');
            setTimeout(function () {
                $('.dlog-msg-show-error, .dlog-msg-error').fadeOut('fast');
            }, 3000);
            return false
        } else {
            $.ajax({
                url: "RT_Agent/CHECKED_PWD",
                type: "post",
                data: {pwd: $("#pwd").val()},
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data === 1) {
                        $(".hideFields").show();
                        $(".passField").hide();
                    } else {
                        $(".hideFields").hide();
                        $(".dlog-msg-error").html("Your Password Is Wrong ?.Please Enter Correct Password !");
                        $(".dlog-msg-show-error").addClass("fielderror");
                        $('.dlog-msg-show-error, .dlog-msg-error').fadeIn('fast');
                        setTimeout(function () {
                            $('.dlog-msg-show-error, .dlog-msg-error').fadeOut('fast');
                        }, 3000);
                        return false;
                    }
                }
            });
        }
    }
       
</script>

<?php 
$sbr_pnr = "EGRFLF";
            $where = array(
                "fbk.abacusPnr" => $sbr_pnr,
            );

?>

<a href="Pdfgenerator/e_mail/<?php echo bkend_url_query_encode(get_issue_ab_pnr($where)); ?>" class="btn btn-success btn-xs" id="pnrdownload" style="width:9%">Download PDF</a>