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