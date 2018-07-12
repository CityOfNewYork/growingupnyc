<?php

/**
* Expose custom fields to the rest api
*/

add_filter('register_post_type_args', 'events_to_rest', 10, 2);
function events_to_rest($args, $post_type){
  if ($post_type == 'tribe_events'){
    $args['show_in_rest'] = true;
  }

  return $args;
}

function events_meta_to_rest() {
	register_rest_field( 
		'tribe_events',
		'meta',
		array(
			'get_callback'    => 'get_events_meta',
			'update_callback' => null,
			'schema'          => null
		)
	);
}
add_action( 'init', 'events_meta_to_rest' );

function get_events_meta( $object, $field_name, $request ) {
	return get_post_meta($object['id']);
}
