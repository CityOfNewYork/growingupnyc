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

// Borrough filter term configuration
const CONFIG_BORROUGH = array(
  'hierarchical' => true,
  'depth' => 1,
  'orderby' => 'NAME',
  'hide_empty' => false
);

// Age filter term configuration
const CONFIG_AGE = array(
  'hierarchical' => true,
  'depth' => 1,
  'hide_empty' => true,
  'orderby' => 'term_order'
);

// The base configuration for all filters
const FILTERS = array(
  // Someone misspelled 'borrough' when initially setting up the taxonomy
  'borough' => array(
    'name' => 'All Borroughs',
    'prompt' => 'All Borroughs',
    'slug' => 'borroughs'
  ),
  'summer_programs_cat' => array(
    'name' => 'All Programs',
    'prompt' => 'All Programs',
    'slug' => 'programs'
  ),
  'age_group' => array(
    'name' => 'All Ages',
    'prompt' => 'All Ages',
    'slug' => 'ages'
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

/**
 * Return the translation domain for templates
 * @return string The translation domain constant
 */
function get_translation_domain() {
  return TRANSLATION_DOMAIN;
}

/**
 * Get the filter template data for a taxonomy
 * @return [array] The collection of filters with slug, name, and links
 */
function get_filter($translate_ids = false, $slug) {
  $filter = array();

  // Works in context of the post type/archive type
  $filter = Timber::get_terms($slug, CONFIG_AGE);

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
    'slug' => 'all_' . FILTERS[$slug]['slug'],
    'name' => __(FILTERS[$slug]['name'], TRANSLATION_DOMAIN),
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

  foreach (FILTERS as $key => $value) {
    $value['filters'] = get_filter($translate_ids, $key);
    if (sizeof($value['filters'])) {
      $value['name'] = __($value['name'], TRANSLATION_DOMAIN);
      $value['prompt'] = __($value['prompt'], TRANSLATION_DOMAIN);
      $filters[$key] = $value;
    }
  }

  return $filters;
}
