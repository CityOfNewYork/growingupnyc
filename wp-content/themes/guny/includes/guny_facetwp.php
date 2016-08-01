<?php
/**
* Modifications to Facet WP
*/

function guny_facetwp_facet_html( $output, $params ) {
  if ($params['facet']['type'] == 'search') {
    $output = '';
    $value = (array) $params['selected_values'];
    $value = empty( $value ) ? '' : stripslashes( $value[0] );
    $placeholder = isset( $params['facet']['placeholder'] ) ? $params['facet']['placeholder'] : __( 'Enter keywords', 'fwp' );
    $placeholder = facetwp_i18n( $placeholder );
    $output .= '<label class="c-hero__label" for="facetwp-"' . $params['facet']['name'] . '">Showing results for</label>';
    $output .= '<div class="facetwp-search-wrap form-field__icon-container">';
    $output .= '<input type="text" id="facetwp-' . $params['facet']['name'] . '" class="facetwp-search form-field form-field--large form-field--full-width c-hero__input" value="' . esc_attr( $value ) . '" placeholder="' . esc_attr( $placeholder ) . '" />';
    $output .= '<button class="facetwp-searchbtn form-field__icon form-field__icon--large"><svg class="icon"><use xlink:href="#search"></use></svg></button>';
    $output .= '</div>';
    return $output;
  }
  return $output;
}
add_filter( 'facetwp_facet_html', 'guny_facetwp_facet_html', 10, 2 );
