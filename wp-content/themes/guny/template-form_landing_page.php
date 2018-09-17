<?php

/*
Template Name: Form Landing Page
*/
$context = Timber::get_context();

$post = Timber::get_post();

$context['post'] = $post;
// echo '<pre>',var_dump($post),'</pre>';
// echo '<pre>',$post->post_parent,'</pre>';
if( $post->post_parent > 0 ) {
	$context['parent'] = true;
}

$templates = array( 'form-landing-page.twig' );
Timber::render( $templates, $context );

