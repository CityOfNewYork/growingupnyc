<?php
/**
 * Single Event Template
 *
 * Overrides plugin template
 *
 * @package TribeEventsCalendar
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$context = Timber::get_context();
$post = Timber::get_post(false, 'GunyEvent');
$context['post'] = $post;
// check the language
$context['language'] = ICL_LANGUAGE_CODE;

// Determine virtual event
$virtual = array_search('virtual', array_column(wp_get_post_terms($post->id, 'tribe_events_cat'), "slug"));
if (is_int($virtual)) {
  $context['virtual_event'] = true;
} else {
  $context['virtual_event'] = false;
}

// top menu widget
$context['top_widget'] = Timber::get_widgets('top_widget');

$template = 'tribe_events/single.twig';

Timber::render( $template, $context );
