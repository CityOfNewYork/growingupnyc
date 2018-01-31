<?php
$context = Timber::get_context();
$posts = Timber::get_posts();
$posts = Templating\format_posts($posts);
$context['posts'] = $posts;
$templates = array( 'partials/post-list.twig' );
Timber::render( $templates, $context );
