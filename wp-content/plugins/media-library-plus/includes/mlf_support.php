<?php
		$theme = wp_get_theme();
    $browser = $this->get_browser();
		
		?>

					<div id="wp-media-grid" class="wrap">                
						<!--empty h2 for where WP notices will appear--> 
						<h1></h1>
						<div class="media-plus-toolbar"><div class="media-toolbar-secondary">  

						<div id="mgmlp-header">		
							<div id='mgmlp-title-area'>
							  <h2 class='mgmlp-title'><?php _e('Support', 'maxgalleria-media-library' ); ?> </h2>    

							</div> <!-- mgmlp-title-area -->
							<div id="new-top-promo">
								<a id="mf-top-logo" target="_blank" href="http://maxfoundry.com"><img alt="maxfoundry logo" src="<?php echo MAXGALLERIA_MEDIA_LIBRARY_PLUGIN_URL ?>/images/mf-logo.png" width="140" height="25" ></a>
								<p class="center-text"><?php _e('Makers of', 'maxgalleria-media-library' ); ?> <a target="_blank"  href="http://maxbuttons.com/">MaxButtons</a>, <a target="_blank" href="http://maxbuttons.com/product-category/button-packs/">WordPress Buttons</a> <?php _e('and', 'maxgalleria-media-library' ); ?> <a target="_blank" href="http://maxgalleria.com/">MaxGalleria</a></p>						
						    <p class="center-text-no-ital"><?php _e('Click here to', 'maxgalleria-media-library' ); ?> <a href="<?php echo MLF_TS_URL; ?>" target="_blank"><?php _e('Fix Common Problems', 'maxgalleria-media-library'); ?></a></p>
								<p class="center-text-no-ital"><?php _e('Need help? Click here for', 'maxgalleria-media-library' ); ?> <a href="https://wordpress.org/support/plugin/media-library-plus" target="_blank"><?php _e('Awesome Support!', 'maxgalleria-media-library' ); ?></a></p>
								<p class="center-text-no-ital"><?php _e('Or Email Us at', 'maxgalleria-media-library' ); ?> <a href="mailto:support@maxfoundry.com">support@maxfoundry.com</a></p>
							</div>

						</div><!--mgmlp-header-->
                        
						<div class="mlf-clearfix"></div>  
            
			      <div class="tabbed-content">
              
              <ul class='tabs'>
                <li><a href='#tab1'><?php _e('Troubleshooting Tips', 'maxgalleria-media-library' ); ?></a></li>
                <li><a href='#tab2'><?php _e('Troubleshooting Articles', 'maxgalleria-media-library' ); ?></a></li>
                <li><a href='#tab3'><?php _e('System Information</a>', 'maxgalleria-media-library' ); ?></a></li>
              </ul>
              <div style="clear:both"></div>
              
              <div id='tab1'>
                
                <h4><?php _e('Folder Tree Not Loading', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('Users who report this issue can usually fix it by running the Media Library Folders Reset plugin that comes with Media Library Folders.', 'maxgalleria-media-library' ); ?></p>
                <ul>
                  <li><?php _e('1. First make sure you have installed the latest version of Media Library Folders.', 'maxgalleria-media-library' ); ?></li>
                  <li><?php _e('2. Deactivate Media Library Folders and activate Media Library Folders Reset and run the Reset Database option from the Media Library Folders Reset sub menu in the dashboard.', 'maxgalleria-media-library' ); ?></li>
                  <li><?php _e('3. After that, reactivate Media Library Folders. It will do a fresh scan of your media library database and no changes will be made to the files or folders on your site.', 'maxgalleria-media-library' ); ?></li>
                </ul>

                <h4><?php _e('How to Unhide a Hidden Folder', 'maxgalleria-media-library' ); ?></h4>

                <ul>
                  <li><?php _e('1. Go to the hidden folder via your cPanel or FTP and remove the file ‘mlpp-hidden', 'maxgalleria-media-library' ); ?>.</li>
                  <li><?php _e('2. In the Media Library Folders Menu, click the Check for New folders link. This will add the folder back into Media Library Folders.', 'maxgalleria-media-library' ); ?></li>
                  <li><?php _e('3. Visit the unhidden folder in Media Library Folders and click the Sync button to add contents of the folder. Before doing this, check to see that there are no thumbnail images in the current folder since these will be regenerated automatically; these usually have file names such as image-name-150×150.jpg, etc.', 'maxgalleria-media-library' ); ?></li>
                  <li><?php _e('4. Repeat step 3 for each sub folder.', 'maxgalleria-media-library' ); ?></li>
                </ul>
                
                <h4><?php _e('How to Delete a Folder?', 'maxgalleria-media-library' ); ?></h4>
                
                <p><?php _e('To delete a folder, right click (Ctrl-click with Macs) on a folder. A popup menu will appear with the options, ‘Delete this folder?’ and ‘Hide this folder?’. Click the delete option. The folder has to be empty in order to delete it. If you receive a message that the folder is not empty, use the sync function to display files that are still present in the folder.', 'maxgalleria-media-library' ); ?></p`>

                <h4><?php _e('Folders and images added to the site by FTP are not showing up in Media Library Folders', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('Media Library Folders does not work like the file manager on you computer. It only display images and folders that have been added to the Media Library database. To display new folders that have not been added through the Media Library Folders you can click the Check for new folders option in the  Media Library Folders submenu in the Wordpress Dashboard. If you allow Wordpress to store images by year and month folders, then you should click the option once each month to add these auto-generated folders.', 'maxgalleria-media-library' ); ?></p`>

                <p><?php _e('To add images that were upload to the site via the cPanel or by FTP, navigate to the folder containing the images in  Media Library Folders and click the Sync button. This will scan the folder looking images not currently found in the Media Library for that folder. The Sync function only scans the current folder. If there are subfolders, you will need to individually sync them.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Folders Loads Indefinitely', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('This happens when a parent folder is missing from the folder data. To fix this you will need to perform a reset of the Media Library Folders database. To do this, deactivate Media Library Folders and activate Media Library Folders Reset and select the Reset Database option. Once the reset has completed, reactivate Media Library Folders and it will do a fresh scan of the Media Library data.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Unable to Insert files from Media Library Folders into Posts or Pages', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('For inserting images and files into posts and pages you will have to use the existing Media Library. The ability to insert items from the Media Library Folders user interface is only available in', 'maxgalleria-media-library' ); ?> <a href='http://www.maxgalleria.com/downloads/media-library-plus-pro/?utm_source=wordpress&utm_medium=mlfp&utm_content=mlpp&utm_campaign=repo'>Media Library Folders Pro</a>. <?php _e('This does not mean you cannot insert files added to Media Library Folders into any Wordpress posts or pages. Media Library Folders adds a folder user interface and file operations to the existing media library and it does not add a second media library. Since all the images are in the same media library there is no obstacle to inserting them anywhere Wordpress allows media files to be inserted. There is just no folder tree available in the media library insert window for locating images in a particular folder. We chose to include the folder tree for inserting images in posts and page in the Pro version along with other features in order to fund the cost of providing free technical support and continued development of the plugin.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Unable to Update Media Library Folders Reset', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('Media Library Folders Reset is maintenance and diagnostic plugin that is included with Media Library Folders. It automatically updates when Media Library Folders is updated. There is no need to updated it  separately. Users should leave the reset plugin deactivated until it is needed in order to avoid accidentally deleting your site\'s folder data.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Images Not Found After Changing the Location of Uploads Folder', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('If you change the location of the uploads folder, your existing files and images will not be moved to the new location. You will need to delete them from media library and upload them again. Also you will need to perform a reset of the Media Library Folders database. To do this, deactivate Media Library Folders and activate Media Library Folders Reset and select the Reset Database option. Once the reset has completed, reactivate Media Library Folders and it will do a fresh scan of the Media Library data.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Difficulties Uploading or Dragging and Dropping a Large Number of Files', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('Limitations on web server processing time may cause dragging and dropping a large number of files to fail. An error is generated when it takes to longer then 30 seconds to move, copy or upload files. This time limitation can be increased by changing the max_execution_time setting in your site\'s php.ini file.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('How to Delete a Folder?', 'maxgalleria-media-library' ); ?></h4>

                <p><?php _e('To delete a folder, right click (Ctrl-click with Macs) on a folder. A popup menu will appear with the options, \'Delete this folder?\' and \'Hide this folder?\'. Click the delete option.', 'maxgalleria-media-library' ); ?></p>

                <h4><?php _e('Fatal error: Maximum execution time exceeded ', 'maxgalleria-media-library' ); ?></h4>
                
                <p><?php _e('The Maximum execution time error takes place when moving, syncing or uploading too many files at one time. The web site’s server has a setting for how long it can be busy with a task. Depending on your server, size of files and the transmission speed of your internet, you may need to reduce the number of files you upload or move at one time.', 'maxgalleria-media-library' ); ?></p>
                <p><?php _e('It is possible to change the maximum execution time either with a plugin such as <a href=“http://wordpress.org/plugins/wp-maximum-execution-time-exceeded/” target=“_blank”>WP Maximum Execution Time Exceeded</a> or by editing your site’s .htaccess file and adding this line:', 'maxgalleria-media-library' ); ?></p>
                <p><?php _e('php_value max_execution_time 300', 'maxgalleria-media-library' ); ?></p>
                <p><?php _e('Which will raise the maximum execution time to five minutes.', 'maxgalleria-media-library' ); ?></p>

                
              </div>
              
              <div id='tab2'>
                
                <p><a href="https://maxgalleria.com/media-library-plus/" target="_blank">Media Library Folders for Wordpress</a></p>
                <p><a href="https://maxgalleria.com/organized-wordpress-media-library-folders/" target="_blank">Organize your WordPress Media Library</a></p>
                <p><a href="https://maxgalleria.com/wordpress-media-folders-move-rename-delete-folders/" target="_blank">How to Move, Rename, and Delete Files and Folders Using WordPress Media Library Folders</a></p>
                <p><a href="https://maxgalleria.com/add-organize-media-library-folders/" target="_blank">How to Add and Organize Folders in the WordPress Media Library </a></p>
                <p><a href="https://maxgalleria.com/sync-wordpress-media-library-ftp-folders/" target="_blank">How to Sync Your WordPress Media Library With FTP Folders </a></p>
                
              </div>
              
              <div id='tab3'>
            
              <div id="support-info">
                <h4><?php _e('You may be asked to provide the information below to help troubleshoot your issue.', 'maxgalleria-media-library') ?></h4>
                <textarea class="system-info" readonly="readonly" wrap="off">
----- Begin System Info -----

WordPress Version:      <?php echo get_bloginfo('version') . "\n"; ?>
PHP Version:            <?php echo PHP_VERSION . "\n"; ?>
MySQL Version:          <?php 
														global $wpdb;
														$mysql_version = $wpdb->db_version();

														echo $mysql_version . "\n"; 
?>
Web Server:             <?php echo $_SERVER['SERVER_SOFTWARE'] . "\n"; ?>

WordPress URL:          <?php echo get_bloginfo('wpurl') . "\n"; ?>
Home URL:               <?php echo get_bloginfo('url') . "\n"; ?>

PHP cURL Support:       <?php echo (function_exists('curl_init')) ? 'Yes' . "\n" : 'No' . "\n"; ?>
PHP GD Support:         <?php echo (function_exists('gd_info')) ? 'Yes' . "\n" : 'No' . "\n"; ?>
PHP Memory Limit:       <?php echo ini_get('memory_limit') . "\n"; ?>
PHP Post Max Size:      <?php echo ini_get('post_max_size') . "\n"; ?>
PHP Upload Max Size:    <?php echo ini_get('upload_max_filesize') . "\n"; ?>

WP_DEBUG:               <?php echo defined('WP_DEBUG') ? WP_DEBUG ? 'Enabled' . "\n" : 'Disabled' . "\n" : 'Not set' . "\n" ?>
Multi-Site Active:      <?php echo is_multisite() ? 'Yes' . "\n" : 'No' . "\n" ?>

Operating System:       <?php echo $browser['platform'] . "\n"; ?>
Browser:                <?php echo $browser['name'] . ' ' . $browser['version'] . "\n"; ?>
User Agent:             <?php echo $browser['user_agent'] . "\n"; ?>

Active Theme:
- <?php echo $theme->get('Name') ?> <?php echo $theme->get('Version') . "\n"; ?>
  <?php echo $theme->get('ThemeURI') . "\n"; ?>

Active Plugins:
<?php
$plugins = get_plugins();
$active_plugins = get_option('active_plugins', array());

foreach ($plugins as $plugin_path => $plugin) {
	
	// Only show active plugins
	if (in_array($plugin_path, $active_plugins)) {
		echo '- ' . $plugin['Name'] . ' ' . $plugin['Version'] . "\n";
	
		if (isset($plugin['PluginURI'])) {
			echo '  ' . $plugin['PluginURI'] . "\n";
		}
		
		echo "\n";
	}
}
?>
----- End System Info -----
						  </textarea>

							
`              </div>
						  </div><!-- tab3 -->
            </div><!--tabbed-content-->
					</div>    
				</div>    
			</div>    
	<script>
	jQuery(document).ready(function(){
    
    jQuery('ul.tabs').each(function(){
      // For each set of tabs, we want to keep track of
      // which tab is active and its associated content
      var active, content, links = jQuery(this).find('a');

      // If the location.hash matches one of the links, use that as the active tab.
      // If no match is found, use the first link as the initial active tab.
      active = jQuery(links.filter('[href="'+location.hash+'"]')[0] || links[0]);
      active.addClass('active');

      content = jQuery(active[0].hash);

      // Hide the remaining content
      links.not(active).each(function () {
        jQuery(this.hash).hide();
      });

      // Bind the click event handler
      jQuery(this).on('click', 'a', function(e){
        // Make the old tab inactive.
        active.removeClass('active');
        content.hide();

        // Update the variables with the new link and content
        active =  jQuery(this);
        content = jQuery(this.hash);

        // Make the tab active.
        active.addClass('active');
        content.show();

        // Prevent the anchor's default click action
        e.preventDefault();
      });
    });

	});  
  </script>  


		<?php 