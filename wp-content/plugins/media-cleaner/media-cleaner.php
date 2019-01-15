<?php
/*
Plugin Name: Media Cleaner
Plugin URI: https://meowapps.com
Description: Clean your Media Library, many options, trash system.
Version: 5.1.0
Author: Jordy Meow
Author URI: https://meowapps.com
Text Domain: media-cleaner

Originally developed for two of my websites:
- Jordy Meow (http://offbeatjapan.org)
- Haikyo (http://haikyo.org)
*/

if ( class_exists( 'Meow_WPMC_Core' ) ) {
  function wpmc_pro_admin_notices() {
    echo '<div class="error"><p>Thanks for installing the Pro version of Media Cleaner :) However, the free version is still enabled. Please disable or uninstall it.</p></div>';
  }
  add_action( 'admin_notices', 'wpmc_pro_admin_notices' );
  return;
}

if ( is_admin() ) {

  global $wpmc_version;
  $wpmc_version = '5.1.0';

  // Admin
  require __DIR__ . '/admin.php';
  $wpmc_admin = new Meow_WPMC_Admin( 'wpmc', __FILE__, 'media-cleaner' );

  // Core
  require __DIR__ . '/core.php';
  $wpmc_core = new Meow_WPMC_Core( $wpmc_admin );
	$wpmc_admin->core = $wpmc_core;

	// UI
	require __DIR__ . '/ui.php';
	new Meow_WPMC_UI( $wpmc_core, $wpmc_admin );

  /*******************************************************************************
   * TODO: OLD PRO,  THIS FUNCTION SHOULD BE REMOVED IN THE FUTURE
   ******************************************************************************/

  add_action( 'admin_notices', 'wpmc_meow_old_version_admin_notices' );

  function wpmc_meow_old_version_admin_notices() {
  	if ( isset( $_POST['wpmc_reset_sub'] ) ) {
  		delete_transient( 'wpmc_validated' );
  		delete_option( 'wpmc_pro_serial' );
  		delete_option( 'wpmc_pro_status' );
  	}
  	$subscr_id = get_option( 'wpmc_pro_serial', "" );
  	if ( empty( $subscr_id ) )
  		return;
    $forever = strpos( $subscr_id, 'F-' ) !== false;
  	$yearly = strpos( $subscr_id, 'I-' ) !== false;
  	if ( !$forever && !$yearly )
  		return;
  	?>
  	<div class="error">
  	<p>
  		<h2>IMPORTANT MESSAGE ABOUT MEDIA CLEANER</h2>
  		In order to comply with WordPress.org, BIG CHANGES in the code and how the plugin was sold were to be made. The plugin needs requires to be purchased and updated through the new <a target='_blank' href="https://store.meowapps.com">Meow Apps Store</a>. This store is also more robust (keys, websites management, invoices, etc). Now, since WordPress.org only accepts free plugins on its repository, this is the one currently installed. Therefore, you need to take an action. <b>Please click here to know more about your license and to learn what to do: <a target='_blank' href='https://meowapps.com/?mkey=<?php echo $subscr_id ?>'>License <?php echo $subscr_id ?></a></b>.
  	</p>
  		<p>
  		<form method="post" action="">
  			<input type="hidden" name="wpmc_reset_sub" value="true">
  			<input type="submit" name="submit" id="submit" class="button" value="Got it. Clear this!">
  			<br /><small><b>Make sure you followed the instruction before clicking this button.</b></small>
  		</form>
  	</p>
  	</div>
  	<?php
  }

}

?>
