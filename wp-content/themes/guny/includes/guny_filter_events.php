<?php

/**
* Add additional query variables
*/

function guny_add_query_vars( $vars ) {
  $vars[] = 'cat_id';
  $vars[] = 'age_id';
  $vars[] = 'borough_id';
  return $vars;
}
add_filter( 'query_vars', 'guny_add_query_vars' );