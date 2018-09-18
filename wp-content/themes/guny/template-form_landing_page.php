<?php

/*
Template Name: Form Landing Page
*/
$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;
$featured_image = get_the_post_thumbnail_url($post);
$context['featured_image'] = $featured_image;

$templates = array( 'form-landing-page.twig' );
Timber::render( $templates, $context );

