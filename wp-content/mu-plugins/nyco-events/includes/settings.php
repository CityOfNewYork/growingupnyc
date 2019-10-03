<?php 

add_action( 'admin_init', 'register_nyco_events_settings' );
add_action( 'admin_menu', 'nyco_events_menu' );
add_action( 'wp_enqueue_scripts', 'nyco_events_menu' );


function nyco_events_notice() {
  printf(
    '<div id="message" class="error"><p>%s</p></div>',
    'Sorry, in order to activate NYCO Events, you must first activate Events Calendar Pro.'
  );
}

/* Settings for NYCO Events*/
function nyco_events_menu() {
    add_menu_page(
      'RSS Feeds',
      'NYCO Events Settings',
      'manage_options',
      'nyco-events',
      'nyco_events_settings_page',
      'dashicons-smiley'
    );
    add_submenu_page(
      'nyco-events',
      'NYCO Events Settings',
      'RSS Feeds',
      'manage_options',
      'nyco-events'
    );
    add_submenu_page( 
      'nyco-events', 
      'Import Events', 
      'Import Events',
      'manage_options', 
      'import-events',
      'nyco_events_import'
    );
}

/* Settings */
function nyco_events_settings_page() {
  require_once NYCO_EVENTS_PATH . 'templates/settings.php';
}

function register_nyco_events_settings() {
  register_setting( 'nyco-events-rss-group', 'rss_name' );
  register_setting( 'nyco-events-rss-group', 'rss_url' );
}

function nyco_events_import() {
  get_rss_events();
}
