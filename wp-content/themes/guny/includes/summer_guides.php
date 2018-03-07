<?php

/**
 * Config and functions for Summer Guides
 */

namespace SummerGuides;

/**
 * Dependencies
 */

use Timber;
use Wpml;
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
const TAXONOMIES = array(
  'summer_programs_cat' => array(
    'name' => 'All Programs',
    'default' => 'Select a Program Type', // these should match (for templates)
    'prompt' => 'Select a Program Type', // these should match (for templates)
    'slug' => 'programs',
    'config' => array(
      'orderby' => 'NAME',
      'hide_empty' => false,
      'depth' => 1,
      'hierarchical' => true,
    )
  ),
  'age_group' => array(
    'name' => 'All Ages',
    'default' => 'Select an Age', // these should match (for templates)
    'prompt' => 'Select an Age', // these should match (for templates)
    'slug' => 'ages',
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'hide_empty' => true,
      'orderby' => 'term_order'
    )
  ),
  'borough' => array(
    'name' => 'All Boroughs',
    'default' => 'Select a Borough', // these should match (for templates)
    'prompt' => 'Select a Borough', // these should match (for templates)
    'slug' => 'boroughs',
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
  return isset($_GET);
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

  // Works in context of the post type/archive type
  $filter = Timber::get_terms($slug, TAXONOMIES[$slug]['config']);

  // If it's empty, just return what we got
  if (!sizeof($filter)) return $filter;

  foreach ($filter as $key => $value) {
    // Get properties of each item
    $filter[$key] = get_object_vars($value);
    // Translate the filter ID if needed
    $id = $value->slug;
    // Create the link
    $filter[$key]['link'] = esc_url(add_query_arg($slug, $id));
  }

  // Add the reset filter, the 'All ...' filter needs to be set to something
  // blank in order to show all results.
  array_unshift($filter, array(
    'slug' => 'all_' . TAXONOMIES[$slug]['slug'],
    'name' => __(TAXONOMIES[$slug]['name'], TRANSLATION_DOMAIN),
    'link' => esc_url(add_query_arg($slug, '', remove_query_arg($slug)))
  ));

  return $filter;
}

/**
 * Get all of the filters defined in the configuration
 * @return [array]                  The collection of filters
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
      $prompt = ($_GET[$key] === '') ?
        __($value['name'], TRANSLATION_DOMAIN) : $prompt;
      // Use the translated string for the name.
      $value['name'] = __($value['name'], TRANSLATION_DOMAIN);
      $value['default'] = __($value['default'], TRANSLATION_DOMAIN);
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
