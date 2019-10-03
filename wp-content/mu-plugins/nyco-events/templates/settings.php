<?php 
  if ( ! defined( 'NYCO_EVENTS_PATH' ) ) exit;
?>

<div class="wrap">
  <h1>NYCO Events Settings</h1>
  <p>Add all the RSS feeds that you would like to use to pull events.</p>

  <form method="post" action="options.php">
    
    <?php 
      settings_fields( 'nyco-events-rss-group' );
      do_settings_sections( 'nyco-events-rss-group' ); 
    ?>
  
    <table class="wp-list-table">
      <tr>
      <th>RSS Feed Name</th>
      <th>RSS Feed URL</th>
      </tr>
    <tr>
      <td><input type="text" name="rss_name" value="<?php echo get_option('rss_name'); ?>" placeholder="RSS Feed Name" class="regular-text"/></td>
      <td><input type="text" name="rss_url" value="<?php echo get_option('rss_url'); ?>" placeholder="RSS Feed URL" class="regular-text"/></td>
    </tr>
    </table>
    <?php submit_button(); ?>
  </form>
</div>