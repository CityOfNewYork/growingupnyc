<?php

if ( ! class_exists( 'Timber' ) ) {
  add_action( 'admin_notices', function() {
    echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
  } );
  return;
}

if ( ! class_exists( 'GUPostTypes' ) ) {
  add_action( 'admin_notices', function() {
    echo '<div class="error"><p>GUPostTypes not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#growing-up-nyc-post-types' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
  } );
  return;
}

class GunySite extends TimberSite {

  function __construct() {
    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'menus' );
    add_action( 'init', array( $this, 'cleanup_header' ) );
    add_action( 'init', array( $this, 'add_menus' ) );
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

  function add_to_context ( $context ) {
    $context['menu'] = new TimberMenu('header-menu');
    $context['footer_menu'] = new TimberMenu('footer-menu');
    $context['site'] = $this;
    $context['age_menu'] = Timber::get_terms('age_group', array(
      'orderby' => 'term_order',
      'hide_empty' => false,
      'parent' => 0
    ) );
    $context['top_programs'] = Timber::get_widgets('top_programs_widgets');

    // Get Featured Events in order of ascending date
    if (function_exists('tribe_get_events')) {
      $top_events = tribe_get_events( array(
        'posts_per_page' => 3,
        'orderby' => 'menu_order',
          'meta_query' => array(
            array(
              'key'     => 'featured_event',
              'value'   => 'Yes',
              'compare' => 'LIKE'
            ),
          ),
      ) );
      // Get remaining events if count of Featured Events is less than 3
      $number_remaining = 3 - count($top_events);
      if( $number_remaining > 0 ) {
        $top_events_remaining = tribe_get_events( array(
          'posts_per_page' => $number_remaining,
          'orderby' => 'menu_order',
          'meta_query' => array(
            array(
              'key'     => 'featured_event',
              'value'   => 'Yes',
              'compare' => 'NOT LIKE'
            ),
          ),
        ));

        // Combine arrays with Featured Events first
        foreach($top_events_remaining as $i => $top_event_remaining) {
          array_push($top_events,  $top_events_remaining[$i]);
        }
      }
      foreach($top_events as $i => $top_event) {
        $top_events[$i] = new GunyEvent($top_event);
      }
      $context['top_events'] = $top_events;
    }
    return $context;
  }

  function add_styles_and_scripts() {
    global $wp_styles;

    if (!is_admin()) {
      wp_deregister_script('jquery');
      wp_enqueue_script( 'modernizr', get_template_directory_uri() . '/assets/js/modernizr.js', array(), '3.0.0', false );
      wp_enqueue_script( 'jquery', get_template_directory_uri() . '/src/js/vendor/jquery.js', array(), '2.1.14', false );
      wp_enqueue_script( 'site-js', get_template_directory_uri() . '/assets/js/source.js', array(), '1.0.0', true );
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
  }

  function add_menus() {
    register_nav_menus(
      array(
        'header-menu' => __( 'Header Menu' ),
        'footer-menu' => __( 'Footer Menu' )
      )
    );
  }
}
new GunySite();

/**
* Extends TimberPost to include functionality provided by The Events Calendar
*/
class GunyEvent extends TimberPost {
  private $_event_type;
  private $_venue_address;

  public function notices() {
    if (function_exists('tribe_the_notices')) {
      return tribe_the_notices(false);
    }
  }

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

  public function prev_event_link() {
    if (function_exists('tribe_get_prev_event_link')) {
      return tribe_get_prev_event_link('<span>&laquo;</span> %title%');
    }
  }

  public function next_event_link() {
    if (function_exists('tribe_get_next_event_link')) {
      return tribe_get_next_event_link('%title% <span>&raquo;</span>');
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

  public function start_date_formatted() {
    // TODO - format for user's timezone (possibly with JS)
    if (function_exists('tribe_get_start_date')) {
      $today = date('Y-m-d');
      $tomorrow = date('Y-m-d', strtotime('+24 hours'));
      $start_time = date('Y-m-d', $this->start_datetime());

      if ($start_time == $today ) {
        $time = 'today';
      } else if ($start_time == $tomorrow) {
        $time = 'tomorrow';
      } else {
        $time = date('l M j', $this->start_datetime());
      }

      return $time;
    }
  }

  public function end_date_formatted() {
    // TODO - format for user's timezone (possibly with JS)
    if (function_exists('tribe_get_end_date')) {
      $today = date('Y-m-d');
      $tomorrow = date('Y-m-d', strtotime('+24 hours'));
      $end_time = date('Y-m-d', $this->end_datetime());

      if ($end_time == $today ) {
        $time = 'today';
      } else if ($end_time == $tomorrow) {
        $time = 'tomorrow';
      } else {
        $time = date('l M j', $this->end_datetime());
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

// Customize TinyMCE settings
require_once(get_template_directory() . '/includes/guny_editor_styles.php');

// Custom Shortcodes
require_once(get_template_directory() . '/includes/guny_shortcodes.php');

// Customize Wordpress meta boxes
require_once(get_template_directory() . '/includes/guny_meta_boxes.php');

// Add Top Programs Widget
require_once(get_template_directory() . '/includes/guny_top_programs.php');