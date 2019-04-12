<?php
/**
 * Block: Additional Fields - URL
 *
 * See more documentation about our Blocks Editor templating system.
 *
 * @link {INSERT_ARTCILE_LINK_HERE}
 *
 * @version 4.6.1
 *
 */
$is_pristine = $this->attr( 'isPristine' );
$label       = $this->attr( 'label' );
$output      = $this->attr( 'output' );

if ( $is_pristine ) {
	return;
}
?>
<div class="tribe-block tribe-block__additional-field tribe-block__additional-field__url">
	<h3><?php echo esc_html( $label ); ?></h3>
	<a href="<?php echo esc_url( $output ); ?>"><?php echo esc_html( $output ); ?></a>
</div>
