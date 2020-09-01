<?php
/**
 * WP Rest API - Removal of Endpoints
 * reference: http://juha.blog/dev/wordpress/disable-wordpress-rest-api-endpoints-example-user-endpoint/
 */

// disable the users endpoint
add_filter( 'rest_endpoints', function( $endpoints ){
    if ( isset( $endpoints['/wp/v2/users'] ) ) {
        unset( $endpoints['/wp/v2/users'] );
    }
    if ( isset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] ) ) {
        unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
    }
    if ( isset( $endpoints['/wp/v2/users/me'] ) ) {
        unset( $endpoints['/wp/v2/users/me'] );
    }
    return $endpoints;
});

/**
 * add orderby filter for rest api
 */
add_filter( 'rest_post_collection_params', 'filter_add_rest_orderby_params', 10, 1 );
function filter_add_rest_orderby_params( $params ) {
	$params['orderby']['enum'][] = 'menu_order';
	return $params;
}