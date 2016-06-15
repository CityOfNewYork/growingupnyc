<?php
/*
Template Name: Landing Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$templates = array( 'landing-page.twig' );

$context['post'] = $post;

Timber::render( $templates, $context );