<?php
namespace SMNYC;

require_once plugin_dir_path( __FILE__ ) . 'ContactMe.php';
require plugin_dir_path( __FILE__ ) . '/third-party/twilio-php/Twilio/autoload.php';

use Twilio\Rest\Client;
use Twilio\Exceptions\RestException as TwilioErr;

class SMSMe extends ContactMe {
	protected $action = 'SMS'; //nonce and ajax key for what this class provides
	protected $service = 'Twilio'; //name used in settings/options keys

	protected $account_label = 'SID';
	protected $secret_label = 'Token';
	protected $from_label = 'Sender Phone Number';

	protected $account_hint = 'ACe2e6da9551443cf409e4f41f2c834a9e';
	protected $secret_hint ='ee59f461a2f041a30653e5f27fef72c5';
	protected $from_hint ='+3392982642';

	protected function content( $url, $page , $sharetext ) {
		if ( $page == self::RESULTS_PAGE ) {
			// return 'REMINDER: you may be eligible for these NYC Programs: '.$url.' '.$sharetext;
			return $sharetext.' '.$url;
		} else {
			return $sharetext.' '.$url;
		}
	}

	protected function send( $to, $msg ) {
		try {
			$client = new Client( get_option('smnyc_twilio_user'), get_option('smnyc_twilio_secret'));
			$sms = $client->messages->create(
				$to, ['from' => get_option( 'smnyc_twilio_from' ), 'body'=> $msg ]
			);
		} catch ( TwilioErr $e ) {
			return $this->parse_error( $e->getCode() );
		}
		if ( $sms->status == 'failed' || $sms->status == 'undelivered' || $sms->errorCode || $sms->errorMessage  ) {
			return $this->parse_error( $sms->errorCode, $sms->errorMessage );
		}
		/* $sms properties:
			sid,dateCreated,dateUpdated,dateSent,accountSid,from,to,body,
			numMedia,numSegments,status,errorCode,errorMessage,direction,price,
			priceUnit,apiVersion,uri,subresourceUris
		*/
	}


	protected function valid_recipient( $to ) {
		$to = preg_replace( '/\D/', '', $to ); //strip all non-numbers

		// grab user's number
		if (empty( $to )) {
			$this->failure( 1, 'Phone number must be supplied' );
		} elseif ( strlen( $to ) < 10 ) {
			$this->failure( 2, 'Invalid phone number. Please provide 10-digit number with area code' );
		} elseif ( strlen( $to ) === 10 ) {
			$to = '1' . $to; // US country code left off
		}
		//assume longer numbers have country code specified
		return '+'.$to;		
	}

	protected function parse_error( $code, $message = 'An error occurred while sending' ) {
		$retry = false;

		switch ( $code ) {
			case 14101: case 21211: case 21612:
			case 21408: case 21610: case 21614:
			case 30003: case 30004: case 30005:
			case 30006: // ^ Something wrong/invalid with 'To' number
				$message = 'Unable to send to number provided. Please use another number';
				break;
			case 21611: //our outbox queue is full
				$retry = true;
				$message = 'Please try again later';
				break;
			case 14103: case 21602: case 21617:
			case 21618: case 21619: case 30007:
				$message = 'Invalid message body';
				break;
			case 30001: 
			case 30009://ephemeral errors that a retry might solve https://www.twilio.com/docs/api/rest/message#error-values
				$retry = true;
				break;
			default:
				$message = 'An error occurred during delivery';
				break;
		}
		$this->failure( $code, $message, $retry );
	}

}
