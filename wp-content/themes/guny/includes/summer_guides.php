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
use Michelf\Markdown;


/**
 * Constants
 */

// The post type slug
const SLUG = 'summer-guide';

// The translation domain for WPML
const TRANSLATION_DOMAIN = 'guny-summer-guide';

// Custom post type field IDs
const FIELD_CALL_TO_ACTION = 'field_5a972d6549e96';

const FIELD_LOCATION_DESCRIPTION = 'field_5a972d0ffd99e';

const FIELD_DATE_OPTIONS = 'field_5a9727557ffee';

const FIELD_SECTIONS = 'field_5a78cc2bc5e51';

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
 * Get the call to action custom field
 * @return [type] [description]
 */
function get_call_to_action() {
  return get_field(FIELD_CALL_TO_ACTION);
}

/**
 * [get_location_description description]
 * @return [type] [description]
 */
function get_location_description() {
  return Markdown::defaultTransform(
    get_field(FIELD_LOCATION_DESCRIPTION)
  );
}

/**
 * [get_date_options description]
 * @return [type] [description]
 */
function get_date_options() {
  return get_field(FIELD_DATE_OPTIONS);
}

/**
 * [get_sections description]
 * @return [type] [description]
 */
function get_sections() {
  return get_field(FIELD_SECTIONS);
}

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
function get_filter($translate_ids = false, $slug) {
  $filter = array();

  // Works in context of the post type/archive type
  $filter = Timber::get_terms($slug, TAXONOMIES[$slug]['config']);

  // If it's empty, just return what we got
  if (!sizeof($filter)) return $filter;

  foreach ($filter as $key => $value) {
    // Get properties of each item
    $filter[$key] = get_object_vars($value);
    // Translate the filter ID if needed
    $id = ($translate_ids) ?
      Wpml\get_translated_term_id($value->ID, $slug) : $value->ID;
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
 * @param  [boolean] $translate_ids Wether the ids are to be translated
 * @return [array]                  The collection of filters
 */
function get_filters($translate_ids = false) {
  $filters = array();

  foreach (TAXONOMIES as $key => $value) {
    $value['filters'] = get_filter($translate_ids, $key);
    if (sizeof($value['filters'])) {
      $value['name'] = __($value['name'], TRANSLATION_DOMAIN);
      $value['prompt'] = __($value['prompt'], TRANSLATION_DOMAIN);
      $filters[$key] = $value;
    }
  }

  return $filters;
}

/**
 * Get the post type taxonomy configuration
 * @return array The taxonomy configuration defined above
 */
function get_taxonomies() {
  return TAXONOMIES;
}
