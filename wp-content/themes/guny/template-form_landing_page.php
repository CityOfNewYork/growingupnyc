<?php

/*
Template Name: Form Landing Page
*/
$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;

$templates = array( 'form-landing-page.twig' );
Timber::render( $templates, $context );

