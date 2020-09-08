<?php
/**
 * Plugin Name: Register Menus
 * Description: Adds header and footer menu.
 * Author: Mayor's Office for Economic Opportunity
 */

add_action('init', function() {
  register_nav_menus(
    array(
      'header-menu' => __( 'Header and Footer Primary Menu' ),
      'footer-menu-additional' => __( 'Footer Primary Additional [left]' ),
      'footer-menu-right' => __( 'Footer Tertiary [right]' ),
      'ms-header-menu' => __( 'MS Header and Footer Primary Menu' ),
      'ms-footer-menu-additional' => __( 'MS Footer Primary Additional [left]' ),
      'ms-footer-menu-right' => __( 'MS Footer Tertiary [right]' ),
      'footer-menu-left' => __( 'Footer Secondary [left]' )
    )
  );
});

/**
 * Remove unneeded menu items from admin dashboard
*/
add_action( 'admin_menu', function(){
  remove_menu_page( 'edit.php' );           //Posts
  remove_menu_page( 'edit-comments.php' );  //Comments
} );