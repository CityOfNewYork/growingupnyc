<?php

namespace Wpml;

/**
 * Returns the translated term id using wpml_object_id(WPML).
 * @param  integer $id   The post translated term id (post english)
 * @param  string  $type The term category
 * @return string        The pre translated term id (english)
 */
function get_translated_term_id($id, $type) {
  return apply_filters('wpml_object_id', $id, $type, false, 'en');
}

/**
 * Returns the translated term slug using wpml_object_id(WPML) and get_term(WP).
 * @param  integer $id   The post translated term id (post english)
 * @param  string  $type The term category
 * @return string        The pre translated term slug (english)
 */
function get_translated_term_slug($id, $type) {
  global $sitepress;

  $id = get_translated_term_id($id, $type);

  remove_filter('get_term', array($sitepress, 'get_term_adjust_id'), 1, 1);
  if (get_term($id, $type)) {
    $slug = get_term($id, $type)->slug;
  } else {
    trigger_error('Translated term unavailable, check the type or ID.');
    return;
  }
  add_filter('get_term', array($sitepress, 'get_term_adjust_id'), 1, 1);

  return $slug;
}
