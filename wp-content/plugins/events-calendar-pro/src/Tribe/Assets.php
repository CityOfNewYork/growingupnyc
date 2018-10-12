<?php
/**
 * Registers and Enqueues the assets
 *
 * @since  4.4.30
 */
class Tribe__Events__Pro__Assets {
	/**
	 * Registers and Enqueues the assets
	 *
	 * @since  4.4.30
	 *
	 * @return void
	 */
	public function register() {
		$pro = Tribe__Events__Pro__Main::instance();

		// Vendor
		tribe_assets(
			$pro,
			array(
				array( 'tribe-events-pro-imagesloaded', 'vendor/imagesloaded/imagesloaded.pkgd.js', array( 'tribe-events-pro' ) ),
				array( 'tribe-events-pro-isotope', 'vendor/isotope/isotope.pkgd.js', array( 'tribe-events-pro-imagesloaded' ) ),
				array( 'tribe-events-pro-slimscroll', 'vendor/nanoscroller/jquery.nanoscroller.js', array( 'tribe-events-pro', 'jquery-ui-draggable' ) ),
			),
			null,
			array(
				'in_footer'    => false,
			)
		);

		$api_url = 'https://maps.google.com/maps/api/js';
		$api_key = tribe_get_option( 'google_maps_js_api_key' );

		if ( ! empty( $api_key ) && is_string( $api_key ) ) {
			$api_url = sprintf( 'https://maps.googleapis.com/maps/api/js?key=%s', trim( $api_key ) );
		}

		/**
		 * Allows users to use a diferent Google Maps JS URL
		 *
		 * @param string $url
		 */
		$google_maps_js_url = apply_filters( 'tribe_events_pro_google_maps_api', $api_url );

		tribe_asset(
			$pro,
			'tribe-gmaps',
			$google_maps_js_url,
			array( 'tribe-events-pro' ),
			null,
			array(
				'type' => 'js',
			)
		);

		tribe_asset(
			$pro,
			'tribe-pro',
			'pro.js',
			array(),
			null,
			array(
				'priority' => 5,
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-pro',
			'tribe-events-pro.js',
			array( 'jquery', 'tribe-events-calendar-script' ),
			'wp_enqueue_scripts',
			array(
				'conditionals' => array( $this, 'should_enqueue_frontend' ),
				'in_footer'    => false,
				'localize'     => array(
					'name' => 'TribeEventsPro',
					'data' => array( $this, 'get_data_tribe_events_pro' ),
				),
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-pro-photo',
			'tribe-events-photo-view.js',
			array( 'tribe-events-pro-isotope' ),
			null,
			array(
				'localize' => array(
					'name' => 'TribePhoto',
					'data' => array(
						'ajaxurl'     => admin_url( 'admin-ajax.php', ( is_ssl() ? 'https' : 'http' ) ),
						'tribe_paged' => tribe_get_request_var( 'tribe_paged', 0 ),
					),
				),
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-pro-week',
			'tribe-events-week.js',
			array( 'tribe-events-pro-slimscroll' ),
			null,
			array(
				'localize' => array(
					'name' => 'TribeWeek',
					'data' => array(
						'ajaxurl'   => admin_url( 'admin-ajax.php', ( is_ssl() ? 'https' : 'http' ) ),
						'post_type' => Tribe__Events__Main::POSTTYPE,
					),
				),
			)
		);


		tribe_asset(
			$pro,
			'tribe-events-pro-geoloc',
			'tribe-events-ajax-maps.js',
			array( 'tribe-gmaps', 'jquery-placeholder' ),
			null,
			array(
				'localize' => array(
					'name' => 'GeoLoc',
					'data' => array( $this, 'get_data_tribe_geoloc' ),
				),
			)
		);

		tribe_assets(
			$pro,
			array(
				array( 'tribe_events-premium-admin-style', 'events-admin.css', array() ),
				array( 'tribe_events-premium-admin', 'events-admin.js', array( 'jquery-ui-datepicker', 'wp-util', 'tribe-timepicker' ) ),
			),
			array( 'tribe_venues_enqueue', 'tribe_events_enqueue' )
		);

		tribe_assets(
			$pro,
			array(
				array( 'tribe-events-calendar-full-pro-mobile-style', 'tribe-events-pro-full-mobile.css', array( 'tribe-events-calendar-pro-style' ) ),
				array( 'tribe-events-calendar-pro-mobile-style', 'tribe-events-pro-theme-mobile.css', array( 'tribe-events-calendar-pro-style' ) ),
			),
			'wp_enqueue_scripts',
			array(
				'media'        => 'only screen and (max-width: ' . tribe_get_mobile_breakpoint() . 'px)',
				'groups'       => array( 'events-pro-styles' ),
				'conditionals' => array(
					'operator' => 'AND',
					array( $this, 'is_mobile_breakpoint' ),
					array( $this, 'should_enqueue_frontend' ),
				),
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-full-pro-calendar-style',
			'tribe-events-pro-full.css',
			array(),
			'wp_enqueue_scripts',
			array(
				'priority'     => 5,
				'conditionals' => array(
					'operator' => 'AND',
					array( $this, 'is_style_option_tribe' ),
					array( $this, 'should_enqueue_frontend' ),
				),
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-calendar-pro-style',
			$this->get_style_file(),
			array(),
			'wp_enqueue_scripts',
			array(
				'groups'       => array( 'events-pro-styles' ),
				'conditionals' => array(
					array( $this, 'should_enqueue_frontend' ),
				),
			)
		);

		tribe_asset(
			$pro,
			'tribe-events-calendar-pro-override-style',
			Tribe__Events__Templates::locate_stylesheet( 'tribe-events/pro/tribe-events-pro.css' ),
			array(),
			'wp_enqueue_scripts',
			array(
				'conditionals' => array( $this, 'should_enqueue_frontend' ),
				'groups'       => array( 'events-pro-styles' ),
			)
		);
	}

	/**
	 * Checks if we have a mobile Breakpoint
	 *
	 * @since  4.4.30
	 *
	 * @return bool
	 */
	public function is_mobile_breakpoint() {
		$mobile_break = tribe_get_mobile_breakpoint();
		return $mobile_break > 0;
	}

	/**
	 * Checks if we are using Tribe setting for Style
	 *
	 * @since  4.4.30
	 *
	 * @return bool
	 */
	public function is_style_option_tribe() {
		$style_option = tribe_get_option( 'stylesheetOption', 'tribe' );
		return 'tribe' === $style_option;
	}

	/**
	 * Due to how we define which style we use based on an Option on the Administration
	 * we need to determine this file.
	 *
	 * @since  4.4.30
	 *
	 * @return string
	 */
	public function get_style_file() {
		$name = tribe_get_option( 'stylesheetOption', 'tribe' );

		$stylesheets = array(
			'tribe'    => 'tribe-events-pro-theme.css',
			'full'     => 'tribe-events-pro-full.css',
			'skeleton' => 'tribe-events-pro-skeleton.css',
		) ;

		// By default we go with `tribe`
		$file = $stylesheets['tribe'];

		// if we have one we use it
		if ( isset( $stylesheets[ $name ] ) ) {
			$file = $stylesheets[ $name ];
		}

		/**
		 * Allows filtering of the Stylesheet file for Events Calendar Pro
		 *
		 * @deprecated  4.4.30
		 *
		 * @param string $file Which file we are loading
		 * @param string $name Option from the DB of style we are using
		 */
		return apply_filters( 'tribe_events_pro_stylesheet_url', $file, $name );
	}

	/**
	 * When to enqueue the Pro Styles on the front-end
	 *
	 * @since  4.4.30
	 *
	 * @return void
	 */
	public function should_enqueue_frontend() {
		global $post;

		return (
			tribe_is_event_query()
			|| is_active_widget( false, false, 'tribe-events-adv-list-widget' )
			|| is_active_widget( false, false, 'tribe-mini-calendar' )
			|| is_active_widget( false, false, 'tribe-events-countdown-widget' )
			|| is_active_widget( false, false, 'next_event' )
			|| is_active_widget( false, false, 'tribe-events-venue-widget' )
			|| is_active_widget( false, false, 'tribe-this-week-events-widget' )
			|| ( $post instanceof WP_Post && has_shortcode( $post->post_content, 'tribe_events' ) )
			|| ( $post instanceof WP_Post && has_shortcode( $post->post_content, 'tribe_mini_calendar' ) )
			|| ( $post instanceof WP_Post && has_shortcode( $post->post_content, 'tribe_this_week' ) )
			|| ( $post instanceof WP_Post && has_shortcode( $post->post_content, 'tribe_event_countdown' ) )
			|| ( $post instanceof WP_Post && has_shortcode( $post->post_content, 'tribe_featured_venue' ) )
		);
	}

	/**
	 * Gets the localize data for Main Events Calendar Pro
	 *
	 * @since  4.4.30
	 *
	 * @return array
	 */
	public function get_data_tribe_events_pro() {
		$data = array(
			'geocenter'           => Tribe__Events__Pro__Geo_Loc::instance()->estimate_center_point(),
			'map_tooltip_event'   => esc_html( sprintf( _x( '%s: ', 'Event title map marker prefix', 'tribe-events-calendar-pro' ), tribe_get_event_label_singular() ) ),
			'map_tooltip_address' => esc_html__( 'Address: ', 'tribe-events-calendar-pro' ),
		);

		/**
		 * Filters the Main Events Calendar Pro script localization
		 *
		 * @since 4.4.30
		 *
		 * @param array  $data        JS variable
		 * @param string $object_name The localization object var name.
		 * @param string $script      Which script this localizes
		 */
		$data = apply_filters( 'tribe_events_pro_localize_script', $data, 'TribeEventsPro', 'tribe-events-pro' );

		return $data;
	}

	/**
	 * Gets the localize data for Geoloc on Events Calendar Pro
	 *
	 * @since  4.4.30
	 *
	 * @return array
	 */
	public function get_data_tribe_geoloc() {

		$data = array(
			'ajaxurl'  => admin_url( 'admin-ajax.php', admin_url( 'admin-ajax.php', ( is_ssl() ? 'https' : 'http' ) ) ),
			'nonce'    => wp_create_nonce( 'tribe_geosearch' ),
			'map_view' => 'map' === tribe( 'tec.main' )->displaying,
			'pin_url'  => Tribe__Customizer::instance()->get_option( array( 'global_elements', 'map_pin' ), false ),
		);

		/**
		 * Filters the Events Calendar Pro Maps script localization
		 *
		 * @since  4.4.30  Removed the Third param
		 *
		 * @param  array   $data    JS variable
		 * @param  string  $script  Which script this localizes
		 */
		$data = apply_filters( 'tribe_events_pro_geoloc_localize_script', $data, 'tribe-events-pro-geoloc' );

		return $data;

	}

}