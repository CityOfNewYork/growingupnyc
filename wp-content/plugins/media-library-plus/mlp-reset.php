<?php
/*
Plugin Name: Media Library Folders for WordPress Reset
Plugin URI: http://maxgalleria.com
Description: Plugin for reseting WordPress Media Library Folders
Author: Max Foundry
Author URI: http://maxfoundry.com
Version: 4.2.6
Copyright 2015 Max Foundry, LLC (http://maxfoundry.com)

*/

if(!defined("MAXGALLERIA_MEDIA_LIBRARY_FOLDER_TABLE"))
  define("MAXGALLERIA_MEDIA_LIBRARY_FOLDER_TABLE", "mgmlp_folders");

function mlp_reset_menu() {
  add_menu_page('Media Library Folders Reset', 'Media Library Folders Reset', 'manage_options', 'mlp-reset', 'mlp_reset' );
  add_submenu_page('mlp-reset', 'Display Attachment URLs', 'Display Attachment URLs', 'manage_options', 'mlpr-show-attachments', 'mlpr_show_attachments');
  add_submenu_page('mlp-reset', 'Display Folder Data', 'Display Folder Data', 'manage_options', 'mlpr-show-folders', 'mlpr_show_folders');
  add_submenu_page('mlp-reset', 'Reset Database', 'Reset Database', 'manage_options', 'clean_database', 'clean_database');
}
add_action('admin_menu', 'mlp_reset_menu');

function mlp_reset() {

	echo "<h3>WordPress Media Library Folders Reset Instructions</h3>";
  echo "<h4>If you need to rescan your database, please deactivate the WordPress Media Library Folders plugin and then click WordPress Media Library Folders Reset->Reset Database to erase the folder data. Then deactivate WordPress Media Library Folders Reset and reactivate WordPress Media Library Folders which will perform a fresh scan of your database.</h4>";
  
}

function clean_database() {  
    global $wpdb;
    
    $sql = "delete from $wpdb->prefix" . "options where option_name = 'mgmlp_upload_folder_name'";
    $wpdb->query($sql);
    
    $sql = "delete from $wpdb->prefix" . "options where option_name = 'mgmlp_upload_folder_id'";
    $wpdb->query($sql);
		
    $sql = "delete from $wpdb->prefix" . "options where option_name = 'mgmlp_database_checked'";
    $wpdb->query($sql);
		
    $sql = "delete from $wpdb->prefix" . "options where option_name = 'mgmlp_postmeta_updated'";
    $wpdb->query($sql);
				        
    echo "Deleteing mgmlp_folders<br>";
    
    $sql = "TRUNCATE TABLE $wpdb->prefix" . "mgmlp_folders";
    $wpdb->query($sql);
    
    $sql = "DROP TABLE $wpdb->prefix" . "mgmlp_folders";    
    $wpdb->query($sql);
		
    $sql = "select ID from {$wpdb->prefix}posts where post_type = 'mgmlp_media_folder'";
		
    $rows = $wpdb->get_results($sql);
		if($rows) {
      foreach($rows as $row) {
				delete_post_meta($row->ID, '_wp_attached_file');				
			}
		}
				    
    echo "Removing mgmlp_media_folder posts<br>";
    $sql = "delete from $wpdb->prefix" . "posts where post_type = 'mgmlp_media_folder'";
    $wpdb->query($sql);
    
    echo "Done. You can now reactivate WordPress Media Library Folders.<br>";
  
}

function mlpr_show_attachments () {
  global $wpdb;
  
  $sql = "select count(*) from {$wpdb->prefix}posts where post_type = 'attachment' ";
  
  $count = $wpdb->get_var($sql);  
		
  $uploads_path = wp_upload_dir();
  //$sql = "select ID, guid from $wpdb->prefix" . "posts where post_type = 'attachment' order by ID";
	
  $sql = "SELECT ID, pm.meta_value as attached_file, folder_id
FROM {$wpdb->prefix}posts
LEFT JOIN {$wpdb->prefix}postmeta AS pm ON pm.post_id = {$wpdb->prefix}posts.ID
LEFT JOIN {$wpdb->prefix}mgmlp_folders ON ({$wpdb->prefix}posts.ID = {$wpdb->prefix}mgmlp_folders.post_id)
WHERE post_type = 'attachment' 
AND pm.meta_key = '_wp_attached_file'
ORDER by folder_id";
	
  //echo $sql;
	
	echo "<h2>Attachment URLs</h2>";

  echo "<p>Number of attachments: $count</p>";

  $rows = $wpdb->get_results($sql);
	?>
	<table>
		<tr>
			<th>Attachment ID</th>
			<th>Attachment URL</th>
			<th>Folder ID</th>
		</tr>	
    
  <?php  
  
  foreach($rows as $row) {
		$image_location = $uploads_path['baseurl'] . "/" . $row->attached_file;
	  ?>
		<tr>
			<td><?php echo $row->ID; ?></td>	
			<td><?php echo $image_location; ?></td>	
			<td><?php echo $row->folder_id; ?></td>	
		</tr>
    <?php				
  }    
	?>
	</table>
  <?php
}

function mlpr_show_folders() {
  global $wpdb;
	
  $sql = "select count(*) from {$wpdb->prefix}posts where post_type = 'mgmlp_media_folder' ";
  
  $count = $wpdb->get_var($sql);    
	
	echo "<h2>Folder URLs</h2>";
  
  $upload_dir = wp_upload_dir();  
  
  $upload_dir1 = $upload_dir['basedir'];
  
  echo "Uploads folder: " . $upload_dir1 . "<br>";
        
  echo "Uploads URL " . $upload_dir['baseurl'] . "<br>";
  
  echo "Number of folders: $count<br><br>";

  $folder_table = $wpdb->prefix . MAXGALLERIA_MEDIA_LIBRARY_FOLDER_TABLE;
            	
  $sql = "select distinct ID, post_title, $folder_table.folder_id, pm.meta_value as attached_file
from $wpdb->prefix" . "posts
LEFT JOIN $folder_table ON ($wpdb->prefix" . "posts.ID = $folder_table.post_id)
LEFT JOIN {$wpdb->prefix}postmeta AS pm ON pm.post_id = {$wpdb->prefix}posts.ID
where post_type = 'mgmlp_media_folder' 
order by ID";
	
  //echo $sql . "<br>";
	  
  $rows = $wpdb->get_results($sql);
	
	?>
	<table>
		<tr>
			<th>Folder ID</th>
			<th>Folder Name</th>
			<th>Folder URL</th>
			<th>Parent ID</th>
		</tr>	
    
  <?php  
  foreach($rows as $row) {
		$image_location = $upload_dir['baseurl'] . "/" . $row->attached_file;
	  ?>
		<tr>
			<td><?php echo $row->ID; ?></td>	
			<td><?php echo $row->post_title; ?></td>	
			<td><?php echo $image_location; ?></td>	
			<td><?php echo $row->folder_id; ?></td>	
		</tr>
    <?php		
  }	
	?>
	</table>
  <br><br>
  <?php
	
  echo "<br><br>$folder_table<br><br>";
  
  $sql = "select distinct post_id, folder_id from $folder_table order by post_id";
  
  $rows = $wpdb->get_results($sql);
  
  foreach($rows as $row) {
    echo "$row->post_id $row->folder_id<br>";
  }
  		  
}

