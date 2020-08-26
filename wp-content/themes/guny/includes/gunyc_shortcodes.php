<?php

/**
* NYC logo embedded in the WYSIWYG of a detail page
*
* @return string HTML markup containing embedded SVG
*/
function guny_logo() {
  $output = '<svg role="img" class="icon--nyc"><title>New York City</title><use xlink:href="#icon-nyc-logo"></use></svg>';
  return $output;
}
add_shortcode( 'nyc_logo', 'guny_logo' );

/**
* Insert a link styled as a button
*
* @param array $attr {
*  Attributes of the button shortcode
*  @type string $url   URL the button should link to
*  @type string $text  Text to appear on the button
* }
* @return string HTML markup containing link with the button classes applied
*/

/**
* Growing Up
*/
function guny_button( $attr ) {
  $atts = shortcode_atts( array(
    'url' => null,
    'text' => null,
    'color' => null
  ), $attr );

  // Both URL and Text are required
  // If either is missing, don't return anything
  if ( empty( $atts['url' ] ) || empty( $atts['text'] ) ) {
    return;
  }

  // return the button based on theme otherwise, default
  if ($atts['color'] == 'afterschool') {
    return '<a href="' . $atts['url'] . '" class="button--simple bg-color-blue-dark hover:bg-color-blue-mid text-color-white">' . $atts['text'] . '</a>';
  }
  else if ($atts['color'] == 'summer') {
    return '<a href="' . $atts['url'] . '" class="button--simple bg-color-orange-dark hover:bg-color-orange-light text-color-white">' . $atts['text'] . '</a>';
  }
  else {
    return '<a href="' . $atts['url'] . '" class="button--simple bg-color-blue hover:bg-color-blue-dark text-color-white">' . $atts['text'] . '</a>';
  }
}
add_shortcode( 'button', 'guny_button' );

/**
* Generation
*/
function gny_button( $attr ) {
  $atts = shortcode_atts( array(
    'url' => null,
    'text' => null,
    'color' => null
  ), $attr );

  // Both URL and Text are required
  // If either is missing, don't return anything
  if ( empty( $atts['url' ] ) || empty( $atts['text'] ) ) {
    return;
  }

  if (empty($atts['color'])) {
    return '<a href="' . $atts['url'] . '" class="button--primary button--primary__purple">' . $atts['text'] . '</a>';
  } else {
    return '<a href="' . $atts['url'] . '" class="button--primary button--primary__' . $atts['color'] . '">' . $atts['text'] . '</a>';
  }
}
add_shortcode( 'gny_button', 'gny_button' );

/**
* Add the custom shortcodes to the TinyMCE dropdown
*/
function guny_add_custom_shortcodes($shortcodes) {
  $shortcodes['NYC Logo'] = '[nyc_logo]';
  $shortcodes['Button (Growing Up)'] = '[button url="" text="" color=""]';
  $shortcodes['Summer Button'] = '[button url="" text="" color="summer"]';
  $shortcodes['Afterschool Button'] = '[button url="" text="" color="afterschool"]';
  $shortcodes['Button (Generation)'] = '[gny_button url="" text="" color=""]';
  return $shortcodes;
}
add_filter( 'bsd_shortcode_list', 'guny_add_custom_shortcodes' );
