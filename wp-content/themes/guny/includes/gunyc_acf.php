<?php
/**
 * add validation on cta phone number on topics page
 */
add_filter('acf/validate_value/name=cta_button_phone', 'my_acf_validate_cta_button_phone', 10,4);

function my_acf_validate_cta_button_phone( $valid, $value){
  // if the value entered is not 10 characters long
  if( $value ) {
    // checks that there are no letters
    if(preg_match( '/[a-zA-Z]/', $value )){
      $valid = 'Phone Number can only contain integers';
      return $valid;
    }
    // check that value is within 10 or 11 digits
    if ((strlen($value) < 10 ) or (strlen($value) > 11)){
      $valid = 'Phone Number must be 10 or 11-digits';
      return $valid;
    }
    // return valid if the value is between 10 and 11 digits
    else{
      return $valid;
    }
  }
  // return valid if the field is empty
  else{
    return $valid;
  }
}