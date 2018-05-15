<?php

class FacetWP_Facet_Number_Range extends FacetWP_Facet
{

    function __construct() {
        $this->label = __( 'Number Range', 'fwp' );
    }


    /**
     * Generate the facet HTML
     */
    function render( $params ) {

        $output = '';
        $value = $params['selected_values'];
        $value = empty( $value ) ? array( '', '', ) : $value;
        $fields = empty( $params['facet']['fields'] ) ? 'both' : $params['facet']['fields'];

        if ( 'exact' == $fields ) {
            $output .= '<input type="text" class="facetwp-number facetwp-number-min" value="' . esc_attr( $value[0] ) . '" placeholder="' . __( 'Number', 'fwp' ) . '" />';
        }
        if ( 'both' == $fields || 'min' == $fields ) {
            $output .= '<input type="text" class="facetwp-number facetwp-number-min" value="' . esc_attr( $value[1] ) . '" placeholder="' . __( 'Min', 'fwp' ) . '" />';
        }
        if ( 'both' == $fields || 'max' == $fields ) {
            $output .= '<input type="text" class="facetwp-number facetwp-number-max" value="' . esc_attr( $value[1] ) . '" placeholder="' . __( 'Max', 'fwp' ) . '" />';
        }

        $output .= '<input type="button" class="facetwp-submit" value="' . __( 'Go', 'fwp' ) . '" />';

        return $output;
    }


    /**
     * Filter the query based on selected values
     */
    function filter_posts( $params ) {
        global $wpdb;

        $facet = $params['facet'];
        $values = $params['selected_values'];
        $where = '';

        $min = ( '' == $values[0] ) ? false : FWP()->helper->format_number( $values[0] );
        $max = ( '' == $values[1] ) ? false : FWP()->helper->format_number( $values[1] );

        $fields = isset( $facet['fields'] ) ? $facet['fields'] : 'both';
        $compare_type = isset( $facet['compare_type'] ) ? $facet['compare_type'] : '';

        $is_dual = ! empty( $facet['source_other'] );
        $cond_both = ( 'both' == $fields && ( 'enclose' == $compare_type || 'intersect' == $compare_type ) );
        $cond_min_or_max = ( ( 'min' == $fields || 'max' == $fields ) && 'intersect' == $compare_type );

        if ( $is_dual && ( $cond_both || $cond_min_or_max ) ) {
            $min = ( false !== $min ) ? $min : -999999999999;
            $max = ( false !== $max ) ? $max : 999999999999;

            /**
             * Enclose compare
             * The post's range must surround the user-defined range
             */
            if ( 'enclose' == $compare_type ) {
                $where .= " AND (facet_value + 0) <= '$min'";
                $where .= " AND (facet_display_value + 0) >= '$max'";
            }

            /**
             * Intersect compare
             * @link http://stackoverflow.com/a/325964
             */
            if ( 'intersect' == $compare_type ) {
                $where .= " AND (facet_value + 0) <= '$max'";
                $where .= " AND (facet_display_value + 0) >= '$min'";
            }
        }

        /**
         * Basic compare
         * The user-defined range must surround the post's range
         */
        else {
            if ( 'exact' == $fields ) {
                $max = $min;
            }
            if ( false !== $min ) {
                $where .= " AND (facet_value + 0) >= '$min'";
            }
            if ( false !== $max ) {
                $where .= " AND (facet_display_value + 0) <= '$max'";
            }
        }

        $sql = "
        SELECT DISTINCT post_id FROM {$wpdb->prefix}facetwp_index
        WHERE facet_name = '{$facet['name']}' $where";
        return facetwp_sql( $sql, $facet );
    }


    /**
     * (Admin) Output settings HTML
     */
    function settings_html() {
        $sources = FWP()->helper->get_data_sources();
?>
        <tr>
            <td>
                <?php _e('Other data source', 'fwp'); ?>:
                <div class="facetwp-tooltip">
                    <span class="icon-question">?</span>
                    <div class="facetwp-tooltip-content"><?php _e( 'Use a separate value for the upper limit?', 'fwp' ); ?></div>
                </div>
            </td>
            <td>
                <select class="facet-source-other">
                    <option value=""><?php _e( 'None', 'fwp' ); ?></option>
                    <?php foreach ( $sources as $group ) : ?>
                    <optgroup label="<?php echo $group['label']; ?>">
                        <?php foreach ( $group['choices'] as $val => $label ) : ?>
                        <option value="<?php echo esc_attr( $val ); ?>"><?php echo esc_html( $label ); ?></option>
                        <?php endforeach; ?>
                    </optgroup>
                    <?php endforeach; ?>
                </select>
            </td>
        </tr>
        <tr>
            <td><?php _e('Fields to show', 'fwp'); ?>:</td>
            <td>
                <select class="facet-number-fields">
                    <option value="both"><?php _e( 'Min + Max', 'fwp' ); ?></option>
                    <option value="exact"><?php _e( 'Exact', 'fwp' ); ?></option>
                    <option value="min"><?php _e( 'Min', 'fwp' ); ?></option>
                    <option value="max"><?php _e( 'Max', 'fwp' ); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <td><?php _e('Compare type', 'fwp'); ?>:</td>
            <td>
                <select class="facet-compare-type">
                    <option value=""><?php _e( 'Basic', 'fwp' ); ?></option>
                    <option value="enclose"><?php _e( 'Enclose', 'fwp' ); ?></option>
                    <option value="intersect"><?php _e( 'Intersect', 'fwp' ); ?></option>
                </select>
            </td>
        </tr>
<?php
    }
}
