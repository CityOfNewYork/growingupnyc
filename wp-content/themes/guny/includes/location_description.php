<?php

/**
 * Formating for the location description field
 */

namespace Templating;

/**
 * Dependencies
 */

use Michelf\Markdown;


/**
 * Constants
 */

// The custom field id, in group_5a972d1a179ee.json
const FIELD_LOCATION_DESCRIPTION = 'field_5a972d0ffd99e';


/**
 * Functions
 */

/**
 * Get the location description content in markdown, but remove the paragraph
 * tags from the output because it is a single line.
 * @return string The formated markdown link content marked up with html tags
 */
function get_location_description($id = null) {
  $parser = new Markdown;
  $parser->hard_wrap = false;
  return str_replace(["</p>\n\n<p>", '<p>', '</p>'], ["\n\n", ""],
    $parser->transform(get_field(FIELD_LOCATION_DESCRIPTION, $id))
  );
}
