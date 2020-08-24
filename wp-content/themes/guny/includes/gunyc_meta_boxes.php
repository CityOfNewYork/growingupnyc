<?php

/**
* Remove default Age Groups taxonomy box from Ages
*/
function guny_remove_meta() {
  remove_meta_box( 'age_groupdiv', 'age', 'side' );
}
add_action( 'admin_menu', 'guny_remove_meta' );

/**
* Remove Event Options and Tags metaboxes from events
*/
function guny_remove_event_options() {
  remove_meta_box( 'tribe_events_event_options', 'tribe_events', 'side' );
  remove_meta_box( 'tagsdiv-post_tag', 'tribe_events', 'side');
}
add_action( 'add_meta_boxes_tribe_events', 'guny_remove_event_options' );
