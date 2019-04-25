<?php

add_action( 'wpmc_scan_postmeta', 'wpmc_scan_postmeta_acf' );

function wpmc_scan_postmeta_acf( $id ) {
	$fields = get_field_objects( $id );
	if ( is_array( $fields ) ) {
		foreach ( $fields as $field )
			wpmc_scan_postmeta_acf_field( $field, $id, 8 );
	}
}

/**
 * Scans a single ACF field object.
 * If the specified field is a repeater or a flexible content,
 * scans each subfield recursively.
 *
 * @param array $field
 * An associative array replesenting a single ACF field.
 * The actual array must be structured like this:
 * array (
 *   'name'  => The name of the field
 *   'type'  => The field type i.e. 'text', 'object', 'repeater'
 *   'value' => The value
 *   ...
 * )
 * @param int $id The post ID
 * @param int $recursion_limit The max recursion depth. Negative number means unlimited
 *
 * @since ACF 5.6.10
 */
function wpmc_scan_postmeta_acf_field( $field, $id, $recursion_limit = -1 ) {
	if ( !isset( $field['type'] ) ) return;

	global $wpmc;

	/** Multiple Fields (Repeater or Flexible Content) **/
	static $recursives = array ( // Possibly Recursive Types
		'repeater',
		'flexible_content'
	);
	if ( in_array( $field['type'], $recursives ) && have_rows( $field['name'], $id ) ) {
		if ( $recursion_limit == 0 ) return; // Too much recursion
		do { // Iterate over rows
			$row = the_row( true );
			foreach ( $row as $col => $value ) { // Iterate over columns (subfields)
				$subfield = get_sub_field_object( $col, true, true );
				if ( !is_array( $subfield ) ) continue;
				if ( WP_DEBUG ) { // XXX Debug
					if ( !isset( $subfield['value'] ) ) trigger_error( 'Unexpected Situation: $subfield[value] is not set', E_USER_ERROR );
					if ( $subfield['value'] != $value ) trigger_error( 'Unexpected Situation: $subfield[value] has unexpected value', E_USER_ERROR );
				}
				wpmc_scan_postmeta_acf_field( $subfield, $id, $recursion_limit - 1 ); // Recursion
			}
		} while ( have_rows( $field['name'], $id ) );
		return;
	}
	/** Singular Field **/
	$postmeta_images_acf_ids = array();
	$postmeta_images_acf_urls = array();

	$format = "";
	if ( isset( $field['return_format'] ) )
		$format = $field['return_format'];
	else if ( isset( $field['save_format'] ) )
		$format = $field['save_format'];

	// ACF Image ID and URL
	if ( $field['type'] == 'image' && ( $format == 'array' || $format == 'object' ) ) {
		if ( !empty( $field['value']['id'] ) )
			array_push( $postmeta_images_acf_ids, $field['value']['id'] );
		if ( !empty( $field['value']['url'] ) )
			array_push( $postmeta_images_acf_urls, $wpmc->clean_url( $field['value']['url'] ) );
	}
	// ACF Image ID
	else if ( $field['type'] == 'image' && $format == 'id' && !empty( $field['value'] ) ) {
		array_push( $postmeta_images_acf_ids, $field['value'] );
	}
	// ACF Image URL
	else if ( $field['type'] == 'image' && $format == 'url' && !empty( $field['value'] ) ) {
		array_push( $postmeta_images_acf_urls, $wpmc->clean_url( $field['value'] ) );
	}
	// ACF Gallery
	else if ( $field['type'] == 'gallery' && !empty( $field['value'] ) ) {
		foreach ( $field['value'] as $media ) {
			if ( !empty( $media['id'] ) )
				array_push( $postmeta_images_acf_ids, $media['id'] );
		}
	}
	$wpmc->add_reference_id( $postmeta_images_acf_ids, 'ACF (ID)' );
	$wpmc->add_reference_url( $postmeta_images_acf_urls, 'ACF (URL)' );
}

?>