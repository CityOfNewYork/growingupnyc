<?php
/**
* Single entry template. Used for posts and other individual content items.
*
* To override for a particular post type, create a template named single-[post_type]
*/

$context = Timber::get_context();
$post = Timber::get_post();

$templates = array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' );

$context['post'] = $post;

if ( is_front_page() ) {
  array_unshift( $templates, 'home.twig' );

  $context['testimonials'] = Timber::get_posts( array(
    'post_type' => 'testimonial',
    'numberposts' => 2,
    'post_status' => 'publish'
  ) );

  $context['recent_posts'] = Timber::get_posts( array(
    'post_type' => 'post',
    'numberposts' => 5,
    'post_status' => 'publish'
  ) );
} else {
  $sidebar_context = array();
  // Add any data to the sidebar here
  $sidebar_slug = guny_get_sidebar_slug( $post );
  if ( is_active_sidebar( 'sidebar_' . $sidebar_slug ) ) {
    $sidebar_context['widgets'] = Timber::get_widgets('sidebar_' . $sidebar_slug);
  } else {
    $sidebar_context['widgets'] = Timber::get_widgets('sidebar');
  }

  $context['sidebar'] = Timber::get_sidebar(['sidebar-' . $sidebar_slug . '.twig', 'sidebar.twig'], $sidebar_context);
}

Timber::render( $templates, $context );
