<?php

/**
* Configure TinyMCE settings
*/
function guny_configure_tinymce( $init ) {
  $init['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4;Heading 5=h5';
  return $init;
}
add_filter( 'tiny_mce_before_init', 'guny_configure_tinymce' );

/**
* Remove buttons from the primary toolbar
*/
function guny_mce_buttons( $buttons ) {
  $remove = array( 'blockquote' );
  return array_diff( $buttons, $remove );
}
add_filter( 'mce_buttons', 'guny_mce_buttons' );

/**
* Remove buttons from the advanced toolbar
*/
function guny_mce_buttons_2( $buttons ) {
  $remove = array( 'underline', 'alignjustify', 'forecolor' );
  return array_diff( $buttons, $remove );
}
add_filter( 'mce_buttons_2', 'guny_mce_buttons_2' );