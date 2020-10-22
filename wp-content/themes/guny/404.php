<?php
/**
 * Template Name: 404
*/

$context = Timber::get_context();

$path = '/404-2';
$post_id = Templating\get_controller_id($path);
$post = Timber::get_post($post_id);

$context['post'] = $post;
Timber::render(array('404.twig'), $context);