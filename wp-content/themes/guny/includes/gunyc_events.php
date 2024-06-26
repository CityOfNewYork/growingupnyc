<?php

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

  public function start_datetime_formatted() {
    if (function_exists('tribe_get_start_date')) {
      return date_i18n( __('Y-m-d\TH:m:sT', 'guny-date-formats'), $this->start_datetime());
    }
  }

  public function end_datetime_formatted() {
    if (function_exists('tribe_get_end_date')) {
      return date_i18n( __('Y-m-d\TH:m:sT', 'guny-date-formats'), $this->end_datetime());
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
        $time = __('Today', 'guny-events');
      } else if ($start_time == $tomorrow) {
        $time = __('Tomorrow', 'guny-events');
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

// Remove the events calendar pro related json-ld generation
// https://gist.github.com/code-flow/11c2238a2242433a05e36dc27168f32e
add_filter( 'tribe_events_widget_jsonld_enabled', false, 100, 1 );
add_filter( 'tribe_json_ld_markup', '', 100, 1 );

/**
  * Returns a list of upcoming events
  * @param {integer} $num_events - Total number of events to return
  * @param {array} $tax_query - (Optional) Set of taxonomy query params to include in the event query
  * @param {boolean} $featured_first - Whether to first query for featured events and display them at the top of the list
  * @return Array of GunyEvent objects
  */
function get_featured_events($num_events = 3, $tax_query = null, $featured_first = true) {
  $top_events = array();
  // Get Featured Events in order of ascending date
  if (function_exists('tribe_get_events')) {
    if ($featured_first) {
      $top_event_params = array(
        'posts_per_page' => $num_events,
        'eventDisplay' => 'list',
        'meta_query' => array(
          'relation' => 'AND',
          'featured' => array(
            'key'     => 'featured_event',
            'value'   => 'Yes',
            'compare' => 'LIKE'
          ),
          array(
          'relation' => 'OR',
            'start_date' => array(
              'key'     => '_EventStartDate',
              'value'   => date( 'Y-m-d H:i:s' ),
              'compare' => '>=',
              'type'    => 'DATETIME',
            ),
            'end_date' => array(
              'key'     => '_EventEndDate',
              'value'   => date( 'Y-m-d H:i:s' ),
              'compare' => '>=',
              'type'    => 'DATETIME',
            ),
          ),
        )
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
        'start_date'     => date( 'Y-m-d H:i:s' ),
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

// TEC suggested fix for Google Maps API error
function tribe_events_map_apis() {
  if (is_singular( 'tribe_events' ));
    wp_dequeue_script( 'tribe-events-pro-geoloc' );
  }
add_action( 'wp_enqueue_scripts', 'tribe_events_map_apis' );