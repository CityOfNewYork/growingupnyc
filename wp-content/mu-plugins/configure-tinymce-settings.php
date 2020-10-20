<?php
/**
 * Plugin Name: Configure TinyMCE Settings
 * Description: Configuration for the classic WordPress text editor. Adds p, h2, h3, h4, and h5 block options to the TinyMCE editor. Removes the blockquote block. Removes underline, alignjustify, and forecolor from advanced toolbar. Removes the TinyMCE Emoji Plugin.
 * Author: Blue State Digital
 */

add_filter( 'tiny_mce_before_init', function($init){
  $init['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;';
  return $init;
} );

/**
* Remove buttons from the primary toolbar
*/
add_filter( 'mce_buttons', function($buttons) {
  $remove = array(
    'blockquote',
    'wp_more'
  );
  return array_diff( $buttons, $remove );
} );

/**
* Remove buttons from the advanced toolbar
*/
add_filter( 'mce_buttons_2', function($buttons) {
  $remove = array(
    'alignjustify',
    'forecolor',
    'charmap',
    'wp_help'
  );
  return array_diff( $buttons, $remove );
});

/**
* Add buttons to the advanced toolbar
*/
add_filter( 'mce_buttons_3', function($buttons) {
  $buttons = array(
    'cut',
    'copy',
    'paste',
    'table'
  );
  return $buttons;
});

/**
 * Filter function used to remove the tinymce emoji plugin.
 * Taken from https://wordpress.org/plugins/disable-emojis/
 * @param  array $plugins
 * @return array Difference between the two arrays
 */
add_filter('tiny_mce_plugins', function ($plugins) {
  if (is_array($plugins)) {
    return array_diff($plugins, array( 'wpemoji' ));
  } else {
    return array();
  }
});