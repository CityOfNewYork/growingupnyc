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
    add_action( 'init', array( $this, 'add_options_page' ) );
    add_filter( 'timber_context', array( $this, 'add_to_context' ) );
    add_action( 'wp_enqueue_scripts', array( $this, 'add_styles_and_scripts' ), 999 );
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
   * Add to timber context
   */
  function add_to_context ( $context ) {

    $context['menu'] = new TimberMenu('header-menu');
    $context['language_code'] = ICL_LANGUAGE_CODE;
    $context['footer_menu_primary_additional'] = new TimberMenu('footer-menu-additional');
    $context['footer_menu_right'] = new TimberMenu('footer-menu-right');
    $context['ms_menu'] = new TimberMenu('ms-header-menu');
    $context['ms_footer_menu_primary_additional'] = new TimberMenu('ms-footer-menu-additional');
    $context['ms_footer_menu_right'] = new TimberMenu('ms-footer-menu-right');
    $context['footer_menu_left'] = new TimberMenu('footer-menu-left');
    $context['site'] = $this;

    // archive links
    $context['events_link'] = get_post_type_archive_link('tribe_events');
    $context['programs_link'] = get_post_type_archive_link('program');
    $context['tips_link'] = get_post_type_archive_link('brain-building-tip');
    $context['summer_link'] = get_post_type_archive_link('summer-guide');
    $context['afterschool_link'] = get_post_type_archive_link('afterschool-guide');

    $context['age_menu'] = Timber::get_terms('age_group', array(
      'orderby' => 'term_order',
      'hide_empty' => false,
      'parent' => 0,
      'meta_key' => 'include-in-age-picker',
      'meta_value' => 1
    ) );
    $current_path=strtok($_SERVER["REQUEST_URI"],'?');

    // widgets
    $search_sidebars=wp_get_sidebars_widgets();
    if (strpos($current_path, 'generation')) {
      $context['search_widgets']=get_search_widget('search_generation_widgets');
    } else {
      $context['search_widgets']=get_search_widget('search_guny_widgets');
    }

    $context['direction'] = (ICL_LANGUAGE_CODE === 'ar' || ICL_LANGUAGE_CODE === 'ur') ? 'rtl' : 'ltr';

    $context['top_events'] = $this->get_featured_events(3);
    $context['is_archive'] = is_archive();
    $context['current_url'] = strtok($_SERVER["REQUEST_URI"],'?');
    $context['is_generation'] = in_array('generationnyc', explode('/', $context['current_url']));

    $context['options'] = get_fields('options');

    // Global alert banner
    if ($context['is_generation']) {
      $page_id = get_page_by_title('Youth')->ID; // TODO: update so it's not dependent on page title
      $banner = get_field('current_banner', $page_id);
    } else {
      $page_id = get_option('page_on_front');
      $banner = get_field('current_banner', $page_id);
    }

    $context['banner']['post'] = Timber::get_post($banner);
    $context['banner']['show'] = get_field('show_banner', $page_id);

    // Alert - event temp
    $event_alert_slug = 'covid-19';
      $args = array(
        'name'        => $event_alert_slug,
        'post_type'   => 'banner',
        'post_status' => 'publish',
        'numberposts' => 1
      );
    $event_alert = get_posts($args);

    $context['event_alert'] = get_field( "banner_content", $event_alert[0]->ID );

     // Alert - program temp
    $programs_alert_slug = 'programs-covid-19';
      $args = array(
        'name'        => $programs_alert_slug,
        'post_type'   => 'banner',
        'post_status' => 'publish',
        'numberposts' => 1
      );
    $programs_alert = get_posts($args);

    $context['programs_alert'] = get_field( "banner_content", $programs_alert[0]->ID );
    $context['direction'] = (ICL_LANGUAGE_CODE === 'ar' || ICL_LANGUAGE_CODE === 'ur') ? 'rtl' : 'ltr';

    return $context;
  }

  function add_styles_and_scripts() {
    global $wp_styles;

    if (!is_admin()) {
      wp_deregister_script('jquery');
      wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/modernizr.js', array(), '3.0.0', false );
      wp_enqueue_script( 'jquery', get_template_directory_uri() . '/src/js/vendor/jquery.js', array(), '2.1.14', false );
      wp_enqueue_script( 'owl-js', get_template_directory_uri() . '/src/js/vendor/owl.carousel.min.js', array(), '2.2.1', true );
      wp_enqueue_script( 'google-map', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCt1i2Y7wnOQooLwKhxKqbe6IWJl02dtyM', array(), '3', true );
      wp_enqueue_script( 'google-map-init', get_template_directory_uri() . '/src/js/vendor/google-maps.js', array('google-map', 'jquery'), '0.1', true );
    }
  }

  /**
   * Add ACF Options Page
   */
  function add_options_page() {
    if( function_exists('acf_add_options_page') ) {
      acf_add_options_page(array(
        'page_title'  => 'GUNY General Settings',
        'menu_title'  => 'GUNY Settings',
        'menu_slug'   => 'guny-general-settings',
        'capability'  => 'edit_posts',
        'redirect'    => false,
        'icon_url' => get_template_directory_uri().'/assets/img/admin-icon.png',
      ));
    }
  }
}

new GunySite();

function get_search_widget($widget_name){
  ob_start();
  dynamic_sidebar($widget_name);
  $sidebar_contents = ob_get_contents();
  ob_end_clean();
  return $sidebar_contents;
}

// extract the slugs for an object
function getSlugs($obj) {
  return array_column($obj, 'slug');
}

/**
 * Includes
 */
$includes = [
  '/includes/gunyc_shortcodes.php', // Custom Shortcodes
  '/includes/gunyc_meta_boxes.php', // Customize Wordpress meta boxes
  '/includes/gunyc_top_widgets.php', // Add Top Afterschool Widget
  '/includes/gunyc_term_meta.php', // Add custom meta fields to taxonomies
  '/includes/gunyc_facetwp.php', // Customize Facet WP output
  '/includes/routing.php', // Routing
  '/includes/search.php', // Search functions
  '/includes/gunyc_acf.php', // 404 functions
  '/includes/404.php', // 404 functions
  '/includes/templating.php', // Template functions
  '/includes/get_focal_point.php', // Focal point functions
  '/includes/format_posts.php', // Format posts based on their type
  '/includes/parameters.php', // Parameter functions for templates
  '/includes/gunyc-dashboard.php',
  '/includes/gunyc_titles.php',
  '/includes/location_description.php', // Date option custom field
  '/includes/date_options.php', // Date option custom field
  '/includes/styles_and_scripts.php', // Get latest of a recurring event
  '/includes/term_translations.php', // Term translation helpers
  [ //Events
    '/includes/gunyc_events.php', // Event filters
    '/includes/gunyc_filter_events.php', // Event filters
    '/includes/hide_child_events.php', // Hide child events in WP Admin
    '/includes/get_latest_recurring_event.php', // Get latest of a recurring event
  ],
  [ // REST
    '/includes/REST/gunyc_rest.php',
    '/includes/REST/gunyc_rest_afterschool.php', // expose fields to rest API
    '/includes/REST/gunyc_rest_events.php',
    '/includes/REST/gunyc_rest_programs.php',
    '/includes/REST/gunyc_rest_summer.php',
    '/includes/REST/gunyc_rest_tips.php',
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

