<?php
/**
* Single entry template. Used for posts and other individual content items.
*
* To override for a particular post type, create a template named single-[post_type]
*/

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

// SHARE - SMS
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash($post->link);
$context['shareTemplate'] = "generationnyc-".$post->post_type;

// meta tags
$context['meta_desc'] = get_field('meta_description', $post->id);
$context['meta_keywords'] = get_field('meta_keywords', $post->id);
$context['meta_noindex'] = get_field('meta_noindex', $post->id);

// Program and Topic post alert banner
$banner = get_field('current_banner');
$context['banner']['alt'] = new TimberPost($banner);
$context['banner']['override'] = $post->update_banner;

$context['custom_favicon'] = get_field('updated_favicon', $post->id);

$template = 'inspiration/single-inspiration.twig';
Timber::render( $template, $context );