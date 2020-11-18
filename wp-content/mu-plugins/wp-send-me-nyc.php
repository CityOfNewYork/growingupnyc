<?php

/**
 * Plugin Name:  NYCO Send Me NYC for WordPress
 * Description:  A developer plugin for WordPress that enables sharing website links via SMS or Email.
 * Author:       Blue State Digital, maintained by NYC Opportunity
 * Text Domain:  smnyc
*/

require plugin_dir_path(__FILE__) . '/wp-send-me-nyc/SendMeNYC.php';
require plugin_dir_path(__FILE__) . '/guny-smnyc/SmsMeGen.php';
require plugin_dir_path(__FILE__) . '/guny-smnyc/SmsMeGunyc.php';

/**
 * Initialize plugin
 */

$contact = new SMNYC\ContactMe();
$sms = new SMNYC\SmsMeGen();
$sms_gunyc = new SMNYC\SmsMeGunyc();
$email = new SMNYC\EmailMe();

/**
 * Register post types for the email and SMS templates.
 */
add_action('init', function() use ($email, $sms, $sms_gunyc) {
  $email->registerPostType();
  $sms_gunyc->registerPostType();
  $sms->registerPostType();
});

/**
 * SmsMe and EmailMe extend ContactMe. Each have settings that inherit some
 * settings from ContactMe. ContactMe was created for any generic email client
 * but EmailMe extends it for use with Amazon SES and adds additional settings
 * for. Bitly settings can be found in the ContactMe class. SmsMe creates the
 * configuration and api for Twilio.
 */
add_action('admin_init', function() use ($contact, $sms, $sms_gunyc, $email) {
  $contact->createBitlySection();
  $sms_gunyc->createSettingsSection();
  $sms->createSettingsSection();
  $email->createSettingsSection();
});
