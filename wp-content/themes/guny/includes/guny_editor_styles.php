<?php

/**
* Configure TinyMCE settings
*/
function guny_configure_tinymce( $init ) {
  $init['block_formats'] = 'Paragraph=p;Heading 2=h2;Heading 3=h3;';
  return $init;
}
add_filter( 'tiny_mce_before_init', 'guny_configure_tinymce' );

/**
* Remove buttons from the primary toolbar
*/
function guny_mce_buttons( $buttons ) {
  $remove = array( 
    'blockquote',
    'alignleft',
    'alignright',
    'aligncenter',
    'strikethrough',
    'bullist',
    'numlist',
    'hr',
    'wp_more'
  );
  return array_diff( $buttons, $remove );
}
add_filter( 'mce_buttons', 'guny_mce_buttons' );

/**
* Remove buttons from the advanced toolbar
*/
function guny_mce_buttons_2( $buttons ) {
  $remove = array( 
    'underline', 
    'alignjustify',
    'forecolor',
    'pastetext',
    'charmap',
    'outdent',
    'indent',
    'undo',
    'redo',
    'wp_help'
  );
  return array_diff( $buttons, $remove );
}
add_filter( 'mce_buttons_2', 'guny_mce_buttons_2' );

/**
* Add buttons to the advanced toolbar
*/
function guny_mce_buttons_3( $buttons ) {
  $buttons = array(
    'cut',
    'copy',
    'paste'
  );
  return $buttons;
}
add_filter( 'mce_buttons_3', 'guny_mce_buttons_3' );