<?php
$context = Timber::get_context();
$posts = Timber::get_posts();
$context['posts'] = $posts;
$templates = array( 'partials/program-list.twig' );
// check the language
$context['language'] = ICL_LANGUAGE_CODE;
Timber::render( $templates, $context );
