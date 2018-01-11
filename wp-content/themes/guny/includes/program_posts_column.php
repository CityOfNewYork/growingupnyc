<?php

namespace Admin;

/**
 * Filter for 'Program Name' applied to the columns shown when listing posts of
 * 'program' type. https://codex.wordpress.org/Plugin_API/Filter_Reference/mana
 * ge_$post_type_posts_columns
 * @param  [array] $columns An array of column name ⇒ label.
 * @return [array]          Updated array with 'Program Name'
 */
function program_posts_columns_name($columns) {
  $columns['program_name'] = 'Program Name';

  return $columns;
}

/**
 * Add 'Program Name' column content from pre translated post (english). https:
 * //codex.wordpress.org/Plugin_API/Action_Reference/manage_posts_custom_column
 * @param  [string]  $column_name The current column in loop.
 * @param  [integer] $id          The post id in loop.
 */
function program_posts_columns_content($column_name, $id) {
  if ($column_name !== 'program_name') return;

  $translated_id = apply_filters('wpml_object_id', $id, 'program', false, 'en');

  echo get_post_meta($translated_id)['program_name'][0];
}

add_filter('manage_program_posts_columns',
  'Admin\\program_posts_columns_name');

add_action('manage_program_posts_custom_column',
  'Admin\\program_posts_columns_content', 10, 2);
