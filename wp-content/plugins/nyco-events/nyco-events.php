<?php

/**
 *
 * @link              https://github.com/CityOfNewYork
 * @since             1.0.0
 * @package           Nyco_Events
 *
 * @wordpress-plugin
 * Plugin Name:       NYCO Events
 * Plugin URI:        https://github.com/CityOfNewYork/nyco-events
 * Description:       Creates Events by pulling events from RSS feeds.
 * Version:           1.0.0
 * Author:            Mayor's Office for Economic Opportunity
 * Author URI:        https://github.com/CityOfNewYork
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       nyco-events
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
  die;
}

defined( 'ABSPATH' ) || die();

define( 'NYCO_EVENTS_VERSION', '1.0.0' );
define( 'NYCO_EVENTS_SLUG', 'nyco-events' );
define( 'NYCO_EVENTS_PLUGIN', __FILE__ );
define( 'NYCO_EVENTS_PATH', dirname( __FILE__ ) . '/' );
define( 'NYCO_EVENTS_INC', NYCO_EVENTS_PATH . 'includes/' );
wp_enqueue_style( 'nyco-events-styles', plugins_url( 'assets/css/style.css' , __FILE__ ) );


if( !function_exists( 'is_plugin_active' ) ) {
  require_once ABSPATH . 'wp-admin/includes/plugin.php';
}

/* Throw error if Events Calendar Pro is not active*/
if ( !is_plugin_active('events-calendar-pro/events-calendar-pro.php' ) ) {
  add_action( 'all_admin_notices', 'nyco_events_notice' );  
}


// require external files
require_once NYCO_EVENTS_INC . 'settings.php';
require_once NYCO_EVENTS_INC . 'functions.php';

