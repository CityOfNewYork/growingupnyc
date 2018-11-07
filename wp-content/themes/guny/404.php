<?php
/**
* 404
*/

$context = Timber::get_context();

$post=get_page_by_title( '404 page' );
$context['post']=$post;

Timber::render(array('404.twig'), $context);
