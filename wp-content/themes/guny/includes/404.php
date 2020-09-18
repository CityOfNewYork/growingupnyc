<?php

/**
 * Config and functions for the 404 controller
 */

namespace NotFound;

/**
 * Dependencies
 */

use Templating as Templating;

/**
 * Constants
 */

// The routing path. This doesn't affect the Timber route but it is used
// by templates and the redirect function in the routing config. Used in
// conjunction with get_home_url() insures that the WPML language path prefix
// is set properly. Also used for getting 404 settings defined in the
// '404' (slug; '/404-2') Wordpress page. The slug defaults to '/404-2',
// Wordpress doesn't support pages with only numeric permalinks.
CONST PATH = '/404-2';

// The field ID for side hero header
// 404 Options > Header
// group_5bec762f0295a.json
const HERO_HEADER = 'field_5bec7aeb26db1';

// The field ID for the side hero tagline
// 404 Options > Tagline
// group_5bec762f0295a.json
const HERO_TAGLINE = 'field_5bec81c4fae9a';

// The field ID for the side button text
// 404 Options > Button Text
// group_5bec762f0295a.json
const HERO_BTN_TEXT = 'field_5bec81d1fae9b';

// The field ID for the side hero button url
// 404 Options > Button URL
// group_5bec762f0295a.json
const HERO_BTN_URL = 'field_5bec81dbfae9c';

// The field ID for the side menu header
// 404 Options > Menu Header
// group_5bec762f0295a.json
const MENU_HEADER = 'field_5bec81e6fae9d';

// The field ID for the side menu categories
// 404 Options > Menu Categories
// group_5bec762f0295a.json
const MENU_CATEGORIES = 'field_5bec81f6fae9e';

/**
 * Functions
 */

/**
 * Get the id of the post through the page path.
 * Requires a page of the same slug (PATH) as above to be created.
 * @return integer The ID of the post
 */
function get_controller_id() {
  $arr_path = explode('/', strtok($_SERVER["REQUEST_URI"],'?'));

  if (array_search('generationnyc', $arr_path)){
    $path = '/generationnyc'.PATH;
    return get_page_by_path($id, 'page', false, ICL_LANGUAGE_CODE)->ID;
  } else {
    $path = PATH;
    return get_page_by_path(($path)->ID, 'page', true, ICL_LANGUAGE_CODE)->ID;
  }
}

/**
 * Return string of the text for the hero header
 * @return string hero header text
 */
function get_hero_header() {
  $content = get_field(HERO_HEADER, get_controller_id());
  return $content;
}

/**
 * Return string of the text for the hero tagline
 * @return string hero tagline text
 */
function get_hero_tagline() {
  $content = get_field(HERO_TAGLINE, get_controller_id());
  return $content;
}

/**
 * Return string of the text for the hero button
 * @return string hero button text
 */
function get_hero_button_text() {
  $content = get_field(HERO_BTN_TEXT, get_controller_id());
  return $content;
}

/**
 * Return string of the url path for the hero button
 * @return string hero button url
 */
function get_hero_button_url() {
  $content = get_field(HERO_BTN_URL, get_controller_id());
  return $content;
}

/**
 * Return string of the text to display as the menu header
 * @return string menu header
 */
function get_menu_header() {
  $content = get_field(MENU_HEADER, get_controller_id());
  return $content;
}

/**
 * Return the markup for the menu category items
 * @return string HTML markup
 */
function get_menu_categories() {
  $content = get_field(MENU_CATEGORIES, get_controller_id());

  $menu_cats = array();

  if ($content) {
    foreach ($content as $key => $value) {
      $text = explode(', ', $value['button_text']);
      $text = implode('", "', $text);

      $link = explode(', ', $value['button_link']);
      $link = implode('", "', $link);

      $test['text'] = $text;
      $test['link'] = $link;

      array_push($menu_cats, $test);
    }
  }
  
  return $menu_cats;
}

/**
 * Return the number of menu category items
 * @return integer category count
 */
function get_menu_categories_count() {
  $count = 0;
  $content = get_field(MENU_CATEGORIES, get_controller_id());

  if ($content) {
    foreach ($content as $key => $value) {
      $count++;
    }
  }

  return $count;
}