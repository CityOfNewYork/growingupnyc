<?php
$context = Timber::get_context();
$posts = Timber::get_posts();
$context['posts'] = $posts;
$templates = array( 'partials/topic-list.twig' );
Timber::render( $templates, $context );
