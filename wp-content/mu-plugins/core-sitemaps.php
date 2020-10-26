<?php

// phpcs:disable
/**
 * Plugin Name: Configure Growing Up NYC Core Sitemaps
 * Description: Configuration for the WordPress sitemaps. Filters out users, taxonomies, and other post types that do not have page views.
 * Plugin URI: https://github.com/cityofnewyork/nyco-wp-docker-boilerplate/wp/wp-content/mu-plugins/core-sitemaps.php
 * Author: NYC Opportunity
 */
// phpcs:enable

/**
 * Removes sitemaps for users
 */
add_filter('wp_sitemaps_add_provider', function( $provider, $name ) {
  if ( 'users' === $name ) {
    return false;
  }
  return $provider;
}, 10, 2);

/**
 * Removes sitemaps for specific post types
 */
add_filter('wp_sitemaps_post_types',function( $post_types ) {
  unset( $post_types['banner'] );
  unset( $post_types['smnyc-sms-gunyc'] );
  unset( $post_types['smnyc-sms'] );
  unset( $post_types['tribe_venue'] );
  unset( $post_types['tribe_organizer'] );
  return $post_types;
});

/**
 * Removes sitemaps for taxonomies
 */
add_filter('wp_sitemaps_taxonomies', function( $taxonomies ) {
  unset( $taxonomies['afterschool_programs_cat'] );
  unset( $taxonomies['age_group'] );
  unset( $taxonomies['borough'] );
  unset( $taxonomies['programs_cat'] );
  unset( $taxonomies['tip_category'] );
  unset( $taxonomies['tribe_events_cat'] );
  unset( $taxonomies['topic_group'] );
  unset( $taxonomies['inspiration_group'] );
  unset( $taxonomies['trip_type'] );
  unset( $taxonomies['trip_free_this_week'] );
  unset( $taxonomies['trip_free_day_trip'] );
  unset( $taxonomies['other_category'] );
  return $taxonomies;
});
