<?php

/**
 * Config and functions for the search controller
 */

namespace Search;

/**
 * Dependencies
 */

use Templating as Templating;


/**
 * Constants
 */

// The routing path. This doesn't affect the Timber route but it is used
// by templates and the redirect function in the routing config. Used in
// conjunction with get_home_url() insures that the WPML language path prefix
// is set properly. Also used for getting search settings defined in the
// 'Search' (slug; '/search') Wordpress page.
CONST PATH = '/search';

// The WPML domain for templates
const TRANSLATION_DOMAIN = 'guny-search';

// Default values for Growing Up Filters
const GUNY_POST_TYPES = array(
  'program', 
  'age', 
  'summer-guide', 
  'afterschool-guide', 
  'tribe_events'
);
  
// Default values for Generation Filters
const GEN_POST_TYPES = array(
  'topic', 
  'inspiration', 
  'trip'
);

// Default taxonomies for Generation
const GEN_TAXONOMIES = array(
  'relation' => 'EXISTS',
  array(
    'taxonomy' =>'age_group', 
    'field'    => 'slug',
    'terms'    => 'teen',
  ),
  array(
    'taxonomy' =>'age_group', 
    'field'    => 'slug',
    'terms'    => 'young-adult',
  )
);

// Default values for query string parameters
const DEFAULT_PARAMS = array(
  's' => '',
  'post_type' => 'any',
  'paged' => 1,
);

// Parameter validation patterns
const PARAM_PATTERNS = array(
  's' => '/^[\W\w]*$/',
  'post_type' => '/^[A-Za-z_-]*$/',
  'paged' => '/^[0-9]*$/',
);

// The field ID for auto corrected terms
// Search Options > Auto Correct
// group_5a6a00e9e6ee2.json
const AUTO_CORRECT_FIELD = 'field_5a6a00e7dda1d';

// The field ID for enabling the suggested dropdowns
// Search Options > Enable Suggestions
// group_5a6a00e9e6ee2.json
const ENABLE_SUGGESTIONS = 'field_5a7886d200097';

// The field ID for the suggested terms list
// Search Options > Suggestions
// group_5a6a00e9e6ee2.json
const SUGGESTED_TERMS_FIELD = 'field_5a74dbd08af7f';

const USER_PRIVATE_VIEWING_ROLE = 'administrator';

/**
 * Functions
 */

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id() {
  $path = get_path();
  $id = get_page_by_path($path)->ID;
  if ($id != NULL){
    return $id;
  } else {
    $id = get_page_by_path(PATH)->ID;
    return icl_object_id($id, 'page', false, ICL_LANGUAGE_CODE);
  }
}

/**
 * Determine if the page is public or the current user has permission
 * @return boolean Permission status
 */
function visible() {
  $auth = false;

  if (
    get_post_status(get_controller_id()) != 'private' ||
    current_user_can(USER_PRIVATE_VIEWING_ROLE)
  ) {
    $auth = true;
  }

  $auth = (null === get_controller_id()) ? false : $auth;

  return $auth;
}

/**
 * Get the search domain, this ensures integration with WPML
 * @return string The full url for search, including language prefix
 */
function get_path() {
  $arr_path = explode('/',strtok($_SERVER["REQUEST_URI"],'?'));
  if (array_search('generationnyc', $arr_path)){
    $path = '/generationnyc'.PATH;
  } else if (ICL_LANGUAGE_CODE == 'es') {
    $path = '/'.ICL_LANGUAGE_CODE.PATH;
  }else {
    $path = PATH;
  }

  return $path;
}

/**
 * Return the translation domain for templates
 * @return string The translation domain constant
 */
function get_translation_domain() {
  return TRANSLATION_DOMAIN;
}

/**
 * Uses get_query_var to get query parameters as an array for search, it
 * will not return default values as they aren't needed.
 * @return array Key, value pair of query parameters
 */
function get_query() {
  $pt = (ICL_LANGUAGE_CODE ==='es')? array('age', 'program', 'tribe_events'):DEFAULT_PARAMS['post_type'];
  
  $query = array(
    's' => get_query_var('s', DEFAULT_PARAMS['s']),
    'post_type' => get_query_var('post_type', $pt),
    'paged' => get_query_var('page', DEFAULT_PARAMS['paged']), 
  );

  // Blank post types can get through
  $query['post_type'] = ($query['post_type'] === '') ?
    $pt : $query['post_type'];

  // Validate our paramters
  // $query = Templating\validate_params($query, PARAM_PATTERNS);

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
function auto_correct($term) {
  $auto_correct_terms = get_field(AUTO_CORRECT_FIELD, get_controller_id());
  if ($auto_correct_terms) {
    foreach ($auto_correct_terms as $key => $value) {
      $auto_correct_term = explode(' = ', $value['terms']);
      if (strtolower($term) === strtolower($auto_correct_term[0])) {
        $term = $auto_correct_term[1]; // swap user term with correct term
      }
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

/**
 * Check to see if the suggestion dropdowns are enabled
 * @return boolean True if enabled, false if not.
 */
function enabled_suggestions() {
  return (isset(get_field(ENABLE_SUGGESTIONS, get_controller_id())[0]));
}

/**
 * Return the suggested terms for the spelling suggestion dropdown
 * @return [string] JSON data as string of terms and synonyms.
 */
function get_suggested_terms() {
  $return =  '';
  $suggested_terms = get_field(SUGGESTED_TERMS_FIELD, get_controller_id());
  if ($suggested_terms) {
    foreach ($suggested_terms as $key => $value) {
      $group = explode(', ', $value['terms_and_synonyms']);
      $group = '["' . implode('", "', $group) . '"]';
      $return .= ($key === 0) ? $group : ', ' . $group;
    }
  }
  return '['. $return .']';
}

/**
 * Return an array of the filter names.
 * @return array post types with their plural names.
 */
function search_filters(){
  $post_types = get_search_post_types();
  $filters = array_fill_keys($post_types, NULL);
  
  foreach ($filters as $key=>$post_type) {
    $filters[$key] = get_post_type_object($key)->labels->name;
  }

  return $filters;
}

/**
 * Return an array of the intersected post_Types and indexed post_types.
 * @return array post types
 */
function get_search_post_types(){
  $indexed=get_option( 'relevanssi_index_post_types' );
  $path = explode('/', get_path());

  if(in_array('generationnyc', $path)){
    $post_types = array_intersect($indexed, GEN_POST_TYPES);
  } else {
    $post_types = array_intersect($indexed, GUNY_POST_TYPES);
  }

  return $post_types;
}

/**
 * Return string of the message to display when there are no search results.
 * @return string no results message
 */
function get_no_results_msg(){
  $msg=get_field('no_results_message', get_controller_id());
  $msg = preg_replace( '/^<[^>]+>|<\/[^>]+>$/', '', $msg );
  return $msg;
}