<?php 

/* Shows the events from the specified RSS feed*/

/* Get the events from the rss feed*/
function get_rss_events() {
  echo '<div class="wrap">';

  $options = array(
    CURLOPT_URL => get_option('rss_url'),
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_PROXY => ''
  );

  $ch = curl_init();
  curl_setopt_array($ch, $options);
  $output = json_decode(curl_exec($ch), true);

  if (curl_errno($ch)){
    echo 'Sorry, could not load the feed. Please try again later.';
    echo curl_error($ch);
  }
  curl_close($ch);

  // clean out the events that already happened
  foreach ($output as $i => &$event) {
    $event_startdate = date('Y-m-d',strtotime($event['startdate']));

    if ($event_startdate< date('Y-m-d')){
      unset($output[$i]);
    }
  }

  /**************/
  // temp to not use all the data
  $data=array_slice($output, 0, 100);
  get_rss_categories($data);
  
  /**************/

  echo '</div>';
}

/**********************************************/

/* Show and extract categories and add checkbox filter 
 * 
 */
function get_rss_categories($events) {
  $categories = [];
  
  foreach ($events as $i => &$event) {
    $categories = array_merge($categories,explode(' | ',$event['categories']));
    $categories = array_unique($categories);
  }

  echo '  <h1>Categories</h1>';
  echo '<form action="admin.php?page=nyco-events" method="post">';

  // this is a WordPress security feature - see: https://codex.wordpress.org/WordPress_Nonces
  wp_nonce_field('categories_selected');
  foreach ($categories as $i => &$category) {
    echo '<input type="checkbox" name="categories[]" class="checkbox__field" value="'.$category.'">';
    echo '<label>'.$category.'</label>';
    echo '<br>';  
  }
  submit_button('Filter');
  echo '</form>';
  echo '  <h1>Events</h1>';

  // filter the events if categories are selected
  if (isset($_POST['categories']) && check_admin_referer('categories_selected')) {
    echo '<p><strong>Filtered by ',implode(', ', $_POST['categories']),'</strong></p>';
    get_rss_events_filtered($events, $_POST['categories']);
  } else {
    import_events($events, []);

  }

}

/* Filter the events based on the categories selected */
function get_rss_events_filtered($events, $categories){
  foreach ($events as $i => &$event) {
    $match_count = 0;

    foreach ($categories as &$category) {
      if (strlen(strstr($event['categories'], $category)) > 0) {
        $match_count ++;
      }
    }

    if (!($match_count > 0)) {
      unset($events[$i]);
    }
  }
  import_events($events);
}

/**
 * Tabulates the events from a Feed.
 *
 * @param  array $events The array of events from RSS feed
 *
 * @return table         Result of update_post_meta.
 */
// function import_events($events, $categories){
function import_events($events){
  $titles=array_column($events, 'title');
  

  echo '<form action="admin.php?page=nyco-events" method="post">';
  wp_nonce_field('events_selected');

  generate_import_table($events);
  
  submit_button('Import');
  
  echo '</form>';

  // loop through selected events and import
  if (isset($_POST['events_import']) && check_admin_referer('events_selected')) {
    foreach($_POST['events_import'] as &$event_index) {
      create_rss_event($events[$event_index]);
    }
  }
}

function create_rss_event($event){
  $start_dt = DateTime::createFromFormat("H:i a", $event['starttime']);
  $start_hour = $start_dt->format('g');
  $start_minute = $start_dt->format('i');
  $start_meridiem = $start_dt->format('a');

  $end_dt = DateTime::createFromFormat("H:i a", $event['endtime']);
  $end_hour = $end_dt->format('g');
  $end_minute = $end_dt->format('i');
  $end_meridiem = $end_dt->format('a');

  // check the venue
  $venue_id = check_venue_exists($event);

  // create the event
  $args = array(
   'post_title'         => $event['title'],
   'post_name'          => sanitize_title($event['title']).'-'.$event['startdate'],
   'post_status'        => 'draft',
   'post_author'        => get_current_user_id(),
   'EventStartDate'     => $event['startdate'],
   'EventEndDate'       => $event['enddate'],
   'EventStartHour'     => $start_hour,
   'EventStartMinute'   => $start_minute,
   'EventStartMeridian' => $start_meridiem,
   'EventEndHour'       => $end_hour,
   'EventEndMinute'     => $end_minute,
   'EventEndMeridian'   => $end_meridiem,
   'EventURL'           => $event['link'],
   'EventVenueID'       => $venue_id,
  );

  $post_id = tribe_create_event( $args );

  update_field('summary', $event['description'], $post_id);
  wp_set_object_terms( $post_id, get_rss_borough($event['parkids']), 'borough');

  echo '<p>Imported <a href="',get_edit_post_link($post_id),'">'.$event['title'].'</a></p>';


}
function generate_import_table($events) {
  echo '<table class="events-list">';
  echo '  <tr>';
  echo '  <th class="text-left">Import</th>';
  echo '  <th class="text-left">Event Name</th>';
  echo '  <th class="text-left">Event Start Date</th>';
  echo '  <th class="text-left">Event End Date</th>';
  echo '  <th class="text-left">Borough</th>';
  echo '  <th class="text-left">Exists</th>';
  echo '  </tr>';

  foreach ($events as $i => &$event) {
    echo '  <tr>';

    $event_match = check_rss_event_exists($event);

    if ($event_match) {
      echo '  <td><input type="checkbox" name="events_import[] class="checkbox__field" value="'.$i.'" disabled="disabled"></td>';
      echo '  <td><a href="'.$event_match->guid.'">'. $event['title'] .'</a></td>';
      echo '  <td>'. $event['startdate'] . ' ' . $event['starttime'] .'</td>';
      echo '  <td>'. $event['enddate'] . ' ' . $event['endtime'] .'</td>';
      echo '  <td>'. get_rss_borough($event['parkids']) .'</td>';
      echo '  <td><span class="dashicons dashicons-yes"></span></td>';
    } else {
      echo '  <td><input type="checkbox" name="events_import[] class="checkbox__field" value="'.$i.'"></td>';
      echo '  <td>'. $event['title'] .'</td>';
      echo '  <td>'. $event['startdate'] . ' ' . $event['starttime'] .'</td>';
      echo '  <td>'. $event['enddate'] . ' ' . $event['endtime'] .'</td>';
      echo '  <td>'. get_rss_borough($event['parkids']) .'</td>';      
      echo '  <td><span class="dashicons dashicons-no-alt"></span></td>';  
    }
    
    echo '  </tr>';
  }
  echo '</table>';
}

// loop through the events from the feed and check to see if they exist in the database
// returns the queried event
function check_rss_event_exists($event){

  $borough = get_rss_borough($event['parkids']);

  $args=array(
    'post_type' => 'tribe_events',
    // 'title' => $event['title'],
    'name' => sanitize_title($event['title']).'-'.$event['startdate'],
    'tax_query' => array(
      array(
        'taxonomy' => 'borough',
        'field'    => 'slug',
        'terms'    => $borough,
      ),
    ),
  );

  $query = new WP_Query($args);

  $posts = $query->posts;

  // compare the start date of the rss event to those in the database
  foreach ($posts as $i => &$post) {
    $date = explode(' ', $post->EventStartDate)[0];

    if ($event['startdate'] == $date) {
      return $post;
    }
  }
}

/* Checks to see which borough the event occurs */
function get_rss_borough($id){
  if ( strpos( $id, 'X') !== false ) {
    return 'bronx';
  } else if (strpos( $id, 'B') !== false) {
    return 'brooklyn';
  }else if (strpos( $id, 'M') !== false) {
    return 'manhattan';
  }else if (strpos( $id, 'Q') !== false) {
    return 'queens';
  }else if (strpos( $id, 'R') !== false) {
    return 'staten-island';
  }
}

/* Function to check to see if the venue exists.
 * If it doesn't create it in draft mode
 */
function check_venue_exists($event) {
  $location = $event['location'];
  $coordinates = explode(',', $event['coordinates']);
  $lat = $coordinates[0];
  $lng = $coordinates[1];

  $args=array(
    'post_type' => 'tribe_venue',
    'name' => sanitize_title($location),
  );

  $query = new WP_Query($args);

  $existing_venues = $query->posts;

  if (sizeof($existing_venues) > 0) {

    return $existing_venues[0]->ID;

  } else {
    $v_args = array(
      'Venue' => $location,
      'OverwriteCoords' => 1,
      'Lat' => $lat,
      'Lng' => $lng,
    );

    $new_venue = tribe_create_venue($v_args);

    /* Due to bug with events calendar, change it to draft */
    $u_args = array(
      'ID' => $new_venue,
      'post_status' => 'draft',
    );

    wp_update_post( $u_args );

    return $new_venue;
  }
}