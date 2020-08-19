<?php
/**
 * Template Name: 404
*/

$context = Timber::get_context();
$post_id = NotFound\get_controller_id();
$post = Timber::get_post($post_id);

$context['post'] = $post;
Timber::render(array('404.twig'), $context);