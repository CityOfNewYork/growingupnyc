<?php

/*
Template Name: Generic Microsite Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$templates = array( 'generic-microsite-page.twig' );

$context['post'] = $post;

Timber::render( $templates, $context );