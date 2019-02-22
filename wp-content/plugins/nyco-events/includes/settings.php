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
      'NYCO Events Settings',
      'NYCO Events Settings',
      'manage_options',
      'nyco-events',
      'nyco_events_settings_page',
      'dashicons-smiley'
    );
    // add_submenu_page( 
    //   'nyco-events', 
    //   'Manage RSS Feeds', 
    //   'Manage RSS Feeds',
    //   'manage_options', 
    //   'my-top-level-slug'
    // );

  //call register settings function
  add_action( 'admin_init', 'register_mysettings' );
}

/* Settings */
function nyco_events_settings_page() {
  __( 'Admin Page Test', 'textdomain' );
  echo '<div class="wrap">';
  echo '  <h1>NYCO Events Settings</h1>';
  printf(
    '<div><p>%s</p></div>',
    'Add all the RSS feeds that you would like to use to pull events.'
  );
  echo '  <form method="post" action="options.php">';

  settings_fields( 'rss-group' );
  do_settings_sections( 'rss-group' );
  
  // settings form
  echo '<table>';
  echo '  <tr>';
  echo '  <th>RSS Feed Name</th>';
  echo '  <th>RSS Feed URL</th>';
  echo '  </tr>';
  echo '  <tr>';
  echo '  <td><input type="text" name="rss_name" value="'.get_option('rss_name').'" placeholder="RSS Feed Name"/></td>';
  echo '  <td><input type="text" name="rss_url" value="'.get_option('rss_url').'" placeholder="RSS Feed URL"/></td>';
  echo '  </tr>';
  echo '</table>';
  // echo '<button class="add-rss">Add Another</button>';
  // echo '<button class="remove-rss">Remove</button>';

  submit_button();

  echo '  </form>';
  echo '</div>';

  // get the events associated with the rss feed
  get_rss_events();
}

function register_nyco_events_settings() {
  register_setting( 'rss-group', 'rss_name' );
  register_setting( 'rss-group', 'rss_url' );
}
