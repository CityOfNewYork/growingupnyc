<?php

if ( ! class_exists( 'Timber' ) ) {
  add_action( 'admin_notices', function() {
    echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
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
    $context['menu'] = new TimberMenu();
    $context['site'] = $this;
    $context['footer_widgets'] = Timber::get_widgets('footer_widgets');
    $cta = Timber::get_post( array(
      'post_type' => 'call_to_action',
      'post_status' => 'publish'
    ) );
    if ( $cta ) {
      $context['cta'] = Timber::render( 'cta-' . $cta->call_to_action_type . '.twig', array('post' => $cta), false );
    }
    return $context;
  }

  function add_styles_and_scripts() {
    global $wp_styles;

    if (!is_admin()) {
      wp_deregister_script('jquery');
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
      'id' => 'sidebar',
      'name' => __('Default Sidebar'),
      'description' => __('Default sidebar for interior pages'),
      'before_widget' => '',
      'after_widget' => '',
      'before_title' => '<h3>',
      'after_title' => '</h3>'
    ));

    register_sidebar(array(
      'id' => 'sidebar_blog',
      'name' => __('Blog Sidebar'),
      'description' => __('Special sidebar for the blog'),
      'before_widget' => '',
      'after_widget' => '',
      'before_title' => '<h3>',
      'after_title' => '</h3>'
    ));
  }

  function add_menus() {
    register_nav_menus(
      array(
        'header-menu' => __( 'Header Menu' )
      )
    );
  }
}

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
new GunySite();

/**
* Returns the sidebar id for the page, based on page section
*/
function guny_get_sidebar_slug( $post ) {
  if ( $post->post_type == 'page' ) {
    $parents = array_reverse( get_post_ancestors( $post->ID ) );
    $slug = '_';
    // If there are no parents, the page itself is a top-level page
    if (empty($parents)) {
      $slug .= $post->post_name;
    } else {
      $ancestor = get_post($parents[0] );
      $slug .= $ancestor->post_name;
    }

    return $slug;
  }

  // For blog posts, get the blog sidebar
  if ( $post->post_type == 'post' ) {
    return 'blog';
  }

  return '';
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