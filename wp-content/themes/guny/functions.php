<?php

// Notifications
require_once(get_template_directory() . '/includes/notifications.php');

Notifications\timber();
Notifications\custom_post_types();

class GunySite extends TimberSite {

  function __construct() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'menus' );
    add_action( 'init', array( $this, 'cleanup_header' ) );
    add_action( 'init', array( $this, 'add_menus' ) );
    add_action( 'init', array( $this, 'add_options_page' ) );
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );
    add_action( 'wp_enqueue_scripts', array( $this, 'add_styles_and_scripts' ), 999 );
    add_action( 'widgets_init', array( $this, 'add_sidebars' ) );
    parent::__construct();
  }

  function cleanup_header() {
    remove_action( 'wp_head', 'rsd_link' );
    remove_action( 'wp_head', 'wlwmanifest_link' );
    remove_action( 'wp_head', 'index_rel_link' );
    remove_action( 'wp_head', 'wp_generator' );
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );
    remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
    remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
    remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
    add_filter( 'tiny_mce_plugins', 'guny_disable_emojis_tinymce' );
  }

  /**
  * Returns a list of upcoming events
  * @param {integer} $num_events - Total number of events to return
  * @param {array} $tax_query - (Optional) Set of taxonomy query params to include in the event query
  * @param {boolean} $featured_first - Whether to first query for featured events and display them at the top of the list
  * @return Array of GunyEvent objects
  */
  public static function get_featured_events($num_events = 3, $tax_query = null, $featured_first = true) {
    $top_events = array();
    // Get Featured Events in order of ascending date
    if (function_exists('tribe_get_events')) {
      if ($featured_first) {
        $top_event_params = array(
          'posts_per_page' => $num_events,
          'eventDisplay' => 'list',
          'meta_query' => array(
            'relation' => 'AND',
            array(
              'key'     => 'featured_event',
              'value'   => 'Yes',
              'compare' => 'LIKE'
            )
          ),
        );
        if ( !empty( $tax_query ) ) {
          $top_event_params['tax_query'] = $tax_query;
        }
        $top_events = tribe_get_events( $top_event_params );
      }

      // Get remaining events if count of Featured Events is less than $num_events
      $number_remaining = $num_events - count($top_events);
      if( $number_remaining > 0 ) {
        $top_remaining_params = array(
          'posts_per_page' => $number_remaining,
          'eventDisplay' => 'list',
        );
        if ($featured_first) {
          $top_remaining_params['meta_query'] = array(
            'relation' => 'AND',
            array(
              'key'     => 'featured_event',
              'value'   => 'Yes',
              'compare' => 'NOT LIKE'
            )
          );
        }
        if ( !empty( $tax_query ) ) {
          $top_remaining_params['tax_query'] = $tax_query;
        }
        $top_events_remaining = tribe_get_events( $top_remaining_params );

        // Combine arrays with Featured Events first
        $top_events = array_merge($top_events, $top_events_remaining);
      }
      foreach($top_events as $i => $top_event) {
        $top_events[$i] = new GunyEvent($top_event);
      }
    }
    return $top_events;
  }

  function add_to_context ( $context ) {
    $context['menu'] = new TimberMenu('header-menu');
    $context['footer_menu_primary_additional'] = new TimberMenu('footer-menu-additional');
    $context['footer_menu_right'] = new TimberMenu('footer-menu-right');
    $context['ms_menu'] = new TimberMenu('ms-header-menu');
    $context['ms_footer_menu_primary_additional'] = new TimberMenu('ms-footer-menu-additional');
    $context['ms_footer_menu_right'] = new TimberMenu('ms-footer-menu-right');
    $context['footer_menu_left'] = new TimberMenu('footer-menu-left');
    $context['site'] = $this;
    $context['age_menu'] = Timber::get_terms('age_group', array(
      'orderby' => 'term_order',
      'hide_empty' => false,
      'parent' => 0,
      'meta_key' => 'include-in-age-picker',
      'meta_value' => 1
    ) );
    $context['top_programs'] = Timber::get_widgets('top_programs_widgets');
    if (is_front_page()) {
      $context['top_widget'] = Timber::get_widgets('top_widget');
    }
    $context['top_events'] = $this->get_featured_events(3);
    $context['options'] = get_fields('options');
    if (!empty($context['options']) && !empty($context['options']['current_banner'])) {
      $context['options']['current_banner'] = new TimberPost($context['options']['current_banner']);
    }
    $context['is_archive'] = is_archive();
    $context['current_url'] = strtok($_SERVER["REQUEST_URI"],'?');
    return $context;
  }

  function add_styles_and_scripts() {
    global $wp_styles;

    if (!is_admin()) {
      wp_deregister_script('jquery');
      wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/modernizr.js', array(), '3.0.0', false );
      wp_enqueue_script( 'jquery', get_template_directory_uri() . '/src/js/vendor/jquery.js', array(), '2.1.14', false );
      wp_enqueue_script( 'owl-js', get_template_directory_uri() . '/src/js/vendor/owl.carousel.min.js', array(), '2.2.1', true );
      // Main 'source' script is enqueued in template base
      wp_enqueue_script( 'google-map', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDrvNnQZBiASAH3JI7LNFewrX9jeYZlMWo', array(), '3', true );
      wp_enqueue_script( 'google-map-init', get_template_directory_uri() . '/src/js/vendor/google-maps.js', array('google-map', 'jquery'), '0.1', true );
    }
  }

  function add_sidebars() {
    register_sidebar(array(
      'id' => 'footer_widgets',
      'name' => __('Footer'),
      'description' => __('Widgets in the site global footer'),
      'before_widget' => '',
      'after_widget' => ''
    ));
    register_sidebar(array(
      'id' => 'top_programs_widgets',
      'name' => __('Top Programs'),
      'description' => __('Manually selected top programs'),
      'before_widget' => '',
      'after_widget' => ''
    ));
    register_sidebar( array(
      'name' => 'Top Widget Area',
      'id' => 'top_widget',
      'before_widget' => '<div class="c-language-switcher-wrapper"><div class="o-container c-language__switcher">',
      'after_widget' => '</div></div>',
      'before_title' => '<h2 class="rounded">',
      'after_title' => '</h2>',
    ));

  }

  function add_menus() {
    register_nav_menus(
      array(
        'header-menu' => __( 'Header and Footer Primary Menu' ),
        'footer-menu-additional' => __( 'Footer Primary Additional [left]' ),
        'footer-menu-right' => __( 'Footer Tertiary [right]' ),
        'ms-header-menu' => __( 'MS Header and Footer Primary Menu' ),
        'ms-footer-menu-additional' => __( 'MS Footer Primary Additional [left]' ),
        'ms-footer-menu-right' => __( 'MS Footer Tertiary [right]' ),
        'footer-menu-left' => __( 'Footer Secondary [left]' )
      )
    );
  }

  // Add ACF Options Page
  function add_options_page() {
    if( function_exists('acf_add_options_page') ) {
      acf_add_options_page(array(
        'page_title'  => 'Theme General Settings',
        'menu_title'  => 'Theme Settings',
        'menu_slug'   => 'theme-general-settings',
        'capability'  => 'edit_posts',
        'redirect'    => false
      ));
    }
  }
}
new GunySite();

/**
* Extends TimberPost to include functionality provided by The Events Calendar
*/
class GunyEvent extends TimberPost {
  private $_event_type;
  private $_venue_address;
  private $_google_dir_link;

  public function event_schedule_details() {
    if (function_exists('tribe_events_event_schedule_details')) {
      return tribe_events_event_schedule_details($this->ID);
    }
  }

  public function event_cost() {
    if (function_exists('tribe_get_cost')) {
      return tribe_get_cost($this->ID, true);
    }
  }

  public function google_map_link() {
    if (function_exists('tribe_get_map_link')) {
      return tribe_get_map_link($this->ID);
    }
  }

  public function google_directions_link() {
    if ( !isset( $this->_google_dir_link ) ) {
      $maps_link = $this->google_map_link();
      if ( empty( $maps_link ) ) {
        $this->_google_dir_link = false;
      } else {
        if ( strpos( $maps_link, 'maps.google.com' ) !== false ) {
          $this->_google_dir_link = str_replace( '&#038;q', '&#038;daddr', $maps_link, $count );
        } elseif ( strpos( $maps_link, 'google.com/maps' ) !== false ) {
          $this->_google_dir_link = str_replace( '/place/', '/dir//', $maps_link );
        } else {
          $this->_google_dir_link = $maps_link;
        }
      }
    }
    return $this->_google_dir_link;
  }

  public function current_month_text() {
    if (function_exists('tribe_get_current_month_text')) {
      return tribe_get_current_month_text();
    }
  }

  public function tribe_get_previous_month_link() {
    if (function_exists('tribe_get_previous_month_link')) {
      return tribe_get_previous_month_link();
    }
  }

  public function tribe_get_next_month_link() {
    if (function_exists('tribe_get_next_month_link')) {
      return tribe_get_next_month_link();
    }
  }

  public function all_day() {
    if (function_exists('tribe_event_is_all_day')) {
      return tribe_event_is_all_day($this->ID);
    }
  }

  public function multiday() {
    if (function_exists('tribe_event_is_multiday')) {
      return tribe_event_is_multiday($this->ID);
    }
  }

  public function start_datetime() {
    if (function_exists('tribe_get_start_date')) {
      return tribe_get_start_date($this->ID, true, 'U');
    }
  }

  public function end_datetime() {
    if (function_exists('tribe_get_end_date')) {
      return tribe_get_end_date($this->ID, true, 'U');
    }
  }

  public function start_date_full() {
    if (function_exists('tribe_get_start_date')) {
      return date_i18n( __('l, F j', 'guny-date-formats'), $this->start_datetime());
    }
  }

  public function end_date_full() {
    if (function_exists('tribe_get_end_date')) {
      return date_i18n( __('l, F j', 'guny-date-formats'), $this->end_datetime());
    }
  }

  public function start_date_formatted() {
    // TODO - format for user's timezone (possibly with JS)
    if (function_exists('tribe_get_start_date')) {
      $date = new DateTime('now', new DateTimeZone('America/New_York'));
      $today = $date->format('Y-m-d');
      $tomorrow = $date->modify('+1 day')->format('Y-m-d');
      $start_time = date_i18n(__('Y-m-d', 'guny-date-formats'), $this->start_datetime());

      if ($start_time == $today ) {
        $time = __('today', 'guny-events');
      } else if ($start_time == $tomorrow) {
        $time = __('tomorrow', 'guny-events');
      } else {
        $time = '<span class="event-day">' .
            date_i18n( __('l ', 'guny-date-formats') , $this->start_datetime()) .
          '</span>' .
          '<span class="event-month-date">' .
            date_i18n( __('M j', 'guny-date-formats'), $this->start_datetime()) .
          '</span>';
      }

      return $time;
    }
  }

  public function end_date_formatted() {
    // TODO - format for user's timezone (possibly with JS)
    if (function_exists('tribe_get_end_date')) {
      $date = new DateTime("now", new DateTimeZone('America/New_York'));
      $today = $date->format('Y-m-d');
      $tomorrow = $date->modify('+1 day')->format('Y-m-d');
      $end_time = date(__('Y-m-d', 'guny-date-formats'), $this->end_datetime());

      if ($end_time == $today ) {
        $time = __('today', 'guny-events');
      } else if ($end_time == $tomorrow) {
        $time = __('tomorrow', 'guny-events');
      } else {
        $time = date(__('l M j', 'guny-date-formats'), $this->end_datetime());
      }

      return $time;
    }
  }

  public function schedule_details() {
    if (function_exists('tribe_events_event_schedule_details')) {
      return tribe_events_event_schedule_details($this->ID);
    }
  }

  public function event_website() {
    if (function_exists('tribe_get_event_website_url')) {
      return tribe_get_event_website_url($this->ID);
    }
  }

  public function venue() {
    if (function_exists('tribe_get_venue')) {
      return tribe_get_venue($this->ID);
    }
  }

  public function venue_address() {
    if (!$this->_venue_address && function_exists('tribe_get_address')) {
      $this->_venue_address = array();
      $this->_venue_address['address'] = tribe_get_address($this->ID);
      $this->_venue_address['city'] = tribe_get_city($this->ID);
      $this->_venue_address['region'] = tribe_get_region($this->ID);
      $this->_venue_address['country'] = tribe_get_country($this->ID);
      $this->_venue_address['zip'] = tribe_get_zip($this->ID);
      $this->_venue_address['full_region'] = tribe_get_full_region($this->ID);
      $this->_venue_address['phone'] = tribe_get_phone();
      $this->_venue_address['website'] = tribe_get_venue_website_link();
    }
    return $this->_venue_address;
  }

  public function venue_map() {
    if (function_exists('tribe_get_embedded_map')) {
      return tribe_get_embedded_map();
    }
  }

  public function is_new_event_day() {
    if (function_exists('tribe_is_new_event_day')) {
      return tribe_is_new_event_day();
    }
  }

  public function image() {
    if ( !empty( $this->event_photo ) ) {
      return new TimberImage($this->event_photo);
    }
    return false;
  }

  public function organizer() {
    if ( function_exists( 'tribe_get_organizer' ) ) {
      return tribe_get_organizer( $this->ID );
    }
  }

  public function organizer_phone() {
    if ( function_exists( 'tribe_get_organizer_phone' ) ) {
      return tribe_get_organizer_phone( $this->ID );
    }
  }

  public function organizer_email() {
    if ( function_exists( 'tribe_get_organizer_email' ) ) {
      return tribe_get_organizer_email( $this->ID );
    }
  }

  public function organizer_link() {
    if ( function_exists( 'tribe_get_organizer_website_url' ) ) {
      return tribe_get_organizer_website_url( $this->ID );
    }
  }
}

/**
 * Filter function used to remove the tinymce emoji plugin.
 *
 * Taken from https://wordpress.org/plugins/disable-emojis/
 *
 * @param    array  $plugins
 * @return   array  Difference betwen the two arrays
 */
function guny_disable_emojis_tinymce( $plugins ) {
  if ( is_array( $plugins ) ) {
    return array_diff( $plugins, array( 'wpemoji' ) );
  } else {
    return array();
  }
}

//Amalan New codes to test new content post type and microsite testing
add_action( 'wp_print_styles', 'microsite_styles' );
function microsite_styles() {
  if ( is_post_type_archive( 'magazine_' ) || is_singular( 'magazine_' ) ) {
    wp_dequeue_style( 'master' );
    wp_enqueue_style( 'magazine', get_stylesheet_directory_uri() . '/magazine.css', null, '0.1' );
  }
}

function my_acf_google_map_api( $api ){
  $api['key'] = 'AIzaSyDrvNnQZBiASAH3JI7LNFewrX9jeYZlMWo';
  return $api;
}
add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');
//End of the codes Amalan

// Replacing default titles
function guny_titles( $title ){
  $gen_pages = array("generationnyc", "trips", "topics", "inspirations");
  $_post = get_queried_object();
  // Generation single pages
  $page_type = explode("/", trim(parse_url(get_permalink(), PHP_URL_PATH), "/"));
  if ( !is_front_page() && is_single() && in_array($page_type[0], $gen_pages) ) {
    $title = $_post->post_title . ' - ' . 'Generation NYC';
  }
  // Generation Landings
  // TO-EDIT: add landings as pages
  if ( !is_front_page() && !is_single() && in_array($page_type[0], $gen_pages) ) {
    if ( $page_type[0] == "generationnyc" && count($page_type) < 2){
      $title = "Generation NYC";
    }elseif ( $page_type[1] == "inspirations"){
      $title = "Inspirations" . ' - ' . 'Generation NYC';
    }elseif( $page_type[1] == "topics"){
      $title = "Topics" . ' - ' . 'Generation NYC';
    }elseif( $page_type[1] == "trips"){
      $title = "Trips" . ' - ' . 'Generation NYC';
    }
  }else if(is_single() && get_post_type() == "program"){
    // set the title to the program name instead of plain language
    $title=$_post->program_name . ' - ' . get_bloginfo('name', 'display');
  }
  return $title;
}
add_filter( 'pre_get_document_title', 'guny_titles', 999, 1 );
// End of guny_titles


// add validation on cta phone number on topics page
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
// end add validation

// get the environment variable from config
function get_env($value){
  return $_ENV[$value];
}

/**
 * Includes
 */

$includes = [
  '/includes/guny_editor_styles.php', // Customize TinyMCE settings
  '/includes/guny_shortcodes.php', // Custom Shortcodes
  '/includes/guny_meta_boxes.php', // Customize Wordpress meta boxes
  '/includes/guny_top_programs.php', // Add Top Programs Widget
  '/includes/guny_term_meta.php', // Add custom meta fields to taxonomies
  '/includes/guny_facetwp.php', // Customize Facet WP output
  '/includes/guny_filter_events.php', // Event filters
  '/includes/hide_child_events.php', // Hide child events in WP Admin
  '/includes/routing.php', // Routing
  '/includes/search.php', // Search functions
  '/includes/summer_guides.php', // Summer guide functions
  [ // REST
    '/includes/REST/guny_rest.php', // expose fields to rest API
    '/includes/REST/guny_rest_programs.php', // expose fields to rest API
    '/includes/REST/guny_rest_events.php', // expose fields to rest API
  ],
  [ // Templating
    '/includes/get_focal_point.php', // Focal point functions
    '/includes/format_posts.php', // Format posts based on their type
    '/includes/parameters.php', // Parameter functions for templates
    '/includes/flexible_content.php', // Working with ACF Flexible Content
    '/includes/location_description.php', // Date option custom field
    '/includes/date_options.php', // Date option custom field
    '/includes/get_latest_recurring_event.php' // Get latest of a recurring event
  ],
  [ // Nyco
    '/vendor/nyco/wp-assets/dist/style.php', // Enqueue functions
    '/vendor/nyco/wp-assets/dist/script.php' // Enqueue functions
  ],
  [ // Wpml
    '/includes/term_translations.php', // Term translation helpers
  ],
  [ // Admin
    '/includes/program_posts_column.php' // Add program name to post in the admin
  ],
  [ // michelf
    '/vendor/michelf/php-markdown/Michelf/Markdown.inc.php' // Markdown parser
  ]
];

for ($i=0; $i < sizeof($includes); $i++) {
  if (is_array($includes[$i])) {
    for ($x=0; $x < sizeof($includes[$i]); $x++) {
      require_once(get_template_directory() . $includes[$i][$x]);
    }
  } else {
    require_once(get_template_directory() . $includes[$i]);
  }
}

/**
 * Utiltiy for wrapping var_dump in pre tags for a nicer front end
 * @param  any $var The variable to pass to var_dump()
 */
function pre_dump($var) {
  echo '<pre>';
  var_dump($var);
  echo '</pre>';
}