<?php

/*
Template Name: Landing Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

// determine if landing is microsite
if (($post->post_parent)>0) {
  $templates = array( 'microsite-landing-page.twig' );
} else {
  $templates = array( 'landing-page.twig' );

  // upcoming events for young children
  $lang = ICL_LANGUAGE_CODE == 'en' ? '': '-'.ICL_LANGUAGE_CODE;
  $upcoming_events = GunySite::get_featured_events( 3, array(
    'relation' => 'OR',
    array(
      'taxonomy' => 'age_group',
      'field' => 'slug',
      'terms' => 'baby'.$lang
    ),
    array(
      'taxonomy' => 'age_group',
      'field' => 'slug',
      'terms' => 'toddler'.$lang
    )
  ), true );
  $context['upcoming_events'] = $upcoming_events;
}
// temporary virtual events
$context['virtual_event'] = true;
$context['page_title'] = GunyLandingPages\get_title($post->ID);
$context['page_tagline'] = GunyLandingPages\get_tagline($post->ID);
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash($post->link);
$context['shareTemplate'] = GunyLandingPages\get_share_template($post->ID);
$context['post'] = $post;
$context['meta_desc'] = $post->meta_description;
$context['meta_keywords'] = $post->meta_keywords;
$context['eventslink'] = get_post_type_archive_link('tribe_events');

Timber::render( $templates, $context );
