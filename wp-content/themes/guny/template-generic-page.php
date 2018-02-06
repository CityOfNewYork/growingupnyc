<?php

/*
Template Name: Generic Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

$templates = array('generic-page.twig');

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

Timber::render($templates, $context);