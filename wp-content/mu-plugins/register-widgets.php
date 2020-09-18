<?php
/**
 * Plugin Name: Register Widgets
 * Description: Registers sidebar widgets
 * Author: Mayor's Office for Economic Opportunity
 */

add_action( 'widgets_init', function(){
  register_sidebar(array(
    'id' => 'footer_widgets',
    'name' => __('Footer'),
    'description' => __('Widgets in the site global footer'),
    'before_widget' => '',
    'after_widget' => ''
  ));
  register_sidebar(array(
    'id' => 'search_guny_widgets',
    'name' => __('Search Growing Up'),
    'description' => __('Manually selected top posts for Growing Up'),
    'before_widget' => '',
    'after_widget' => ''
  ));
  register_sidebar(array(
    'id' => 'search_generation_widgets',
    'name' => __('Search Generation'),
    'description' => __('Manually selected top posts for Generation'),
    'before_widget' => '',
    'after_widget' => ''
  ));
} );
