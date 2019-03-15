<?php

/**
 * Config and functions for Summer Guides
 */

namespace SummerGuides;

/**
 * Dependencies
 */

use Timber;
use WP_Query;
use Templating;


/**
 * Constants
 */

// The post type slug
const SLUG = 'summer-guide';

// This doesn't affect the route, but it's used as a reference to the page
// path for getting custom field content.
const PATH = '/summer';

// The translation domain for WPML
const TRANSLATION_DOMAIN = 'guny-summer-guide';

// Tagline custom field in group_5a9d9040b6b10.json
const FIELD_TAGLINE = 'field_5a9d9040cb271';

// The theme options setting for the banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE = 'field_5a9dbafbc4617';

// The base configuration for all filters
// Changing the order of this object will change how they display on the front-
// end. However, this will also affect the coloring of the tags because we
// aren't showing the borough tag. The default and prompt params need to match
// because the template checks to see if the prompt has changed for the "no
// posts found messaging" in the filter-summer-guide.twig template.
const TAXONOMIES = array(
  'summer_programs_cat' => array(
    'name' => 'All Programs',
    'single' => 'program',
    'plural' => 'programs',
    'default' => 'Select a Program Type', // these need to match
    'prompt' => 'Select a Program Type', // these need to match
    'config' => array(
      'orderby' => 'NAME',
      'hide_empty' => false,
      'depth' => 1,
      'hierarchical' => true,
    )
  ),
  'age_group' => array(
    'name' => 'All Ages',
    'single' => 'age',
    'plural' => 'ages',
    'default' => 'Select an Age', // these need to match
    'prompt' => 'Select an Age', // these need to match
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'hide_empty' => true,
      'orderby' => 'term_order'
    )
  ),
  'borough' => array(
    'name' => 'All Boroughs',
    'single' => 'borough',
    'plural' => 'boroughs',
    'default' => 'Select a Borough', // these need to match
    'prompt' => 'Select a Borough', // these need to match
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'orderby' => 'NAME',
      'hide_empty' => false
    )
  ),
  'time' => array(
    'name' => 'All Times',
    'single' => 'time',
    'plural' => 'times',
    'default' => 'Select a Time', // these need to match
    'prompt' => 'Select a Time', // these need to match
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'orderby' => 'NAME',
      'hide_empty' => false
    )
  )
);


/**
 * Functions
 */

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id() {
  return get_page_by_path(PATH)->ID;
}

/**
 * Get the location description content in markdown, but remove the paragraph
 * tags from the output because it is a single line.
 * @return string The formated markdown link content marked up with html tags
 */
function get_location_description($id = null) {
  return Templating\get_location_description($id);
}

/**
 * Get the date option custom field string for the post
 * @param  integer $id The id of the post
 * @return string      The date option custom field value for the post
 */
function get_dates($id = null) {
  return Templating\get_dates($id);
}

/**
 * The the section content flexible content field
 * @return Object The flexible content field
 */
function get_sections($id = null) {
  return Templating\get_sections($id);
}

/**
 * Get the hero banner image for the archive page
 * @return Object The media image object
 */
function get_hero_banner_img() {
  return get_field(FIELD_BANNER_IMAGE, get_controller_id());
}

/**
 * Get the tagline from the landing page post
 * @return string The page tagline
 */
function get_tagline() {
  return get_field(FIELD_TAGLINE, get_controller_id());
}

/**
 * Get the title from the landing page post
 * @return string The page title
 */
function get_title() {
  return get_the_title(get_controller_id());
}

/**
 * If the post is filtered or not
 * @return boolean [description]
 */
function is_filtered() {
  $obj = get_queried_object();
  return sizeof($_GET);
}

/**
 * Return the translation domain for templates
 * @return string The translation domain constant
 */
function get_translation_domain() {
  return TRANSLATION_DOMAIN;
}

/**
 * Get the filter template data for a taxonomy
 * @return [array] The collection of TAXONOMIES with slug, name, and links
 */
function get_filter($slug) {

  $filter = array();

  // Timber::get_terms() works in context of the post type/archive type
  $filter = Timber::get_terms($slug, TAXONOMIES[$slug]['config']);

  // If it's empty, just return what we got
  if (!sizeof($filter)) return $filter;

  // Get the current query so that we can filter down on the available posts
  // for the different combinations of taxonomy filters.
  $context = Timber::get_context();
  $request = $context['request'] -> get;
  $args = array('post_type' => SLUG, 'tax_query' => array(), 'posts_per_page' => -1);

  // Build the taxonomy query request as is in the wp_query format
  foreach ($request as $key => $value) {
    if ($value == '') continue;
    $args['tax_query'][] = array(
      'field' => 'slug',
      'taxonomy' => $key,
      'terms' => $value
    );
  }

  // Run through each filter and build the necessary front-end data for it.
  foreach ($filter as $key => $value) {
    // Query the tanxonomy to find out if the current query PLUS this filter
    // will have any posts.
    // Start. Create new args for manipulating on this filter
    $filter_args = $args;

    // Next. Find the current filter taxonomy query in the list of arguments
    // and remove it so we aren't querying against duplicate taxonomies.
    foreach ($filter_args['tax_query'] as $tax => $params) {
      if ($params['taxonomy'] == $value->taxonomy) {
        unset($filter_args['tax_query'][$tax]);
      }
    }

    // Next. Add the current filter taxonomy
    $filter_args['tax_query'][] = array(
      'field' => 'slug',
      'taxonomy' => $value->taxonomy,
      'terms' => $value->slug
    );

    // Finally. Query our arguments to find out if there will be any posts
    $query = new WP_Query($filter_args);

    // If there will be no posts, remove the filter and skip to next filter
    // so that we don't add the link on the front end.
    if (!$query->have_posts()) {
      unset($filter[$key]);
      continue;
    }

    // ... else, get properties of each item
    $filter[$key] = get_object_vars($value);
    // Set the post count for the compined query PLUS filter
    $filter[$key]['count'] = $query->post_count;
    // Translate the filter ID if needed
    $id = $value->slug;
    // Create the link
    $filter[$key]['link'] = esc_url(add_query_arg($slug, $id));
  }

  // Add the reset filter, the 'All ...' filter needs to be set to something
  // blank in order to show all results.
  // array_unshift($filter, array(
  //   'slug' => 'all_' . $slug,
  //   'name' => __(TAXONOMIES[$slug]['name'], TRANSLATION_DOMAIN),
  //   'link' => esc_url(add_query_arg($slug, '', remove_query_arg($slug)))
  // ));

  if ($slug != 'time'){
    return $filter;
  }
}

/**
 * Get all of the filters defined in the configuration
 * @return [array] The collection of filters
 */
function get_filters() {
  $filters = array();

  foreach (TAXONOMIES as $key => $value) {
    $value['filters'] = get_filter($key);
    if (sizeof($value['filters'])) {
      // Get the term name
      $term = get_term_by('slug', get_query_var($key), $key);
      // Set the prompt if the term is avaliable
      $prompt = ($term) ?
        $term -> name : __($value['prompt'], TRANSLATION_DOMAIN);
      // If the query var is there, but blank, use the 'All ...' name
      $prompt = (isset($_GET[$key]) && $_GET[$key] === '') ?
        __($value['name'], TRANSLATION_DOMAIN) : $prompt;
      // Use the translated string for the name.
      $value['name'] = __($value['name'], TRANSLATION_DOMAIN);
      $value['default'] = __($value['default'], TRANSLATION_DOMAIN);
      $value['single'] = __($value['single'], TRANSLATION_DOMAIN);
      $value['plural'] = __($value['plural'], TRANSLATION_DOMAIN);
      $value['prompt'] = $prompt;
      $filters[$key] = $value;
    }
  }

  return $filters;
}

/**
 * Get the archive of the post type by it's slug
 * @return string The post type archive link
 */
function get_archive_link() {
  return get_post_type_archive_link(SLUG);
}

/**
 * Get the reset link which is all taxonomies as blank query parameters
 * @return string The link with taxonomies and stripped query params.
 */
function get_reset_link() {
  $link = get_archive_link();
  foreach (TAXONOMIES as $key => $value) {
    $link = add_query_arg($key, '', $link);
  }
  return esc_url($link);
}

/**
 * Get the post type taxonomy configuration
 * @return array The taxonomy configuration defined above
 */
function get_taxonomies() {
  return TAXONOMIES;
}

/**
 * Get the pagination array from Timber
 * @return array The pagination array
 */
function get_pagination() {
  $pagination = new Timber\Pagination();
  return $pagination->get_pagination(array());
}
