<?php

/**
 * Config and functions for Brain Building Tips
 */

namespace BrainBuildingTip;

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
const SLUG = 'brain-building-tip';

// This doesn't affect the route, but it's used as a reference to the page
// path for getting custom field content.
const PATH = '/brainbuilding';

// The translation domain for WPML
const TRANSLATION_DOMAIN = 'guny-brain-building-tip';

// Tagline custom field in group_5a9d9040b6b10.json
const FIELD_TAGLINE = 'field_5a9d9040cb271';

// The theme options setting for the banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE = 'field_5a9dbafbc4617';

// The theme options setting for the mobile banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE_MOBILE = 'field_5e3ae9fb8700e';

/**
 * Functions
 */

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id() {
  return get_page(icl_object_id(get_page_by_path(PATH)->ID, 'page', true, ICL_LANGUAGE_CODE));
}

/**
 * Get the title from the landing page post
 * @return string The page title
 */
function get_title() {
  return get_the_title(get_controller_id());
}

/**
 * Get the tagline from the landing page post
 * @return string The page tagline
 */
function get_tagline() {
  return get_field(FIELD_TAGLINE, get_controller_id());
}

/**
 * Get the hero banner image for the archive page
 * @return Object The media image object
 */
function get_hero_banner_img() {
  return get_field(FIELD_BANNER_IMAGE, get_controller_id());
}

/**
 * Get the mobile hero banner image for the archive page
 * @return Object The media image object
 */
function get_hero_banner_img_mobile() {
  return get_field(FIELD_BANNER_IMAGE_MOBILE, get_controller_id());
}