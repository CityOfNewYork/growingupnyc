<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$templates = array('single-' . $post->post_type . '.twig');

Timber::render($templates, $context);