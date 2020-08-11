<?php

/**
 * Config and functions for Templates
 */

namespace Templating;

/**
 * Dependencies
 */

use Timber;

/**
 * Constants
 */

// Tagline custom field in group_5a9d9040b6b10.json
const FIELD_TAGLINE = 'field_5a9d9040cb271';

// The theme options setting for the banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE = 'field_5a9dbafbc4617';

// The theme options setting for the mobile banner image in group_5a9d9040b6b10.json
const FIELD_BANNER_IMAGE_MOBILE = 'field_5e3ae9fb8700e';

// The share template
const SHARE_TEMPLATE = 'field_5e9f4df2bbab7';

/**
 * Functions
 */

/**
 * Get the id of the post through the page path. Requires a page
 * of the same slug as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id($path) {
  return get_page(icl_object_id(get_page_by_path($path)->ID, 'page', true, ICL_LANGUAGE_CODE));
}

/**
 * Get the archive of the post type by it's slug
 * @return string The post type archive link
 */
function get_archive_link($post_type) {
  return get_post_type_archive_link($post_type);
}

/**
 * Get the hero banner image for the archive page
 * @return Object The media image object
 */
function get_hero_banner_img($path) {
  return get_field(FIELD_BANNER_IMAGE, get_controller_id($path));
}

/**
 * Get the mobile hero banner image for the archive page
 * @return Object The media image object
 */
function get_hero_banner_img_mobile($path) {
  return get_field(FIELD_BANNER_IMAGE_MOBILE, get_controller_id($path));
}

/**
 * Get the tagline from the landing page post
 * @return string The page tagline
 */
function get_tagline($path) {
  return get_field(FIELD_TAGLINE, get_controller_id($path));
}

/**
 * Get the title from the landing page post
 * @return string The page title
 */
function get_title($path) {
  return get_the_title(get_controller_id($path));
}

/**
 * Get the alert
 * @return string The alert
 */
function get_alert_content($path) {
  return get_field('banner_content', get_field('banner_alert_message', get_controller_id($path)));
}

/**
 * Get the share template name
 * @return Object The media image object
 */
function get_share_template($id) {
  return get_field(SHARE_TEMPLATE, $id)->post_name;
}