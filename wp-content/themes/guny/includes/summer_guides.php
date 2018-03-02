<?php

/**
 * Config and functions for Summer Guides
 */

namespace SummerGuides;

/**
 * Dependencies
 */

use Michelf\Markdown;


/**
 * Constants
 */

// The post type slug
const SLUG = 'summer-guide';

// The translation domain for WPML
const TRANSLATION_DOMAIN = 'guny-summer-guide';

// Custom field IDs
const FIELD_CALL_TO_ACTION = 'field_5a972d6549e96';

const FIELD_LOCATION_DESCRIPTION = 'field_5a972d0ffd99e';

const FIELD_DATE_OPTIONS = 'field_5a9727557ffee';

const FIELD_SECTIONS = 'field_5a78cc2bc5e51';



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
