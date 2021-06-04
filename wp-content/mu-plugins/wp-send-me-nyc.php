<?php

/**
 * Plugin Name: NYCO Send Me NYC for WordPress
 * Description: A developer plugin for WordPress that enables sharing website links via SMS or Email.
 * Author:      Blue State Digital, maintained by NYC Opportunity
 * Text Domain: smnyc
 */

require plugin_dir_path(__FILE__) . '/wp-send-me-nyc/SendMeNYC.php';

/**
 * Initialize plugin
 *
 * @author NYC Opportunity
 */

$contact = new SMNYC\ContactMe();
$smsGen = new SMNYC\SmsMe();
$smsGu = new SMNYC\SmsMe();
$email = new SMNYC\EmailMe();

$smsGen->action = 'SMS_GEN';
$smsGen->prefix = 'smnyc_gen';
$smsGen->post_type = 'smnyc-sms';
$smsGen->action_label = 'Generation SMS';
$smsGen->post_type_label = 'Generation NYC SMS';
$smsGen->post_type_description = 'SMS content for the Send Me NYC plugin';
$smsGen->post_type_name = 'Generation SMS';
$smsGen->post_type_name_singular = 'Generation SMS';

$smsGu->action = 'SMS_GUNYC';
$smsGu->prefix = 'smnyc_gu';
$smsGu->post_type = 'smnyc-sms-gunyc';
$smsGu->action_label = 'Growing Up SMS';
$smsGu->post_type_label = 'Growing Up NYC SMS';
$smsGu->post_type_description = 'SMS content for the Send Me NYC plugin';
$smsGu->post_type_name = 'Growing Up SMS';
$smsGu->post_type_name_singular = 'Growing Up SMS';

/**
 * Register post types for the email and SMS templates.
 *
 * @author NYC Opportunity
 */
add_action('init', function() use ($smsGen, $smsGu) {
  $smsGen->registerPostType()->createEndpoints();
  $smsGu->registerPostType()->createEndpoints();
});

/**
 * SmsMe and EmailMe extend ContactMe. Each have settings that inherit some
 * settings from ContactMe. ContactMe was created for any generic email client
 * but EmailMe extends it for use with Amazon SES and adds additional settings
 * for. Bitly settings can be found in the ContactMe class. SmsMe creates the
 * configuration and api for Twilio.
 *
 * @author NYC Opportunity
 */
add_action('admin_init', function() use ($contact, $smsGen, $smsGu) {
  $contact->createBitlySection();
  $smsGen->createSettingsSection();
  $smsGu->createSettingsSection();
});
