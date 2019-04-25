<?php

class Meow_WPMC_API {

	function __construct( $core, $admin ) {
		$this->core = $core;
		$this->admin = $admin;
		add_action( 'wp_ajax_wpmc_prepare_do', array( $this, 'wp_ajax_wpmc_prepare_do' ) );
		add_action( 'wp_ajax_wpmc_scan', array( $this, 'wp_ajax_wpmc_scan' ) );
		add_action( 'wp_ajax_wpmc_scan_do', array( $this, 'wp_ajax_wpmc_scan_do' ) );
		add_action( 'wp_ajax_wpmc_get_all_issues', array( $this, 'wp_ajax_wpmc_get_all_issues' ) );
		add_action( 'wp_ajax_wpmc_get_all_deleted', array( $this, 'wp_ajax_wpmc_get_all_deleted' ) );
		add_action( 'wp_ajax_wpmc_delete_do', array( $this, 'wp_ajax_wpmc_delete_do' ) );
		add_action( 'wp_ajax_wpmc_ignore_do', array( $this, 'wp_ajax_wpmc_ignore_do' ) );
		add_action( 'wp_ajax_wpmc_recover_do', array( $this, 'wp_ajax_wpmc_recover_do' ) );
		add_action( 'wp_ajax_wpmc_validate_option', array( $this, 'wp_ajax_wpmc_validate_option' ) );
	}

	/*******************************************************************************
	 * ASYNCHRONOUS AJAX FUNCTIONS
	 ******************************************************************************/

	function wp_ajax_wpmc_prepare_do() {
		$limit = isset( $_POST['limit'] ) ? $_POST['limit'] : 0;
		$limitsize = get_option( 'wpmc_posts_buffer', 5 );
		if ( empty( $limit ) )
			$this->core->reset_issues();

		$method = get_option( 'wpmc_method', 'media' );
		$check_library = get_option(' wpmc_media_library', true );
		$check_postmeta = get_option( 'wpmc_postmeta', false );
		$check_posts = get_option( 'wpmc_posts', false );
		$check_widgets = get_option( 'wpmc_widgets', false );
		if ( $method == 'media' && !$check_posts && !$check_postmeta && !$check_widgets ) {
			echo json_encode( array(
				'results' => array(),
				'success' => true,
				'finished' => true,
				'message' => __( "Posts, Meta and Widgets analysis are all off. Done.", 'media-cleaner' )
			) );
			die();
		}
		if ( $method == 'files' && $check_library && !$check_posts && !$check_postmeta && !$check_widgets ) {
			echo json_encode( array(
				'results' => array(),
				'success' => true,
				'finished' => true,
				'message' => __( "Posts, Meta and Widgets analysis are all off. Done.", 'media-cleaner' )
			) );
			die();
		}

		// Initialize the parsers
		do_action( 'wpmc_initialize_parsers' );

		global $wpdb;
		// Maybe we could avoid to check more post_types.
		// SELECT post_type, COUNT(*) FROM `wp_posts` GROUP BY post_type
		$posts = $wpdb->get_col( $wpdb->prepare( "SELECT p.ID FROM $wpdb->posts p
			WHERE p.post_status != 'inherit'
			AND p.post_status != 'trash'
			AND p.post_type != 'attachment'
			AND p.post_type != 'shop_order'
			AND p.post_type != 'shop_order_refund'
			AND p.post_type != 'nav_menu_item'
			AND p.post_type != 'revision'
			AND p.post_type != 'auto-draft'
			AND p.post_type != 'wphb_minify_group'
			AND p.post_type != 'customize_changeset'
			AND p.post_type != 'oembed_cache'
			AND p.post_type NOT LIKE '%acf-%'
			AND p.post_type NOT LIKE '%edd_%'
			LIMIT %d, %d", $limit, $limitsize
			)
		);

		$found = array();

		// Only at the beginning
		if ( empty( $limit ) ) {
			$this->core->log( "Parsed references:" );
			if ( get_option( 'wpmc_widgets', false ) ) {

				global $wp_registered_widgets;
				$syswidgets = $wp_registered_widgets;
				$active_widgets = get_option( 'sidebars_widgets' );
				foreach ( $active_widgets as $sidebar_name => $widgets ) {
					if ( $sidebar_name != 'wp_inactive_widgets' && !empty( $widgets ) && is_array( $widgets ) ) {
						foreach ( $widgets as $key => $widget ) {
							do_action( 'wpmc_scan_widget', $syswidgets[$widget] );
						}
					}
				}

				do_action( 'wpmc_scan_widgets' );
			}
			do_action( 'wpmc_scan_once' );
		}

		$this->core->timeout_check_start( count( $posts ) );

		foreach ( $posts as $post ) {
			$this->core->timeout_check();
			// Run the scanners
			if ( $check_postmeta )
				do_action( 'wpmc_scan_postmeta', $post );
			if ( $check_posts ) {
				// Get HTML for this post
				$html = get_post_field( 'post_content', $post );

				// Scan on the raw HTML content (useless?)
				//do_action( 'wpmc_scan_post', $html, $post );

				// This code was moved to the core.php (get_urls_from_html)
				//$html = do_shortcode( $html );
				//$html = wp_make_content_images_responsive( $html );
				// Scan with shortcodes resolved and src-set

				do_action( 'wpmc_scan_post', $html, $post );
			}
			$this->core->timeout_check_additem();
		}

		// Write the references cached by the scanners
		$this->core->write_references();

		$finished = count( $posts ) < $limitsize;
		if ( $finished ) {
			$this->core->log();
			$found = array();
			// Optimize DB (but that takes too long!)
			//$table_name = $wpdb->prefix . "mclean_refs";
			// $wpdb->query ("DELETE a FROM $table_name as a, $table_name as b
			// WHERE (a.mediaId = b.mediaId OR a.mediaId IS NULL AND b.mediaId IS NULL)
			// AND (a.mediaUrl = b.mediaUrl OR a.mediaUrl IS NULL AND b.mediaUrl IS NULL)
			// AND (a.originType = b.originType OR a.originType IS NULL AND b.originType IS NULL)
			// AND (a.origin = b.origin OR a.origin IS NULL AND b.origin IS NULL)
			// AND a.ID < b.ID;" );
			// $wpdb->query ("DELETE a FROM $table_name as a, $table_name as b WHERE a.mediaId = b.mediaId AND a.mediaId > 0 AND a.ID < b.ID;" );
			// $wpdb->query ("DELETE a FROM $table_name as a, $table_name as b WHERE a.mediaUrl = b.mediaUrl AND LENGTH(a.mediaUrl) > 1 AND a.ID < b.ID;" );
		}
		if ( $finished && get_option( 'wpmc_debuglogs', false ) ) {
			//$this->core->log( print_r( $found, true ) );
		}
		echo json_encode(
			array(
				'success' => true,
				'finished' => $finished,
				'limit' => $limit + $limitsize,
				'message' => __( "Posts checked.", 'media-cleaner' ) )
		);
		die();
	}

	function wp_ajax_wpmc_scan() {
		global $wpdb;

		$method = get_option( 'wpmc_method', 'media' );
		if ( !$this->admin->is_registered() )
			$method = 'media';
		$path = isset( $_POST['path'] ) ? $_POST['path'] : null;
		$limit = isset( $_POST['limit'] ) ? $_POST['limit'] : 0;
		$limitsize = get_option( 'wpmc_medias_buffer', 100 );

		if ( $method == 'files' ) {
			$output = apply_filters( 'wpmc_list_uploaded_files', array(
				'results' => array(), 'success' => false, 'message' => __( "Unavailable.", 'media-cleaner' )
			), $path );
			echo json_encode( $output );
			die();
		}

		if ( $method == 'media' ) {
			// Prevent double scanning by removing filesystem entries that we have DB entries for
			$results = $wpdb->get_col( $wpdb->prepare( "SELECT p.ID FROM $wpdb->posts p
				WHERE p.post_status = 'inherit'
				AND p.post_type = 'attachment'
				LIMIT %d, %d", $limit, $limitsize
				)
			);
			$finished = count( $results ) < $limitsize;
			echo json_encode(
				array(
					'results' => $results,
					'success' => true,
					'finished' => $finished,
					'limit' => $limit + $limitsize,
					'message' => __( "Medias retrieved.", 'media-cleaner' ) )
			);
			die();
		}

		// No task.
		echo json_encode( array( 'success' => false, 'message' => __( "No task.", 'media-cleaner' ) ) );
		die();
	}

	function wp_ajax_wpmc_scan_do() {
		// For debug, to pretend there is a timeout
		//$this->core->deepsleep(10);
		//header("HTTP/1.0 408 Request Timeout");
		//exit;

		ob_start();
		$type = $_POST['type'];
		$data = $_POST['data'];
		$this->core->timeout_check_start( count( $data ) );
		$success = 0;
		foreach ( $data as $piece ) {
			$this->core->timeout_check();
			if ( $type == 'file' ) {
				$this->core->log( "Check File: {$piece}" );
				$result = ( apply_filters( 'wpmc_check_file', true, $piece ) ? 1 : 0 );
				if ( $result )
					$success += $result;
			}
			else if ( $type == 'media' ) {
				$this->core->log( "Checking Media #{$piece}" );
				$result = ( $this->core->check_media( $piece ) ? 1 : 0 );
				if ( $result )
					$success += $result;
			}
			$this->core->log();
			$this->core->timeout_check_additem();
		}
		ob_end_clean();
		echo json_encode(
			array(
				'success' => true,
				'result' => array( 'type' => $type, 'data' => $data, 'success' => $success ),
				'message' => __( "Items checked.", 'media-cleaner' )
			)
		);
		die();
	}

	function wp_ajax_wpmc_get_all_issues() {
		global $wpdb;
		$isTrash = ( isset( $_POST['isTrash'] ) && $_POST['isTrash'] == 1 ) ? true : false;
		$table_name = $wpdb->prefix . "mclean_scan";
		$q = "SELECT id FROM $table_name WHERE ignored = 0 AND deleted = " . ( $isTrash ? 1 : 0 );
		if ( $search = ( isset( $_POST['s'] ) && $_POST['s'] ) ? sanitize_text_field( $_POST['s'] ) : '' )
			$q = $wpdb->prepare( $q . ' AND path LIKE %s', '%' . $wpdb->esc_like( $search ) . '%' );
		$ids = $wpdb->get_col( $q );

		echo json_encode(
			array(
				'results' => array( 'ids' => $ids ),
				'success' => true,
				'message' => __( "List generated.", 'media-cleaner' )
			)
		);
		die;
	}

	function wp_ajax_wpmc_get_all_deleted() {
		global $wpdb;
		$table_name = $wpdb->prefix . "mclean_scan";
		$ids = $wpdb->get_col( "SELECT id FROM $table_name WHERE ignored = 0 AND deleted = 1" );
		echo json_encode(
			array(
				'results' => array( 'ids' => $ids ),
				'success' => true,
				'message' => __( "List generated.", 'media-cleaner' )
			)
		);
		die;
	}

	function wp_ajax_wpmc_delete_do() {
		ob_start();
		$data = $_POST['data'];
		$success = 0;
		foreach ( $data as $piece ) {
			$success += ( $this->core->delete( $piece ) ? 1 : 0 );
		}
		ob_end_clean();
		echo json_encode(
			array(
				'success' => true,
				'result' => array( 'data' => $data, 'success' => $success ),
				'message' => __( "Status unknown.", 'media-cleaner' )
			)
		);
		die();
	}

	function wp_ajax_wpmc_ignore_do() {
		ob_start();
		$data = $_POST['data'];
		$success = 0;
		foreach ( $data as $piece ) {
			$success += ( $this->core->ignore( $piece ) ? 1 : 0 );
		}
		ob_end_clean();
		echo json_encode(
			array(
				'success' => true,
				'result' => array( 'data' => $data, 'success' => $success ),
				'message' => __( "Status unknown.", 'media-cleaner' )
			)
		);
		die();
	}

	function wp_ajax_wpmc_recover_do() {
		ob_start();
		$data = $_POST['data'];
		$success = 0;
		foreach ( $data as $piece ) {
			$success +=  ( $this->core->recover( $piece ) ? 1 : 0 );
		}
		ob_end_clean();
		echo json_encode(
			array(
				'success' => true,
				'result' => array( 'data' => $data, 'success' => $success ),
				'message' => __( "Status unknown.", 'media-cleaner' )
			)
		);
		die();
	}

	function wp_ajax_wpmc_validate_option() {
		$name = $_POST['name']; // Option Name
		$value = $_POST['value']; // Option Value
		$value = wp_unslash( $value ); // Unescape backslashes
		$validated = $this->admin->validate_option( $name, $value );
		if ( $validated instanceof WP_Error ) { // Invalid value
			$error = array (
				'code' => $validated->get_error_code() ?: 'invalid_option',
				'message' => $validated->get_error_message() ?: __( "Invalid Option Value", 'media-cleaner' )
			);
			wp_send_json_error( $error );
		}
		wp_send_json_success();
	}
}