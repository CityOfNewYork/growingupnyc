<?php
/**
* Modifications to Facet WP
*/
/**
* Custom HTML for the search facet
*/
if ( ! function_exists('get_current_page')) {
  /*
    Given a url and key as page or query then this function will return the page url or query parameters accordingly.
    param: url , key value either 'page' or 'query'
    returns: a string containing url or query string
    default return : passued url
  */
  function get_current_page($url){
    // $urlarray = parse_url($url);
    // return $urlarray["scheme"].'://'.$urlarray['host'].$urlarray['path'];
    $mainurl = explode("?", $url);
    return $mainurl[0];
  }
}
if ( ! function_exists('get_url_query_parameters')) {
  /*
    Given a url will return all query parameters as an array.
    param: url
    returns: an array of query parameters as a key value pair.
  */
  function get_url_query_parameters($url){
    parse_str(parse_url($url, PHP_URL_QUERY), $output);
    return $output;
  }
}
if ( ! function_exists('update_url_queries')) {
  /*
    Given a array of queries with key value pair this function will update the array already with the key and value
    param: array of query string as key value , querykey , query value 
    returns: updated array of query parameters.
  */
  function update_url_queries($queryparameter , $newquerykey , $newqueryvalue){
    $updated = false;
    foreach ($queryparameter as $querykey => $queryvalue) {
      if($querykey == 'fwp_'.$newquerykey){
        $queryparameter[$querykey] = $newqueryvalue;
        $updated = true;
      }
      if(is_null($queryparameter[$querykey])){
        unset($queryparameter[$querykey]);
        $updated = true;
      }
      if($querykey == 'fwp_paged'){
        unset($queryparameter[$querykey]);
      }
    }
    if(!$updated && !is_null($newqueryvalue)){
      $queryparameter['fwp_'.$newquerykey] = $newqueryvalue;
    }
    return $queryparameter;
  }
}
if ( ! function_exists('generate_new_url')) {
  /*
    Given a url and parameters function will generate the new url.
    param : URL as string , Query parameter as array 
    returns: the url with query strings appended to it.
  */
  function generate_new_url($url , $queryparameter){
    if (!empty($queryparameter)) {
      $querystring = http_build_query($queryparameter,'','&');
      return $url.'?'.$querystring;
    }
    return $url;
  }
}
if ( ! function_exists('update_url_pagers')) {
  /*
    Given a parameters array function will generate the pager for the facet.
    param : Query parameter as array and $pagenumber
    returns: the url with pager strings appended to it.
  */
  function update_url_pagers($queryparameter , $pagenumber){
    $queryparameter['fwp_paged'] = $pagenumber;
    return $queryparameter;
  }
}
if ( ! function_exists('add_facet_query_string_url')) {
  function add_facet_query_string_url($facetname , $facetvalue , $url){
    $mainurl = get_current_page($url);
    $urlqueries = get_url_query_parameters($url);
    $urlqueries = update_url_queries($urlqueries , $facetname , $facetvalue);
    $finalurl = generate_new_url($mainurl , $urlqueries);
    return $finalurl;
  }
}
if ( ! function_exists('add_facet_pagers')) {
  function add_facet_pagers($url , $pagenumber){
    $mainurl = get_current_page($url);
    $urlqueries = get_url_query_parameters($url);
    $urlqueries = update_url_pagers($urlqueries , $pagenumber);
    $finalurl = generate_new_url($mainurl , $urlqueries);
    //Serach value must be without +
    $finalurl = str_replace("+","%20",$finalurl);
    return $finalurl;
  }
}

function guny_facetwp_facet_html( $output, $params ) {
  if ($params['facet']['type'] == 'search') {
    $output = '';
    $value = (array) $params['selected_values'];
    $value = empty( $value ) ? '' : stripslashes( $value[0] );
    $placeholder = isset( $params['facet']['placeholder'] ) ? $params['facet']['placeholder'] : __( 'Enter keywords', 'fwp' );
    $placeholder = facetwp_i18n( $placeholder );
    if (!empty($value)) {
      $output .= '<label class="c-hero__label" for="facetwp-"' . $params['facet']['name'] . '">Showing results for</label>';
    }
    $output .= '<div class="facetwp-search-wrap form-field__icon-container">';
    $output .= '<input type="text" id="facetwp-' . $params['facet']['name'] . '" class="facetwp-search form-field form-field--large form-field--full-width c-hero__input" value="' . esc_attr( $value ) . '" placeholder="Search" />';
    $output .= '<button class="facetwp-searchbtn form-field__icon form-field__icon--large"><svg class="icon"><title>Search</title><use xlink:href="#search"></use></svg></button>';
    $output .= '<button class="facetwp-btn form-field__icon form-field__icon--large form-field__icon--weak"><svg class="icon"><title>Clear</title><use xlink:href="#close"></use></svg></button>';
    $output .= '</div>';
    return $output;
  }
  return $output;
}
add_filter( 'facetwp_facet_html', 'guny_facetwp_facet_html', 10, 2 );

/**
* Custom HTML for the pager
*/
function guny_facetwp_pager_html( $output, $params ) {
  // $url=strtok($_SERVER["HTTP_REFERER"],'?').'?'.strtok('&');
  $url=strtok($_SERVER['REQUEST_SCHEME'].'://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"],'?').'?'.strtok('&');
  $page = (int) $params['page'];
  $per_page = (int) $params['per_page'];
  $total_rows = (int) $params['total_rows'];
  $total_pages = (int) $params['total_pages'];
  $output = '';
  if ( $total_pages <= 1 ) {
    return $output;
  }
  if ( 1 <= ( $page - 1 ) ) {
    // $output .= '<a class="button--outline button--outline--gray alignleft" href="'.add_facet_pagers($_SERVER["HTTP_REFERER"] , ($page - 1)).'">Previous</button>';
    $output .= '<a class="button--outline button--outline--gray alignleft" href="'.add_facet_pagers($_SERVER['REQUEST_SCHEME'].'://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"] , ($page - 1)).'">Previous</button>';
  }
  if ( $total_pages >= ( $page + 1 ) ) {
    // $output .= '<a class="button--outline button--outline--gray alignright" href="'.add_facet_pagers($_SERVER["HTTP_REFERER"] , ($page + 1)). '">Next</button>';
    $output .= '<a class="button--outline button--outline--gray alignright" href="'.add_facet_pagers($_SERVER['REQUEST_SCHEME'].'://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"] , ($page + 1)). '">Next</button>';
  }
  return $output;
}
add_filter( 'facetwp_pager_html', 'guny_facetwp_pager_html', 10, 2 );

/**
* Replace the FacetWP base CSS file with a theme version
*/
function guny_facetwp_assets( $assets ) {
  $assets['front.css'] = get_stylesheet_directory_uri() . '/assets/vendor/front.css';
  return $assets;
}
add_filter( 'facetwp_assets', 'guny_facetwp_assets' );

/**
* Custom facet type
*/
class FacetWP_Facet_Guny {
  function __construct() {
    $this->label = __( 'GrowingUpNYC', 'fwp' );

    add_filter( 'facetwp_store_unfiltered_post_ids', array( $this, 'store_unfiltered_post_ids' ) );
  }

  function load_values( $params ) {
    global $wpdb;

    $facet = $params['facet'];
    $raw_post_ids = implode( ',', FWP()->unfiltered_post_ids );

    // Orderby
    $orderby = 'counter DESC, f.facet_display_value ASC';
    if ( 'display_value' == $facet['orderby'] ) {
      $orderby = 'f.facet_display_value ASC';
    }
    elseif ( 'raw_value' == $facet['orderby'] ) {
      $orderby = 'f.facet_value ASC';
    }
    // restore the correct sorting of groups for the programs page
    if ( 'ages' == $facet['name'] ) {
      $orderby = 'FIELD(f.facet_display_value, "Baby", "Toddler", "Pre-Schooler", "Grade-Schooler", "Pre-Teen", "Teen", "Young Adult", "Caregiver", "Everyone")';
    }

    // Limit
    $limit = ctype_digit( $facet['count'] ) ? $facet['count'] : 10;

    $sql = "
    SELECT f.facet_value, f.facet_display_value, COUNT(*) AS counter
    FROM {$wpdb->prefix}facetwp_index f
    WHERE f.facet_name = '{$facet['name']}' AND post_id IN ($raw_post_ids)
    GROUP BY f.facet_value
    ORDER BY $orderby
    LIMIT $limit";

    return $wpdb->get_results( $sql, ARRAY_A );
  }

  function filter_posts ( $params ) {
    global $wpdb;

    $facet = $params['facet'];
    $selected_values = $params['selected_values'];
    $selected_values = is_array( $selected_values ) ? $selected_values[0] : $selected_values;

    $sql = "
    SELECT DISTINCT post_id FROM {$wpdb->prefix}facetwp_index
    WHERE facet_name = '{$facet['name']}' AND facet_value IN ('$selected_values')";
    return $wpdb->get_col( $sql );
  }

  function admin_scripts() {
?>
<script>
(function($) {
    wp.hooks.addAction('facetwp/load/guny', function($this, obj) {
      $this.find('.facet-source').val(obj.source);
      $this.find('.facet-label-any').val(obj.label_any);
      $this.find('.facet-orderby').val(obj.orderby);
      $this.find('.facet-count').val(obj.count);
    });

    wp.hooks.addFilter('facetwp/save/guny', function($this, obj) {
      obj['source'] = $this.find('.facet-source').val();
      obj['label_any'] = $this.find('.facet-label-any').val();
      obj['orderby'] = $this.find('.facet-orderby').val();
      obj['count'] = $this.find('.facet-count').val();
      return obj;
    });
})(jQuery);
</script>
<?php
  }
  function settings_html() {
?>
  <tr>
    <td>
      <?php _e( 'Default label', 'fwp' ); ?>:
      <div class="facetwp-tooltip">
        <span class="icon-question">?</span>
        <div class="facetwp-tooltip-content">
            Customize the first option label (default: "Any")
        </div>
      </div>
    </td>
    <td>
      <input type="text" class="facet-label-any" value="<?php _e( 'Any', 'fwp' ); ?>" />
    </td>
  </tr>
  <tr>
    <td><?php _e('Sort by', 'fwp'); ?>:</td>
    <td>
      <select class="facet-orderby">
        <option value="count"><?php _e( 'Highest Count', 'fwp' ); ?></option>
        <option value="display_value"><?php _e( 'Display Value', 'fwp' ); ?></option>
        <option value="raw_value"><?php _e( 'Raw Value', 'fwp' ); ?></option>
      </select>
    </td>
  </tr>
  <tr>
    <td>
      <?php _e('Count', 'fwp'); ?>:
      <div class="facetwp-tooltip">
        <span class="icon-question">?</span>
        <div class="facetwp-tooltip-content"><?php _e( 'The maximum number of facet choices to show', 'fwp' ); ?></div>
      </div>
    </td>
    <td><input type="text" class="facet-count" value="20" /></td>
  </tr>
<?php
  }

  function render( $params ) {
    $url=strtok($_SERVER["HTTP_REFERER"],'?'); 
    $facet = $params['facet'];
    $label_any = empty( $facet['label_any'] ) ? __( 'Any', 'fwp' ) : $facet['label_any'];
    $label_any = facetwp_i18n( $label_any );
    $values = (array) $params['values'];
    $selected_values = (array) $params['selected_values'];
    $header = $label_any;
    if (!empty($selected_values)) {
      foreach ($values as $result) {
        if (in_array( $result['facet_value'], $selected_values)) {
          $header = $result['facet_display_value'];
        }
      }
    }
    $output = '<div class="c-list-box__item">';
    $output .= '<h3 class="js-accordion__header c-list-box__heading" id="' . $facet['name'] . '-heading">' . $header . '</h3>';
    $output .= '<ul class="js-accordion__content c-list-box__content" id="' . $facet['name'] . '-panel">';
    $selected = empty($selected_values) ? 'true' : 'false';
    // $output .= '<li><a href="'.add_facet_query_string_url($facet['name'],null,$_SERVER["HTTP_REFERER"]).'" class="c-list-box__subitem" data-value="">' . $label_any . '</a></li>';
    $output .= '<li><a href="'.add_facet_query_string_url($facet['name'],null,$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"]).'" class="c-list-box__subitem" data-value="">' . $label_any . '</a></li>';
    foreach( $values as $result ) {
      $selected = in_array( $result['facet_value'], $selected_values) ? 'true' : 'false';
      // $output .= '<li><a href="'.add_facet_query_string_url($facet['name'],$result['facet_value'],$_SERVER["HTTP_REFERER"]).'" class="c-list-box__subitem '.$result['facet_value'].'" aria-selected="' . $selected . '" data-value="' . $result['facet_value'] . '">' . $result['facet_display_value'] . '</a></li>';
      $output .= '<li><a href="'.add_facet_query_string_url($facet['name'],$result['facet_value'],$_SERVER['REQUEST_SCHEME'].'://'.$_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"]).'" class="c-list-box__subitem '.$result['facet_value'].'" aria-selected="' . $selected . '" data-value="' . $result['facet_value'] . '">' . $result['facet_display_value'] . '</a></li>';
    }
    $output .= '</ul>';
    $output .= '</div>';
    return $output;
  }
  function front_scripts() {
?>
  <script>
  (function($) {
      wp.hooks.addAction('facetwp/refresh/guny', function($this, facet_name) {
        var val = $this.find('[aria-selected="true"]').data('value');
        FWP.facets[facet_name] = val ? [val] : [];
      });

      $(document).on('facetwp-loaded', function() {
        $('.facetwp-guny').addClass('js-accordion')
        window.reInitializeAccordion($('.facetwp-guny'));
      });

      $(document).on('click.facetwp', '.facetwp-type-guny .facetwp-item', function(event) {
        event.preventDefault();
        $(this).closest('.facetwp-type-guny').find('[aria-selected="true"]').attr('aria-selected', false);
        $(this).attr('aria-selected', true);
        FWP.refresh();
      });
  })(jQuery);
  </script>
<?php
  }

  function store_unfiltered_post_ids( $boolean ) {
    if ( FWP()->helper->facet_setting_exists( 'type', 'guny' ) ) {
      return true;
    }

    return $boolean;
  }
}

function guny_facet_types( $facet_types ) {
    $facet_types['guny'] = new FacetWP_Facet_Guny();
    return $facet_types;
}
add_filter( 'facetwp_facet_types', 'guny_facet_types' );

function guny_facetwp_sort_options( $options, $params ) {
    unset( $options['title_asc'] );
    unset( $options['title_desc'] );
    unset( $options['date_asc'] );
    unset( $options['date_desc'] );
    unset( $options['distance'] );
    $options['relevance'] = array(
        'label' => 'Most Relevant',
        'query_args' => array(
            'orderby' => 'relevance',
            'order' => 'DESC'
        )
    );
    return $options;
}
add_filter( 'facetwp_sort_options', 'guny_facetwp_sort_options', 10, 2 );

function guny_facet_render_params( $params ) {
  $params['extras']['sort'] = 'relevance';
  return $params;
}
add_filter( 'facetwp_render_params', 'guny_facet_render_params' );
