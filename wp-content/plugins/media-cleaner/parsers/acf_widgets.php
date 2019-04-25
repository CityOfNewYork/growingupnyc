<?php

// ACF Widget plugin
// https://acfwidgets.com
// Added by Mike Meinz

// Each field is a separate row in the wp_options table

add_action( 'wpmc_scan_widget', 'wpmc_scan_widget_acf_widgets', 10, 1 );

function wpmc_scan_widget_acf_widgets( $widget ) {
	$acfwidget = $widget['callback'][0]->id;
	If ( strlen($acfwidget)>11 && substr($acfwidget,0,11)=='acf_widget_' )
		get_images_from_acfwidgets ( $acfwidget );
}

function get_images_from_acfwidgets( $widget) {
	global $wpmc;
	global $wpdb;
	// $widget starts with: acf_widget_ and looks like this: acf_widget_15011-2
	$LikeKey = 'widget_' . $widget . '_%'; // Example: option_name starts with widget_acf_widget_15216-3_
	$q = "SELECT option_name, option_value FROM {$wpdb->options} where option_name like %s;";
	$OptionRows = $wpdb->get_results( $wpdb->prepare( $q, $LikeKey ) , ARRAY_N );
	if ( $wpdb->last_error ) {
		error_log( $q . " " . $wpdb->last_error );
		$wpmc->log( $q . " " . $wpdb->last_error );
		die( $wpdb->last_error );
	}
	if ( count( $OptionRows ) > 0 ) {
		$ACFWidget_ids = array();
		$ACFWidget_urls = array();
		foreach( $OptionRows as $row ) {
			//$row[0] = option_name from wp_options
			//$row[1] = option_value from wp_options
			// Three if statements in priority order (image ids, link fields, text fields)
			// *** An image field containing a post id for the image or is it???
			if ( strpos($row[0], 'image') || strpos($row[0], 'icon') !== false ) {
				if ( is_numeric( $row[1] ) ) {
					array_push( $ACFWidget_ids, $row[1] );
				}
			}

			// No else here because sometimes image or icon is present in the option_name and link is also present
			// Example: widget_acf_widget_15011-2_link_1_link_icon
			// Example: widget_acf_widget_15216-3_widget_image_link

			// *** A link field may contain a link or be empty
			if ( strpos( $row[0], 'link' ) || strpos( $row[0], 'url' ) !== false ) {
				if ( $wpmc->is_url($row[1]) ) {
					$url = $wpmc->clean_url($row[1]);
					if (!empty($url)) {
						array_push($ACFWidget_urls, $url);
					}
				}
			}

			// *** A text field may contain HTML
			if (strpos($row[0], 'text') || strpos($row[0], 'html') !== false) {
				if (!empty($row[1])) {
					$ACFWidget_urls = array_merge($ACFWidget_urls, $wpmc->get_urls_from_html($row[1]));  // mm change
				}
			}
		}
		if ( !empty( $ACFWidget_ids ) ) {   // mm change
			$wpmc->add_reference_id( $ACFWidget_ids , 'ACF WIDGET (ID)' );
		}
		if ( !empty( $ACFWidget_urls ) ) {  // mm change
			$wpmc->add_reference_url( $ACFWidget_urls , 'ACF WIDGET (URL)' );
		}
	}
}

?>