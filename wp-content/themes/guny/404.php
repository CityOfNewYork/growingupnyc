<?php
/**
* 404
*/

$context = Timber::get_context();
$context['top_widget'] = Timber::get_widgets('top_widget');

$post_id = icl_object_id(get_page_by_title( '404' )->ID, 'page', FALSE, ICL_LANGUAGE_CODE);
$post = get_page($post_id);

$context['post'] = $post;
$context['side_menu_categories'] = get_field('side_menu_categories', $post->id);

Timber::render(array('404.twig'), $context);