<?php

/*-------------------------------------------------------------------------------------
* File description: Main class for Geo Location functionality
*
*
* Created by:  Daniel Dvorkin
* For:         Modern Tribe Inc. ( http://m.tri.be/20 )
*
* Date: 		9 / 18 / 12 12:31 PM
*-------------------------------------------------------------------------------------*/

class Tribe__Events__Pro__Geo_Loc {

	/**
	 * Meta key for the venue Latitude
	 */
	const LAT = '_VenueLat';

	/**
	 * Meta key for the venue Longitude
	 */
	const LNG = '_VenueLng';

	/**
	 * Meta key for if the venue has overwritten coordinates.
	 */
	const OVERWRITE = '_VenueOverwriteCoords';

	/**
	 * The meta key for the full address, either from user input that then gets
     * sent to the geocoder or, if geocoding is successful, this field gets
     * overwritten with that full address result. Therefore, it's used as a
     * cache to avoid sending geocoder requests unless this field changes (i.e.
     * does not match the value saved from the last geocoding result).
	 */
	const ADDRESS = '_VenueGeoAddress';

	/**
	 * Option key for the Geoloc settings
	 */
	const OPTIONNAME = 'tribe_geoloc_options';

	/**
	 * Cache key for the geo point at the center of all site's venues
	 */
	const ESTIMATION_CACHE_KEY = 'geoloc_center_point_estimation';

	/**
	 * Earth radio in Kms. Used for the distance math.
	 */
	const EARTH_RADIO = 6371;

	/**
	 * Deprecated once we reverted the geolocalization changes to this class
	 *
	 * @since      4.4.24
	 * @deprecated 4.4.24.2
	 */
	const GEODATE = '_VenueGeoDateUTC';

	/**
	 * Deprecated once we reverted the geolocalization changes to this class
	 *
	 * @since      4.4.24
	 * @deprecated 4.4.24.2
	 */
	const SITE_GEO_FIXED_OPTIONNAME = '_tribe_geoloc_fixed';

	/**
	 * Settings.
	 * @var
	 */
	protected static $options;

	/**
	 * Slug of the map view
	 * @var mixed|void
	 */
	public $rewrite_slug;

	/**
	 * Limit for the distance search
	 * @var
	 */
	private $selected_geofence;

	/**
	 * Cache of how many venues we "fixed" (ie: generated geopoints for)
	 * @var int
	 */
	private $last_venues_fixed_count = 0;

	/**
	 * Singleton instance of this class
	 *
	 * @var Tribe__Events__Pro__Geo_Loc
	 */
	private static $instance;

	/**
	 * Whether or not the OVER_QUERY_LIMIT notification has been displayed
	 *
	 * @var boolean
	 */
	private $over_query_limit_displayed = false;

	/**
	 * Class constructor
	 */
	public function __construct() {
		$this->rewrite_slug = Tribe__Settings_Manager::get_option( 'geoloc_rewrite_slug', __( 'map', 'tribe-events-calendar-pro' ) );

		add_action( 'tribe_events_venue_updated', array( $this, 'save_venue_geodata' ), 10, 2 );
		add_action( 'tribe_events_venue_created', array( $this, 'save_venue_geodata' ), 10, 2 );
		add_action( 'tribe_settings_after_save', array( $this, 'clear_min_max_coords_cache' ) );

		add_action( 'tribe_events_after_venue_metabox', array( $this, 'setup_overwrite_geoloc' ), 10 );
		add_action( 'tribe_events_filters_create_filters', array( $this, 'setup_geoloc_filter_in_filters' ), 1 );
		add_action( 'wp_enqueue_scripts', array( $this, 'scripts' ) );
		add_action( 'admin_init', array( $this, 'maybe_generate_geopoints_for_all_venues' ) );
		add_action( 'admin_init', array( $this, 'maybe_offer_generate_geopoints' ) );

		add_filter( 'tribe-events-bar-views', array( $this, 'setup_view_for_bar' ), 25, 1 );
		add_filter( 'tribe_settings_tab_fields', array( $this, 'inject_settings' ), 10, 2 );
		add_filter( 'tribe-events-bar-filters', array( $this, 'setup_geoloc_filter_in_bar' ), 1, 1 );
		add_filter( 'tribe_events_rewrite_rules_custom', array( $this, 'add_routes' ), 10, 3 );
		add_action( 'tribe_events_pre_get_posts', array( $this, 'setup_geoloc_in_query' ) );
		add_filter( 'tribe_events_list_inside_before_loop', array( $this, 'add_event_distance' ) );

		add_filter( 'tribe_events_importer_venue_array', array( $this, 'filter_aggregator_add_overwrite_geolocation_value' ), 10, 4 );
		add_filter( 'tribe_events_importer_venue_column_names', array( $this, 'filter_aggregator_add_overwrite_geolocation_column' ) );

		add_action( 'admin_notices', array( $this, 'maybe_notify_about_google_over_limit' ) );
		add_filter( 'tribe_events_google_map_link', array( $this, 'google_map_link' ), 10, 2 );
	}

	/**
	 * If the "Filters bar" add-on is active, setup the distance filter.
	 */
	public function setup_geoloc_filter_in_filters() {
		if ( ! tribe_get_option( 'hideLocationSearch', false ) ) {
			new Tribe__Events__Pro__Geo_Loc_Filter( __( 'Distance', 'tribe-events-calendar-pro' ), 'geofence' );
		}
	}

	/**
	 * Enqueue Google Maps Geolocation JS in all archive views if needed: 1) if the "Near" search is present in Tribe Bar (if Hide Location Search is unchecked), 2) if we are rendering Map View
	 */
	public function scripts() {
		if (
			tribe_is_event_query()
			&& ! is_single()
			&& (
				! tribe_get_option( 'hideLocationSearch', false )
				|| tribe_is_map()
			)
		) {
			tribe_asset_enqueue( 'tribe-events-pro-map' );
		}
	}

	/**
	 * Inject the GeoLoc settings into the general TEC settings screen
	 *
	 * @param $args
	 * @param $id
	 *
	 * @return array
	 */
	public function inject_settings( $args, $id ) {

		if ( $id == 'general' ) {

			$venues = $this->get_venues_without_geoloc_info();

			// we want to inject the map default distance and unit into the map section directly after "enable Google Maps"
			$args = Tribe__Main::array_insert_after_key( 'embedGoogleMaps', $args, array(
					'geoloc_default_geofence' => array(
						'type'            => 'text',
						'label'           => __( 'Map view search distance limit', 'tribe-events-calendar-pro' ),
						'size'            => 'small',
						'tooltip'         => __( 'Set the distance that the location search covers (find events within X distance units of location search input).', 'tribe-events-calendar-pro' ),
						'default'         => '25',
						'class'           => '',
						'validation_type' => 'number_or_percent',
					),
					'geoloc_default_unit'     => array(
						'type'            => 'dropdown',
						'label'           => __( 'Distance unit', 'tribe-events-calendar-pro' ),
						'validation_type' => 'options',
						'size'            => 'small',
						'default'         => 'miles',
						'options'         => apply_filters( 'tribe_distance_units',
							array(
								'miles' => __( 'Miles', 'tribe-events-calendar-pro' ),
								'kms'   => __( 'Kilometers', 'tribe-events-calendar-pro' ),
							)
						),
					),
					'geoloc_fix_venues'       => array(
						'type'        => 'html',
						'html'        => '<a name="geoloc_fix"></a><fieldset class="tribe-field tribe-field-html"><legend>' . __( 'Fix geolocation data', 'tribe-events-calendar-pro' ) . '</legend><div class="tribe-field-wrap">' . $this->fix_geoloc_data_button() . '<p class="tribe-field-indent description">' . sprintf( __( "You have %d venues for which we don't have geolocation data. We need to use the Google Maps API to get that information. Doing this may take a while (approximately 1 minute for every 200 venues).", 'tribe-events-calendar-pro' ), $venues->found_posts ) . '</p></div></fieldset>',
						'conditional' => ( $venues->found_posts > 0 ),
					),
				)
			);
		} elseif ( $id == 'display' ) {
			$args = Tribe__Main::array_insert_after_key( 'tribeDisableTribeBar', $args, array(
				'hideLocationSearch' => array(
					'type'            => 'checkbox_bool',
					'label'           => __( 'Hide location search', 'tribe-events-calendar-pro' ),
					'tooltip'         => __( 'Removes location search field from the events bar on all views except for map view.', 'tribe-events-calendar-pro' ),
					'default'         => false,
					'validation_type' => 'boolean',
				),
			) );
		}

		return $args;
	}

	/**
	 * @param bool $full_data
	 *
	 * @return WP_Query
	 */
	protected function get_venues_without_geoloc_info( $full_data = false ) {
		$query_args = array(
			'post_type'      => Tribe__Events__Main::VENUE_POST_TYPE,
			'post_status'    => 'publish',
			'posts_per_page' => 250,
			'meta_query'     => array(
				array(
					'key'     => self::ADDRESS,
					'compare' => 'NOT EXISTS',
				),
				array(
					'key'     => '_VenueAddress',
					'compare' => '!=',
					'value'   => '',
				),
			),
		);

		if ( ! $full_data ) {
			$query_args['fields']         = 'ids';
			$query_args['posts_per_page'] = 1;
		}


		$venues = new WP_Query( $query_args );

		return $venues;
	}

	/**
	 * Add the Map View to the view switcher in the Tribe Bar
	 *
	 * @param $views
	 *
	 * @return array
	 */
	public function setup_view_for_bar( $views ) {
		$views[] = array(
			'displaying'     => 'map',
			'event_bar_hook' => 'tribe_events_list_the_title',
			'anchor'         => __( 'Map', 'tribe-events-calendar-pro' ),
			'url'            => tribe_get_mapview_link(),
		);

		return $views;
	}

	/**
	 * Filter of the Values for Venues and add Overwrite Coordinates
	 *
	 * @since  4.4.18
	 *
	 * @param  array                                          $venue     Venue Array for creating the Post
	 * @param  WP_Post                                        $record    Aggregator Record Post
	 * @param  int                                            $venue_id  Which Venue ID this belongs to
	 * @param  Tribe__Events__Importer__File_Importer_Venues  $importer  Importer with the CSV data
	 *
	 * @return array
	 */
	public function filter_aggregator_add_overwrite_geolocation_value( $venue, $record, $venue_id, $importer ) {
		$record_value = $importer->get_value_by_key( $record, 'venue_overwrite_coords' );
		$from_venue   = Tribe__Utils__Array::get( $venue, 'OverwriteCoords', '' );

		$venue['OverwriteCoords'] = '' === $record_value && '' !== $from_venue ? $from_venue : $record_value;

		return $venue;
	}

	/**
	 * Filter of the Columns for Venues and add Overwrite Coordinates
	 *
	 * @since  4.4.18
	 *
	 * @param  array  $columns  Previous columns
	 *
	 * @return array
	 */
	public function filter_aggregator_add_overwrite_geolocation_column( $columns ) {
		$columns['venue_overwrite_coords'] = esc_html__( 'Venue Overwrite Coordinates', 'the-events-calendar' );

		return $columns;
	}

	/**
	 * Add the location filter in the Tribe Bar
	 *
	 * @param $filters
	 *
	 * @return array
	 */
	public function setup_geoloc_filter_in_bar( $filters ) {
		if ( tribe_is_map() || ! tribe_get_option( 'hideLocationSearch', false ) ) {
			if ( tribe_get_option( 'tribeDisableTribeBar', false ) == false ) {
				$value = '';
				if ( ! empty( $_REQUEST['tribe-bar-geoloc'] ) ) {
					$value = $_REQUEST['tribe-bar-geoloc'];
				}

				$lat = '';
				if ( ! empty( $_REQUEST['tribe-bar-geoloc-lat'] ) ) {
					$lat = $_REQUEST['tribe-bar-geoloc-lat'];
				}

				$lng = '';
				if ( ! empty( $_REQUEST['tribe-bar-geoloc-lng'] ) ) {
					$lng = $_REQUEST['tribe-bar-geoloc-lng'];
				}

				$filters['tribe-bar-geoloc'] = array(
					'name'    => 'tribe-bar-geoloc',
					'caption' => __( 'Near', 'tribe-events-calendar-pro' ),
					'html'    => '<input type="hidden" name="tribe-bar-geoloc-lat" id="tribe-bar-geoloc-lat" value="' . esc_attr( $lat ) . '" /><input type="hidden" name="tribe-bar-geoloc-lng" id="tribe-bar-geoloc-lng" value="' . esc_attr( $lng ) . '" /><input type="text" name="tribe-bar-geoloc" id="tribe-bar-geoloc" value="' . esc_attr( $value ) . '" placeholder="' . __( 'Location', 'tribe-events-calendar-pro' ) . '">',
				);
			}
		}

		return $filters;
	}

	/**
	 * Returns whether the user made a location search in the Tribe Bar
	 * @return bool
	 */
	public function is_geoloc_query() {
		return ( ! empty( $_REQUEST['tribe-bar-geoloc-lat'] ) && ! empty( $_REQUEST['tribe-bar-geoloc-lng'] ) );
	}

	public function setup_overwrite_geoloc( $post ) {
		if ( $post->post_type != Tribe__Events__Main::VENUE_POST_TYPE ) {
			return;
		}
		$overwrite_coords = (bool) get_post_meta( $post->ID, self::OVERWRITE, true );
		$_lat = get_post_meta( $post->ID, self::LAT, true );
		$_lng = get_post_meta( $post->ID, self::LNG, true );
		?>
		<tr id="overwrite_coordinates">
			<td class='tribe-table-field-label'><?php esc_attr_e( 'Use latitude + longitude', 'tribe-events-calendar-pro' ); ?>:</td>
			<td>
				<input tabindex="<?php tribe_events_tab_index(); ?>" type="checkbox" id="VenueOverwriteCoords" name="venue[OverwriteCoords]" value="true" <?php checked( $overwrite_coords ); ?> />

				<input class=" " disabled title='<?php esc_attr_e( 'Latitude', 'tribe-events-calendar-pro' ) ?>' placeholder='<?php esc_attr_e( 'Latitude', 'tribe-events-calendar-pro' ) ?>' tabindex="<?php tribe_events_tab_index(); ?>" type="text" id="VenueLatitude" name="venue[Lat]" value="<?php echo esc_attr( is_numeric( $_lat ) ? (float) $_lat : '' ); ?>" />
				<input class=" " disabled title='<?php esc_attr_e( 'Longitude', 'tribe-events-calendar-pro' ) ?>' placeholder='<?php esc_attr_e( 'Longitude', 'tribe-events-calendar-pro' ) ?>' tabindex="<?php tribe_events_tab_index(); ?>" type="text" id="VenueLongitude" name="venue[Lng]" value="<?php echo esc_attr( is_numeric( $_lng ) ? (float) $_lng : '' ); ?>" />
			</td>
		</tr>
		<?php
	}

	/**
	 * Filter the main query and:
	 *  1) If the user made a Location search, get the events close to that location (inside the geo fence)
	 *  2) If the user is in the map view and didn't make a location search, only get events in venues with geo data,
	 *     so we can map them.
	 *
	 *
	 * @param WP_Query $query
	 *
	 * @return void
	 */
	public function setup_geoloc_in_query( $query ) {
		if (
			empty( $query->query_vars['tribe_geoloc'] )
			&& (
				( ! $query->is_main_query() && ! defined( 'DOING_AJAX' ) )
				|| ! $query->get( 'post_type' ) == Tribe__Events__Main::POSTTYPE
			)
		) {
			return;
		}

		$lat = null;
		$lng = null;

		if ( ! empty( $query->query_vars['tribe_geoloc_lat'] ) ) {
			$lat = (float) $query->query_vars['tribe_geoloc_lat'];
		} elseif ( ! empty( $_REQUEST['tribe-bar-geoloc-lat'] ) ) {
			$lat = (float) $_REQUEST['tribe-bar-geoloc-lat'];
		}

		if ( ! empty( $query->query_vars['tribe_geoloc_lng'] ) ) {
			$lng = (float) $query->query_vars['tribe_geoloc_lng'];
		} elseif ( ! empty( $_REQUEST['tribe-bar-geoloc-lng'] ) ) {
			$lng = (float) $_REQUEST['tribe-bar-geoloc-lng'];
		}

		$force = false;

		if ( ! empty( $lat ) && ! empty( $lng ) ) {
			// Show only venues that have geoloc info
			$force = true;

			// Get venues closest to the specified location
			$venues = $this->get_venues_in_geofence( $lat, $lng );
		} elseif (
			'map' === Tribe__Events__Main::instance()->displaying
			|| ( ! empty( $query->query_vars['eventDisplay'] ) && 'map' === $query->query_vars['eventDisplay'] )
			|| ! empty( $query->query_vars['tribe_geoloc'] )
		) {
			// Show only venues that have geoloc info
			$force = true;

			// Set a geofence the size of the planet
			$geofence_radio = self::EARTH_RADIO * M_PI;

			// Get all geoloc'ed venues
			$venues = $this->get_venues_in_geofence( 1, 1, $geofence_radio );
		}

		if ( $force ) {

			if ( empty( $venues ) ) {
				// there aren't any venues in the geofence, so let's kill the meta query so we don't get any results
				$venues = -1;
			} elseif ( is_array( $venues ) ) {
				// we have venues...let's make sure they are unique
				$venues = array_unique( $venues );
			}

			$meta_query = array(
				'key'     => '_EventVenueID',
				'value'   => $venues,
				'type'    => 'NUMERIC',
				'compare' => 'IN',
			);

			if ( empty( $query->query_vars['meta_query'] ) ) {
				$query->set( 'meta_query', array( $meta_query ) );
			} else {
				$query->query_vars['meta_query'][] = $meta_query;
			}
		}
	}

	/**
	 * Adds the rewrite rules to make the map view work
	 *
	 * @param $wp_rewrite
	 */
	public function add_routes( $rules, $tribe_rewrite, $wp_rewrite = null ) {
		// Prevent errors if this is used on and old version of TEC plugin.
		if ( is_null( $wp_rewrite ) ) {
			unset( $wp_rewrite );
			global $wp_rewrite;
		}

		$tec = Tribe__Events__Main::instance();

		$base    = trailingslashit( $tec->rewriteSlug );
		$baseTax = trailingslashit( $tec->taxRewriteSlug );
		$baseTax = '(.*)' . $baseTax . '(?:[^/]+/)*';
		$baseTag = trailingslashit( $tec->tagRewriteSlug );
		$baseTag = '(.*)' . $baseTag;

		$newRules = array();

		/**
		 * Filters the rewrite slugs used to generate the geocode based rewrite rules.
		 *
		 * @param array $rewrite_slugs An array of rewrite slugs to use; defaults to [ 'map' ], the
		 *                             default geocode-based rewrite slug.
		 */
		$rewrite_slugs = apply_filters( 'tribe_events_pro_geocode_rewrite_slugs', array( $this->rewrite_slug ) );

		foreach ( $rewrite_slugs as $rewrite_slug ) {
			$newRules[ $base . $rewrite_slug ] = 'index.php?post_type=' . Tribe__Events__Main::POSTTYPE . '&eventDisplay=map';
			$newRules[ $baseTax . '([^/]+)/' . $rewrite_slug . '/?$' ] = 'index.php?tribe_events_cat=' . $wp_rewrite->preg_index( 2 ) . '&post_type=' . Tribe__Events__Main::POSTTYPE . '&eventDisplay=map';
			$newRules[ $baseTag . '([^/]+)/' . $rewrite_slug . '/?$' ] = 'index.php?tag=' . $wp_rewrite->preg_index( 2 ) . '&post_type=' . Tribe__Events__Main::POSTTYPE . '&eventDisplay=map';
		}

		return $newRules + $rules;
	}

	/**
	 *  Adds the distance of each event in the resulting list, when the user makes a location search.
	 *
	 * @param $html
	 *
	 * @return string
	 */
	public function add_event_distance( $html ) {
		global $post;
		if ( ! empty( $post->distance ) ) {
			$html .= '<span class="tribe-events-distance">' . tribe_get_distance_with_unit( $post->distance ) . '</span>';
		}

		return $html;
	}

	/**
	 * Hooks into the venue save and if we don't have Geo Data for that address,
	 * it calls the Google Maps API and grabs the Lat and Lng for that venue.
	 *
	 * @param $venueId
	 * @param $data
	 *
	 * @return bool
	 */
	public function save_venue_geodata( $venueId, $data ) {

		$_address  = ( ! empty( $data['Address'] ) ) ? $data['Address'] : '';
		$_city     = ( ! empty( $data['City'] ) ) ? $data['City'] : '';
		$_province = ( ! empty( $data['Province'] ) ) ? $data['Province'] : '';
		$_state    = ( ! empty( $data['State'] ) ) ? $data['State'] : '';
		$_zip      = ( ! empty( $data['Zip'] ) ) ? $data['Zip'] : '';
		$_country  = ( ! empty( $data['Country'] ) ) ? $data['Country'] : '';

		$overwrite = ( ! empty( $data['OverwriteCoords'] ) ) ? 1 : 0;
		$_lat = ( ! empty( $data['Lat'] ) && is_numeric( $data['Lat'] ) ) ? (float) $data['Lat'] : false;
		$_lng = ( ! empty( $data['Lng'] ) && is_numeric( $data['Lng'] ) ) ? (float) $data['Lng'] : false;
		$reset = false;

		// Check the Overwrite data, otherwise just reset it
		if ( $overwrite && false !== $_lat && false !== $_lng ) {
			update_post_meta( $venueId, self::OVERWRITE, 1 );
			update_post_meta( $venueId, self::LAT, (string) $_lat );
			update_post_meta( $venueId, self::LNG, (string) $_lng );

			$this->clear_min_max_coords_cache();
			return true;
		} else {
			if ( 1 === (int) get_post_meta( $venueId, self::OVERWRITE, true ) ) {
				$reset = true;
			}
			update_post_meta( $venueId, self::OVERWRITE, 0 );
		}

		// Remove remaining spaces from any of the pieces of the address.
		$pieces = array_map( 'trim', compact( '_address', '_province', '_city', '_state', '_zip', '_country' ) );
		$address = implode( ' ', array_filter( $pieces ) );
		// Remove any parenthesis from the address and his content as well
		$address = preg_replace( '/\(.*\)/', '', $address );

		if ( empty( $address ) ) {
			return false;
		}

		// If the address didn't change, doesn't make sense to query google again for the geo data
		if ( $address === get_post_meta( $venueId, self::ADDRESS, true ) && true !== $reset ) {
			return false;
		}

		$api_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' . urlencode( $address );
		$api_key = tribe_get_option( 'google_maps_js_api_key' );

		if ( ! empty( $api_key ) && is_string( $api_key ) ) {
			$api_url = add_query_arg( array( 'key' => $api_key ), $api_url );
		}

		/**
		 * Allows customizing the Google Maps Geocode API URL for a venue's address, which URL is
		 * used to validate the address as one that can be plotted on a Google Map.
		 *
		 * @param string $api_url The Google Maps Geocode API URL for this venue's address.
		 */
		$data = wp_remote_get( apply_filters( 'tribe_events_pro_geocode_request_url', $api_url ) );

		if ( is_wp_error( $data ) || ! isset( $data['body'] ) ) {
			tribe( 'logger' )->log_warning( sprintf(
					_x( 'Geocode request failed ($1%s - $2%s)', 'debug geodata', 'tribe-events-calendar-pro' ),
					is_wp_error( $data ) ? $data->get_error_code() : _x( 'empty response', 'debug geodata' ),
                    $api_url
				),
				__METHOD__
			);
			return false;
		}

		$data_arr = json_decode( $data['body'] );

		if ( isset( $data_arr->status ) && 'OVER_QUERY_LIMIT' === $data_arr->status ) {
			if ( $this->over_query_limit_displayed ) {
				return false;
			}

			set_transient( 'tribe-google-over-limit', 1, time() + MINUTE_IN_SECONDS );

			$this->over_query_limit_displayed = true;

			return false;
		}

		if ( ! empty( $data_arr->results[0] ) ) {
			$geo_result = $data_arr->results[0];

			if ( ! empty( $geo_result->geometry->location->lat ) ) {
				update_post_meta( $venueId, self::LAT, (string) $geo_result->geometry->location->lat );
			}

			if ( ! empty( $geo_result->geometry->location->lng ) ) {
				update_post_meta( $venueId, self::LNG, (string) $geo_result->geometry->location->lng );
			}

			/**
			 * Allows further processing of geodata for Venue.
			 *
			 * @since 4.4.31
			 *
			 * @param int    $venueId    Venue ID.
			 * @param object $geo_result Geo result object.
			 * @param array  $pieces     User provided address pieces.
			 */
			do_action( 'tribe_geoloc_save_venue_geodata', $venueId, $geo_result, $pieces );
		}

		// Saving the aggregated address so we don't need to ping google on every save
		update_post_meta( $venueId, self::ADDRESS, $address );

		$this->clear_min_max_coords_cache();

		return true;
	}

	/**
	 * Add notification message about the Google Maps API being over its query limit
	 */
	public function maybe_notify_about_google_over_limit() {
		if ( ! get_transient( 'tribe-google-over-limit' ) ) {
			return;
		}

		delete_transient( 'tribe-google-over-limit' );
		?>
		<div class="error">
			<p>
				<?php
				$link = admin_url( 'edit.php?page=tribe-common&tab=addons&post_type=tribe_events' );
				printf(
					esc_html__(
						'The latitude and longitude for your venue could not be fetched. The Google Maps API daily query limit has been reached!. %1$s ',
						'tribe-events-calendar-pro'
					),
					'<a href="' . esc_url( $link ). '">' . esc_html__( 'Enter your API Key', 'tribe-events-calendar-pro' ) . '</a>.'
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Gets all settings
	 * @static
	 *
	 * @param bool $force
	 *
	 * @return mixed|void
	 */
	public static function getOptions( $force = false ) {
		if ( ! isset( self::$options ) || $force ) {
			$options       = get_option( self::OPTIONNAME, array() );
			self::$options = apply_filters( 'tribe_geoloc_get_options', $options );
		}

		return self::$options;
	}

	/**
	 * Gets a single option from the settings
	 *
	 * @param string $optionName
	 * @param string $default
	 * @param bool   $force
	 *
	 * @return mixed|void
	 */
	public function getOption( $optionName, $default = '', $force = false ) {


		if ( ! isset( self::$options ) || $force ) {
			self::getOptions( $force );
		}

		if ( isset( self::$options[ $optionName ] ) ) {
			$option = self::$options[ $optionName ];
		} else {
			$option = $default;
		}

		return apply_filters( 'tribe_geoloc_get_single_option', $option, $default );
	}

	/**
	 * Returns the geofence size in kms.
	 *
	 * @return mixed|void
	 */
	private function get_geofence_size() {
		$default  = tribe_get_option( 'geoloc_default_geofence', 25 );
		$geofence = apply_filters( 'tribe_geoloc_geofence', $default );
		$unit     = tribe_get_option( 'geoloc_default_unit', 'miles' );

		// Ensure we use the correct internal unit of measure (kilometres)
		return tribe_convert_units( $geofence, $unit, 'kms' );
	}

	/**
	 * Get a list of venues inside a given geo fence with the given geo point at the center.
	 *
	 * @param float $lat
	 * @param float $lng
	 * @param float $geofence_radio
	 *
	 * @return array|null
	 */
	public function get_venues_in_geofence( $lat, $lng, $geofence_radio = null ) {

		$lat = floatval( $lat );

		if ( empty( $geofence_radio ) ) {
			$geofence_radio = $this->get_geofence_size();
		}

		// get the limits of the geofence

		$maxLat = $lat + rad2deg( $geofence_radio / self::EARTH_RADIO );
		$minLat = $lat - rad2deg( $geofence_radio / self::EARTH_RADIO );
		$maxLng = $lng + rad2deg( $geofence_radio / self::EARTH_RADIO / cos( deg2rad( $lat ) ) );
		$minLng = $lng - rad2deg( $geofence_radio / self::EARTH_RADIO / cos( deg2rad( $lat ) ) );

		$latlng = array(
			'lat'    => $lat,
			'lng'    => $lng,
			'minLat' => $minLat,
			'maxLat' => $maxLat,
			'minLng' => $minLng,
			'maxLng' => $maxLng,
		);

		/**
		 * Allow overriding of Venues query by returning an array of Venue IDs.
		 *
		 * @since 4.4.16
		 *
		 * @param null|int[] $venues Venue IDs, default null will query database directly.
		 * @param array      $latlng {
		 * 		Latitude / longitude values for geofencing
		 *
		 *		@type float $lat    Central latitude point
		 *		@type float $lng    Central longitude point
		 *		@type float $minLat Minimum latitude constraint
		 *		@type float $maxLat Maximum latitude constraint
		 *		@type float $minLng Minimum longitude constraint
		 *		@type float $maxLng Maximum longitude constraint
		 * }
		 * @param float      $geofence_radio Geofence size in kilometers
		 */
		$venues = apply_filters( 'tribe_geoloc_pre_get_venues_in_geofence', null, $latlng, $geofence_radio );

		if ( null === $venues ) {
			global $wpdb;

			// Get the venues inside a geofence
			$sql = "
				SELECT DISTINCT venue_id FROM (
					SELECT coords.venue_id,
					       MAX( coords.lat ) AS lat,
					       MAX( coords.lng ) AS lng
					FROM (
						SELECT post_id AS venue_id,
							CASE
								WHEN meta_key = %s
								THEN meta_value
							END AS lat,
							CASE
								WHEN meta_key = %s
								THEN meta_value
							END AS lng
						FROM $wpdb->postmeta
						WHERE
							meta_key = %s
							OR meta_key = %s
					) AS coords
					INNER JOIN $wpdb->posts p
					    ON p.id = coords.venue_id
					WHERE
						(lat > %f OR lat IS NULL)
						AND (lat < %f OR lat IS NULL)
						AND (lng > %f OR lng IS NULL)
						AND (lng < %f OR lng IS NULL)
						AND p.post_status = 'publish'
						AND p.post_type = %s
					GROUP BY venue_id
					HAVING
						lat IS NOT NULL
						AND lng IS NOT NULL
			       ) AS query
		       ";

			$sql = $wpdb->prepare(
				$sql,
				array(
					self::LAT,
					self::LNG,
					self::LAT,
					self::LNG,
					$minLat,
					$maxLat,
					$minLng,
					$maxLng,
					Tribe__Events__Main::VENUE_POST_TYPE,
				)
			);

			$venues = $wpdb->get_col( $sql );
		}

		// Return null if $venues is empty
		if ( empty( $venues ) ) {
			$venues = null;
		}

		return $venues;
	}

	/**
	 * Orders a list of posts by distance to a given geo point
	 *
	 * @param $posts
	 * @param $lat_from
	 * @param $lng_from
	 */
	public function assign_distance_to_posts( &$posts, $lat_from, $lng_from ) {

		// add distances
		$num_posts = count( $posts );
		for ( $i = 0; $i < $num_posts; $i ++ ) {
			$posts[ $i ]->lat      = $this->get_lat_for_event( $posts[ $i ]->ID );
			$posts[ $i ]->lng      = $this->get_lng_for_event( $posts[ $i ]->ID );
			$posts[ $i ]->distance = $this->get_distance_between_coords( $lat_from, $lng_from, $posts[ $i ]->lat, $posts[ $i ]->lng );
		}

		//no return, $posts passed by ref
	}

	/**
	 * Implementation of the Haversine Formula to get the distance in kms between two geo points
	 *
	 * @param float $lat_from
	 * @param float $lng_from
	 * @param float $lat_to
	 * @param float $lng_to
	 *
	 * @return float
	 */
	public function get_distance_between_coords( $lat_from, $lng_from, $lat_to, $lng_to ) {

		$delta_lat = $lat_to - $lat_from;
		$delta_lng = $lng_to - $lng_from;


		$a        = sin( deg2rad( (double) ( $delta_lat / 2 ) ) ) * sin( deg2rad( (double) ( $delta_lat / 2 ) ) ) + cos( deg2rad( (double) $lat_from ) ) * cos( deg2rad( (double) $lat_to ) ) * sin( deg2rad( (double) ( $delta_lng / 2 ) ) ) * sin( deg2rad( (double) ( $delta_lng / 2 ) ) );
		$c        = asin( min( 1, sqrt( $a ) ) );
		$distance = 2 * self::EARTH_RADIO * $c;
		$distance = round( $distance, 4 );

		return $distance;
	}

	/**
	 * Returns the latitude of the venue for an event
	 *
	 * @param $event_id
	 *
	 * @return mixed
	 */
	public function get_lat_for_event( $event_id ) {
		$venue = tribe_get_venue_id( $event_id );

		return get_post_meta( $venue, self::LAT, true );
	}

	/**
	 * Returns the longitude of the venue for an event
	 *
	 * @param $event_id
	 *
	 * @return mixed
	 */
	public function get_lng_for_event( $event_id ) {
		$venue = tribe_get_venue_id( $event_id );

		return get_post_meta( $venue, self::LNG, true );
	}

	/**
	 * Get the minimum and maximum latitudes and longitudes for all published events.
	 *
	 * @return array (
	 * 	Latitude / longitude values for geofencing
	 *
	 *	@type float $max_lat Maximum latitude constraint
	 *	@type float $max_lng Maximum longitude constraint
	 *	@type float $min_lat Minimum latitude constraint
	 *	@type float $min_lng Minimum longitude constraint
	 * }
	 */
	public function get_min_max_coords() {
		global $wpdb;

		$coords = get_transient( self::ESTIMATION_CACHE_KEY );

		// We have a cached value!
		if ( is_array( $coords ) ) {
			return $coords;
		}

		/**
		 * Allow overriding of queries to get min/max coordinates by returning an array of coordinate values.
		 *
		 * @since 4.4.21
		 *
		 * @param null|array $latlng {
		 * 		Latitude / longitude values for geofencing
		 *
		 *		@type float $max_lat Maximum latitude constraint
		 *		@type float $max_lng Maximum longitude constraint
		 *		@type float $min_lat Minimum latitude constraint
		 *		@type float $min_lng Minimum longitude constraint
		 * }
		 */
		$coords = apply_filters( 'tribe_geoloc_pre_get_min_max_coords', null );

		if ( null === $coords ) {
			$venues_list = $this->get_active_venues();
			$published_venues = array();

			if ( ! empty( $venues_list ) ) {
				$published_venues = $this->filter_published_venues( $venues_list );
			}

			// Only run query if there are events
			if ( ! empty( $published_venues ) ) {
				$venues_ids_prepared = implode( ', ', $published_venues );
				$latitude_key       = self::LAT;
				$longitude_key      = self::LNG;

				$sql = "
					SELECT
						MAX( `coords`.`lat` ) AS `max_lat`,
						MAX( `coords`.`lng` ) AS `max_lng`,
						MIN( `coords`.`lat` ) AS `min_lat`,
						MIN( `coords`.`lng` ) AS `min_lng`
					FROM (
						SELECT `post_id` AS `venue_id`,
							CASE
							WHEN `meta_key` = '{$latitude_key}'
								THEN CAST( `meta_value` AS DECIMAL( 10, 6 ) )
							END AS `lat`,
							CASE
								WHEN `meta_key` = '{$longitude_key}'
								THEN CAST( `meta_value` AS DECIMAL( 10, 6 ) )
							END AS `lng`
						FROM `{$wpdb->postmeta}`
						WHERE
							(
								`meta_key` = '{$latitude_key}'
								OR `meta_key` = '{$longitude_key}'
							)
							AND `post_id` IN ( {$venues_ids_prepared} )
					) AS `coords`
				";

				$coords = $wpdb->get_row( $sql, ARRAY_A );
			}
		}

		if ( ! empty( $coords ) ) {
			// If there is no geoloc data then each result will be null - we cannot pass null values
			// to the Google Maps API however
			$coords = array_map( 'floatval', $coords );
		}

		set_transient( self::ESTIMATION_CACHE_KEY, $coords, DAY_IN_SECONDS );

		// If no coords found, always return an empty array with null args
		if ( empty( $coords ) ) {
			$coords = array(
				'max_lat' => null,
				'max_lng' => null,
				'min_lat' => null,
				'min_lng' => null,
			);
		}

		return $coords;
	}

	/**
	 * Get a list of IDs of all the active venues being used on events, this will allow to filter with only the active
	 * venues used at the moment.
	 *
	 * @since 4.4.24
	 *
	 * @return array
	 */
	private function get_active_venues() {
		$results = array();
		global $wpdb;
		$sql = "SELECT DISTINCT meta_value
		FROM `{$wpdb->postmeta}`
		WHERE meta_key = '_EventVenueID'";

		$query = $wpdb->get_results( $sql );
		if ( empty( $query ) || ! is_array( $query ) ) {
			return $results;
		}

		foreach ( $query as $row ) {
			$results[] = absint( $row->meta_value );
		}

		return $results;
	}

	/**
	 * Makes sure the list of venues are published.
	 *
	 * @since 4.4.24
	 *
	 * @param array $list List of Venues IDs
	 *
	 * @return array
	 */
	private function filter_published_venues( $list = array() ) {
		$query = new WP_Query(
			array(
				'post_type' => Tribe__Events__Venue::POSTTYPE,
				'posts_per_page' => -1,
				'post_status' => 'publish',
				'fields' => 'ids',
				'post__in' => $list,
				'no_found_rows' => true,
			)
		);
		return $query->posts;
	}

	/**
	 * Deletes the cached value for the min/max lat/lng.
	 *
	 * @return bool Indicates success.
	 */
	public function clear_min_max_coords_cache() {
		return delete_transient( self::ESTIMATION_CACHE_KEY );
	}

	/**
	 * Get the minimum and maximum latitudes and longitudes for all published events.
	 *
	 * @deprecated 4.4.19 `\Tribe__Events__Pro__Geo_Loc::get_min_max_coords()`
	 *
	 * @return array
	 */
	public function estimate_center_point() {
		return $this->get_min_max_coords();
	}

	/**
	 * Generates the array of markers to pin the events in the Google Map embed in the map view
	 *
	 * @param $events
	 *
	 * @return array
	 */
	public function generate_markers( $events ) {

		$markers = array();

		// let's track which recurrence venues have already been marked
		$already_marked = array();

		foreach ( $events as $event ) {

			$venue_id = tribe_get_venue_id( $event->ID );
			$lat      = get_post_meta( $venue_id, self::LAT, true );
			$lng      = get_post_meta( $venue_id, self::LNG, true );
			$address  = tribe_get_address( $event->ID );
			$title    = $event->post_title;
			$link     = get_permalink( $event->ID );

			// let's keep track of the post ID/address combos that we've set markers for. If we get a
			// duplicate (a recurrence post with the same address), let's skip it.
			$location_id_hash = md5( $address . ( $event->post_parent ? $event->post_parent : $event->ID ) );
			if ( ! empty( $already_marked[ $location_id_hash ] ) ) {
				continue;
			}

			$already_marked[ $location_id_hash ] = true;

			// replace commas with decimals in case they were saved with the european number format
			$lat = str_replace( ',', '.', $lat );
			$lng = str_replace( ',', '.', $lng );

			$markers[] = array(
				'lat'      => $lat,
				'lng'      => $lng,
				'title'    => $title,
				'address'  => $address,
				'link'     => $link,
				'venue_id' => $venue_id,
				'event_id' => $event->ID,
			);
		}

		return $markers;
	}

	/**
	 * Generates the button to add the geo data info to all venues that are missing it
	 * @return string
	 */
	private function fix_geoloc_data_button() {
		$settings = Tribe__Settings::instance();
		$url      = apply_filters( 'tribe_settings_url', add_query_arg( array(
					'post_type' => Tribe__Events__Main::POSTTYPE,
					'page'      => $settings->adminSlug,
				), admin_url( 'edit.php' ) ) );
		$url      = add_query_arg( array( 'geoloc_fix_venues' => '1' ), $url );
		$url      = wp_nonce_url( $url, 'geoloc_fix_venues' );

		return sprintf( '<a href="%s" class="button">%s</a>', esc_url( $url ), __( 'Fix venues data', 'tribe-events-calendar-pro' ) );
	}

	/**
	 * Check if there are venues without geo data and hook into admin_notices to show a message to the user.
	 */
	public function maybe_offer_generate_geopoints() {
		if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
			return;
		}

		$done = get_option( '_tribe_geoloc_fixed' );

		if ( ! empty( $done ) ) {
			return;
		}

		$venues = $this->get_venues_without_geoloc_info();

		if ( $venues->found_posts === 0 ) {
			return;
		}

		add_action( 'admin_notices', array( $this, 'show_offer_to_fix_notice' ) );
	}

	/**
	 * If there are venues without geo data, offer the user to fix them.
	 */
	public function show_offer_to_fix_notice() {

		$settings = Tribe__Settings::instance();
		$url      = apply_filters( 'tribe_settings_url',
			add_query_arg(
				array(
					'post_type' => Tribe__Events__Main::POSTTYPE,
					'page'      => $settings->adminSlug,
				),
				admin_url( 'edit.php' )
			)
		);

		?>
		<div class="updated">
			<p><?php echo sprintf( __( "You have venues for which we don't have Geolocation information. <a href='%s'>Click here to generate it</a>.", 'tribe-events-calendar-pro' ), esc_url( $url ) . '#geoloc_fix' ); ?></p>
		</div>
		<?php
	}

	/**
	 * If the user pressed the button to fix all the venues without geo data, it shows a message
	 * showing the amount of venues fixed.
	 */
	public function maybe_generate_geopoints_for_all_venues() {

		if ( empty( $_GET['geoloc_fix_venues'] ) || ! wp_verify_nonce( $_REQUEST['_wpnonce'], 'geoloc_fix_venues' ) ) {
			return;
		}

		$this->last_venues_fixed_count = $this->generate_geopoints_for_all_venues();

		add_action( 'admin_notices', array( $this, 'show_fixed_notice' ) );
	}

	/**
	 * Shows a message with the amount of venues fixed.
	 */
	public function show_fixed_notice() {
		?>
		<div class="updated">
			<p><?php echo sprintf( __( 'Fixed geolocation data for %d venues', 'tribe-events-calendar-pro' ), $this->last_venues_fixed_count ); ?></p>
		</div>
		<?php
	}

	/**
	 * Grabs all the venues without geo data and uses the Google Maps API to get it.
	 *
	 * @static
	 * @return int
	 */
	public function generate_geopoints_for_all_venues() {

		tribe_set_time_limit( 5 * 60 );

		$venues = $this->get_venues_without_geoloc_info( true );

		$count = 0;
		foreach ( $venues->posts as $venue ) {
			$data             = array();
			$data['Address']  = get_post_meta( $venue->ID, '_VenueAddress', true );
			$data['City']     = get_post_meta( $venue->ID, '_VenueCity', true );
			$data['Province'] = get_post_meta( $venue->ID, '_VenueProvince', true );
			$data['State']    = get_post_meta( $venue->ID, '_VenueState', true );
			$data['Zip']      = get_post_meta( $venue->ID, '_VenueZip', true );
			$data['Country']  = get_post_meta( $venue->ID, '_VenueCountry', true );

			self::instance()->save_venue_geodata( $venue->ID, $data );

			$count ++;
		}

		update_option( '_tribe_geoloc_fixed', 1 );

		return $count;
	}

	/**
	 * Static Singleton Factory Method
	 *
	 * @return Tribe__Events__Pro__Geo_Loc
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			$className      = __CLASS__;
			self::$instance = new $className;
		}

		return self::$instance;
	}

	/**
	 * Update the Google Map Link to add the coordinates if present to increase accuracy on it.
	 *
	 * @since 4.4.26
	 *
	 * @param $link
	 * @param $post_id
	 *
	 * @return string
	 */
	public function google_map_link( $link, $post_id ) {
		$venue_id = function_exists( 'tribe_get_venue_id' ) ? tribe_get_venue_id( $post_id ) : $post_id;
		$is_venue = function_exists( 'tribe_is_venue' ) ? tribe_is_venue( $venue_id ) : false;

		/**
		 * Disable the behavior to add the coordinates if present on the Google Map Link
		 *
		 * @since 4.4.26
		 *
		 * @param $disable true to disable the behavior / false to keep doing it
		 * @param $post_id The ID of the post being modified
		 *
		 * @return boolean
		 */
		$disable_behavior = apply_filters( 'tribe_events_pro_google_map_link_disable_coordinates', false, $post_id );

		if ( ! $is_venue || $disable_behavior ) {
			return $link;
		}

		$coordinates = tribe_get_coordinates( $post_id );
		if ( empty( $coordinates['lat'] ) || empty( $coordinates['lng'] ) || ! function_exists( 'tribe_is_venue' ) ) {
			return $link;
		}

		return add_query_arg(
			array(
				'api'   => 1,
				'query' => urlencode( $coordinates['lat'] . ',' . $coordinates['lng'] ),
			),
			'https://www.google.com/maps/search/'
		);
	}
}
