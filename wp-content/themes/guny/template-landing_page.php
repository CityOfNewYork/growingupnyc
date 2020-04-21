<?php

/*
Template Name: Landing Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

// determine if landing is microsite
if (is_int($post->post_parent)) {
  $context['page_title'] = GunyLandingPages\get_title($post->ID);
  $context['page_tagline'] = GunyLandingPages\get_tagline($post->ID);

  $templates = array( 'microsite-landing-virtual.twig' );
  $context['shareAction'] = admin_url( 'admin-ajax.php' );
  $context['shareHash'] = \SMNYC\hash($post->link);

  $context['shareTemplate'] = "generationnyc-covid-response";

}
$context['post'] = $post;
$context['meta_desc'] = $post->meta_description;
$context['meta_keywords'] = $post->meta_keywords;

Timber::render( $templates, $context );
