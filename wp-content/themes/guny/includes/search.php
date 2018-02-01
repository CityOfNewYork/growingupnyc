<?php

namespace Search;


/**
 * Dependencies
 */

use Templating as Templating;


/**
 * Constants
 */

CONST FILTER_TYPES = array(
  'age' => 'Ages',
  'tribe_events' => 'Events',
  'program' => 'Programs'
);

// Default values for query string parameters.
const DEFAULT_PARAMS = array(
  's' => '',
  'post_type' => 'any',
  'paged' => 1
);

// Match query string parameters against these patterns.
const PARAM_PATTERNS = array(
  's' => '/^[\W\w]*$/',
  'post_type' => '/^[A-Za-z_-]*$/',
  'paged' => '/^[0-9]*$/'
);


/**
 * Functions
 */

/**
 * Uses get_query_var to get query parameters as an array for search, it
 * will not return default values as they aren't needed.
 * @return array Key, value pair of query parameters
 */
function get_query() {
  $query = array(
    's' => get_query_var('s', DEFAULT_PARAMS['s']),
    'post_type' => get_query_var('post_type', DEFAULT_PARAMS['post_type']),
    'paged' => get_query_var('page', DEFAULT_PARAMS['paged'])
  );

  // Validate our paramters
  $query = Templating\validate_params($query, PARAM_PATTERNS);

  // Page 0 and 1 are the same, but 0 cause pagination issues
  $query['paged'] = ($query['paged'] === 0) ? 1 : $query['paged'];

  // Don't worry about passing defaults back to the controller
  foreach ($query as $key => $value) {
    if ($query[$key] === DEFAULT_PARAMS[$key] && $key !== 's') {
      unset($query[$key]);
    }
  }

  return $query;
}

/**
 * Auto corrects a supplied term based on a list of supplied corrections
 * @param  array $term  The term to check
 * @param  array $terms Key, value pair of misspellings => corrections
 * @return string       The corrected term
 */
function auto_correct($term, $auto_correct_terms) {
  foreach ($auto_correct_terms as $key => $value) {
    $auto_correct_term = explode(' = ', $value['terms']);
    if (strtolower($term) === strtolower($auto_correct_term[0])) {
      $term = $auto_correct_term[1]; // swap user term with correct term
    }
  }
  return $term;
}

/**
 * Gets an array of page links including 'next' and 'previous'.
 * @param  array $query         The query string as an array.
 * @param  float $max_num_pages The $wp_query->max_num_pages number.
 * @return array                Keys; 'previous' and 'next', values are string
 *                              links, false if there is no link.
 */
function pagination($query, $max_num_pages) {
  $query['paged'] = (isset($query['paged'])) ? $query['paged'] : 1;

  $pagination = $query;

  unset($pagination['paged']);

  if ($query['paged'] > 1) {
    $previous = array(
      'page' => $query['paged'] - 1
    );
    $previous = array_merge($pagination, $previous);
    $previous = http_build_query($previous);
    $previous = ($previous) ? '?' . $previous : '';
  }

  if ($query['paged'] < $max_num_pages) {
    $next = array(
      'page' => $query['paged'] + 1
    );
    $next = array_merge($pagination, $next);
    $next = http_build_query($next);
    $next = ($next) ? '?' . $next : '';
  }

  return array(
    'previous' => (isset($previous)) ? $previous : false,
    'next' => (isset($next)) ? $next : false
  );
}