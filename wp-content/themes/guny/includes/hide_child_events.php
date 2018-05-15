<?php

/*
 * Recurring events in wp-admin: only display first (parent) occurrence in list of Events
 * (i.e. hide child recurring events)
 *
 * From https://theeventscalendar.com/knowledgebase/hide-recurring-event-instances-in-admin/
 * https://gist.github.com/cliffordp/81f23a207ab483c9e7c6d910f9b29c0a
 * 2016-07-04 Barry shared this snippet from a previous customer's own/shared customization
 *
 */

class Events_Admin_List__Remove_Child_Events {
  public function __construct() {
    // Don't kick in unless we're on the edit.php screen
    add_action( 'load-edit.php', array( $this, 'setup' ) );
  }
  public function setup() {
    // Listen out for the main events query
    if ( 'tribe_events' === $GLOBALS[ 'typenow' ] )
      add_action( 'parse_query', array( $this, 'modify' ) );
  }
  function modify( WP_Query $query ) {
    // Run once, only for the main query
    if ( ! $query->is_main_query() ) return;
    remove_action( 'parse_query', array( $this, 'modify') );
    // Only return top level posts as a means of ignoring child posts
    $query->set( 'post_parent', 0 );
  }
}

if (!isset($_GET['debug'])) new Events_Admin_List__Remove_Child_Events;