<?php
/**
* Modifications to Facet WP
*/

/**
* Custom HTML for the search facet
*/
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
  $page = (int) $params['page'];
  $per_page = (int) $params['per_page'];
  $total_rows = (int) $params['total_rows'];
  $total_pages = (int) $params['total_pages'];
  $output = '';
  if ( $total_pages <= 1 ) {
    return $output;
  }
  if ( 1 <= ( $page - 1 ) ) {
    $output .= '<button class="facetwp-page button--outline button--outline--gray alignleft" data-page="' . ($page - 1) . '">Previous</button>';
  }
  if ( $total_pages >= ( $page + 1 ) ) {
    $output .= '<button class="facetwp-page button--outline button--outline--gray alignright" data-page="' . ($page + 1) . '">Next</button>';
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
    $output .= '<li><a href="#" class="c-list-box__subitem facetwp-item" aria-selected="' . $selected . '" data-value="">' . $label_any . '</a></li>';
    foreach( $values as $result ) {
      $selected = in_array( $result['facet_value'], $selected_values) ? 'true' : 'false';
      $output .= '<li><a href="#" class="c-list-box__subitem facetwp-item" aria-selected="' . $selected . '" data-value="' . $result['facet_value'] . '">' . $result['facet_display_value'] . '</a></li>';
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
