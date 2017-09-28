<?php
if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();
$tribe_ecp = Tribe__Events__Main::instance();

$current_month = tribe_get_month_view_date();
$today = date_i18n( Tribe__Date_Utils::DBDATEFORMAT, strtotime( date( 'Y-m-d', current_time( 'timestamp' ) ) ) );
$context['current_month_text'] = date_i18n( tribe_get_date_option( 'monthAndYearFormat', 'F Y' ), strtotime( $current_month ) );
$context['current_month'] = $current_month;

$events = Timber::get_posts(false, 'GunyEvent');

$event_list = array();
$now = time();
foreach ($events as $event) {
  if ( isset( $event->EventStartDate ) ) {
    $postTimestamp = strtotime( tribe_get_start_date( $event->ID, true, Tribe__Date_Utils::DBDATETIMEFORMAT ) );
    if ( $postTimestamp < $now ) {
      $postTimestamp = $now;
    }
    $postTimestamp = strtotime( date( Tribe__Date_Utils::DBDATEFORMAT, $postTimestamp ), $now );
    if ( empty( $event_list[$postTimestamp]['date_header'] ) ) {
      $event_list[$postTimestamp]['date_header'] = date( 'l, F j', $postTimestamp );
    }
    $event_list[$postTimestamp]['posts'][] = $event;
  }
}
$context['event_list'] = $event_list;

// Get current filter selections
$cat_id = get_query_var('cat_id');
$age_id = get_query_var('age_id');
$borough_id = get_query_var('borough_id');
$lang_id = get_query_var('lang_id');
$eventDate = get_query_var('eventDate');

function addFilterArgs( $url, $preservePagination = false ) {
  global $cat_id;
  global $age_id;
  global $borough_id;
  global $lang_id;
  global $eventDate;

  $query_args = array();

  if (!$preservePagination) {
    $query_args['tribe_paged'] = false;
  }

  if ($cat_id > 0) {
    $query_args['cat_id'] = $cat_id;
  }
  if ($age_id > 0) {
    $query_args['age_id'] = $age_id;
  }
  if ($borough_id > 0) {
    $query_args['borough_id'] = $borough_id;
  }
  if ( !empty( $eventDate ) ) {
    $query_args['eventDate'] = $eventDate;
  }
  return add_query_arg( $query_args, $url );
}

// Event Category Filter
$event_filter = Timber::get_terms('tribe_events_cat', array(
  'orderby' => 'NAME',
  'hide_empty' => false,
  'depth' => 1,
  'hierarchical' => true,
) );

foreach ($event_filter as $key => $value) {
  $value->link = esc_url( add_query_arg( 'cat_id', icl_object_id($value->ID, 'tribe_events_cat', false , 'en') ) );
  $event_filter[$key] = $value;
}
$context['event_filter'] = $event_filter;
$context['all_events'] = array(
  'name' => 'All Event Types',
  'link' => esc_url( remove_query_arg( 'cat_id' ) )
);
if ( $cat_id > 0 ) {
  $context['current_event_filter'] = get_term( $cat_id )->name;
} else {
  $context['current_event_filter'] = $context['all_events']['name'];
}

// Age Group Filter
$age_filter = Timber::get_terms('age_group', array(
  'hierarchical' => true,
  'depth' => 1,
  'hide_empty' => true,
  'orderby' => 'term_order'
) );
foreach ($age_filter as $key => $value) {
  $value->link = esc_url( add_query_arg( 'age_id', icl_object_id($value->ID, 'age_group', false , 'en') ) );
  $event_filter[$key] = $value;
}
$context['age_filter'] = $age_filter;
$context['all_ages'] = array(
  'name' => 'All Ages',
  'link' => esc_url( remove_query_arg( 'age_id' ) )
);
if ( $age_id > 0 ) {
  $context['current_age_filter'] = get_term( $age_id )->name;
} else {
  $context['current_age_filter'] = $context['all_ages']['name'];
}

// Borough Filter
$borough_filter = Timber::get_terms('borough', array(
  'hierarchical' => true,
  'depth' => 1,
  'orderby' => 'NAME',
  'hide_empty' => false
) );
foreach ($borough_filter as $key => $value) {
  // $value->link = esc_url( add_query_arg( 'borough_id', $value->ID ) );
  $value->link = esc_url( add_query_arg( 'borough_id', icl_object_id($value->ID, 'borough', false , 'en') ) );
  $event_filter[$key] = $value;
}
$context['borough_filter'] = $borough_filter;
$context['all_boroughs'] = array(
  'name' => 'All Boroughs',
  'link' => esc_url( remove_query_arg( 'borough_id' ) )
);
if ( $borough_id > 0 ) {
  $context['current_borough_filter'] = get_term( $borough_id )->name;
} else {
  $context['current_borough_filter'] = $context['all_boroughs']['name'];
}

if ( $today < $current_month ) {
  $context['prev_month_url'] = esc_url( add_query_arg( array(
    'eventDate' => $tribe_ecp->previousMonth( $current_month ),
    'tribe_paged' => false
  ) ) );
}
$context['next_month_url'] = esc_url( add_query_arg( array(
  'eventDate' => $tribe_ecp->nextMonth( $current_month ),
  'tribe_paged' => false
) ) );
$context['next_month_text'] = tribe_get_next_month_text();

$context['reset_filters_url'] = tribe_get_events_link();
if ( !empty( $eventDate ) ) {
  $context['reset_filters_url'] = esc_url( add_query_arg( 'eventDate', $eventDate, $context['reset_filters_url'] ) );
}

if ( tribe_has_previous_event() && (int) get_query_var('paged') >= 2 ) {
  $context['prev_url'] = esc_url( addFilterArgs( tribe_get_listview_prev_link(),  true ) );
}
if ( tribe_has_next_event() ) {
  $context['next_url'] = esc_url( addFilterArgs( tribe_get_listview_next_link(), true ) );
}

//Adding the language
$context['language'] = ICL_LANGUAGE_CODE;

//Including the language switcher manually
global $wp;
$postlink = add_query_arg(array(),$wp->request);

$languagearray = array("en" => "English" , "es" => "Español");  
$output = '';
$output .= '<div class="c-language-switcher-wrapper">';
$output .=  '<div class="o-container c-language__switcher">';
$output .=    '<div class="wpml-ls-sidebars-top_widget wpml-ls wpml-ls-legacy-list-horizontal">';
$output .=      '<ul>';
foreach ($languagearray as $key => $value) {
  $output .= '<li class="wpml-ls-slot-top_widget wpml-ls-item wpml-ls-item-'.$key; 
  if($key == ICL_LANGUAGE_CODE){
    $output .= ' wpml-ls-current-language';
  }
  $output .= ' wpml-ls-item-legacy-list-horizontal">';
  if($key == 'en'){
    $output .=  '<a href="'.site_url().'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
  }
  else{
    $output .=  '<a href="'.site_url().'/'.$key.'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
  }
  $output .= '</li>';
}
$output .=      '</ul>';
$output .=    '</div>';
$output .=  '</div>';
$output .= '</div>';

$context['custom_switcher'] = $output;

$templates = array( 'list-events.twig', 'index.twig' );

$context['top_widgets'] = Timber::get_widgets('top_widget');

Timber::render( $templates, $context );
