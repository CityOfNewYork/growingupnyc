<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();
$context['posts'] = facetwp_display('template', 'free_day_trip');
$context['facet_trip'] = facetwp_display( 'facet', 'trip_free_day_trip' );
$context['pagination'] = facetwp_display('pager');
$templates = array( 'list-trip.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );