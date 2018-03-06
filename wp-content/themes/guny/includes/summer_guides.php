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

// The translation domain for WPML
const TRANSLATION_DOMAIN = 'guny-summer-guide';

// The theme options setting for the banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE = 'field_5a9dbafbc4617';

// The base configuration for all filters
const TAXONOMIES = array(
  // TODO - Fix misspelling on taxonomy
  'borough' => array(
    'name' => 'All Borroughs',
    'prompt' => 'All Borroughs',
    'slug' => 'borroughs',
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'orderby' => 'NAME',
      'hide_empty' => false
    )
  ),
  'summer_programs_cat' => array(
    'name' => 'All Programs',
    'prompt' => 'All Programs',
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
    'prompt' => 'All Ages',
    'slug' => 'ages',
    'config' => array(
      'hierarchical' => true,
      'depth' => 1,
      'hide_empty' => true,
      'orderby' => 'term_order'
    )
  )
);


/**
 * Functions
 */

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
  return get_field(FIELD_BANNER_IMAGE, 'option');
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

  // Add the reset filter
  array_unshift($filter, array(
    'slug' => 'all_' . TAXONOMIES[$slug]['slug'],
    'name' => __(TAXONOMIES[$slug]['name'], TRANSLATION_DOMAIN),
    'link' => esc_url(remove_query_arg($slug))
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
      $value['name'] = __($value['name'], TRANSLATION_DOMAIN);
      $value['prompt'] = __($value['prompt'], TRANSLATION_DOMAIN);
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
 * Get the post type taxonomy configuration
 * @return array The taxonomy configuration defined above
 */
function get_taxonomies() {
  return TAXONOMIES;
}
