<?php

/**
 * Config and functions for working with ACF Flexible Content
 */

namespace Templating;

/**
 * Constants
 */

// The field ID for flexible content sections
// Sections
// group_5a78cc3d72f5c.json
const SECTION_ID = 'field_5a78cc2bc5e51';

/**
 * Functions
 */

/**
 * Gets the sections by ACF field id and formats them with slugs based on the
 * section title.
 * @return array The collection of sections for the post.
 */
function get_sections() {
  $sections = get_field(SECTION_ID);
  if ($sections) {
    foreach ($sections as $key => $value) {
      $sections[$key]['slug'] = strtolower(
        str_replace(' ', '-', $value['section_title'])
      );
    }
  }
  return $sections;
}