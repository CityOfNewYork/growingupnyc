<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();

$featuredposts = array(
'post_type' => 'inspiration',
'posts_per_page' => 1,
'tax_query' => array(
  array(
    'taxonomy' => 'inspiration_group',
    'field' => 'slug',
    'terms' => 'featured-inspiration',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['featuredposts'] = Timber::get_posts( $featuredposts );

$posts = array(
'post_type' => 'inspiration',
'posts_per_page' => 2,
'tax_query' => array(
  array(
    'taxonomy' => 'inspiration_group',
    'field' => 'slug',
    'terms' => 'featured-inspiration',
    'operator' => 'NOT IN',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['posts'] = Timber::get_posts( $posts );
$templates = array( 'list-inspiration-landing.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );