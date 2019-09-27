<?php
/*
Plugin Name:  Post Expiration Date
Plugin URI:   https://developer.wordpress.org/plugins/
Donation Link: https://huguetteinc.com/
Description:  Expires posts at a set date and time.
Version:      1.3
Author:       Huguette Inc.
Author URI:   https://huguetteinc.com/
*/
?>
<?php

// ADD OPTIONS PAGE PHP PAGE STYLE
class DropdownOptionSetting {
    private $hugu_ped_setting_options;

    public function __construct() {
        add_action( 'admin_menu', array( $this, 'hugu_ped_setting_add_plugin_page' ) );
        add_action( 'admin_init', array( $this, 'hugu_ped_setting_page_init' ) );
    }

    public function hugu_ped_setting_add_plugin_page() {
        add_options_page(
            'Post Expiration', // page_title
            'Post Expiration', // menu_title
            'manage_options', // capability
            'hugu_ped_option_setting', // menu_slug
            array( $this, 'hugu_ped_setting_create_admin_page' ) // function
        );
    }
	
//CONSTRUCT THE OPTION PAGE
    public function hugu_ped_setting_create_admin_page() {
        $this->hugu_ped_setting_options = get_option( 'hugu_ped_setting_option_name' ); ?>

        <div class="wrap">
            <h2>Post Expiration Date Settings</h2>
            <p></p>
            <!-- ?php settings_errors(); ? NOT NEEDED -->
            <form method="post" action="options.php">
                <?php
                    settings_fields( 'hugu_ped_setting_option_group' );
                    do_settings_sections( 'hugu_ped-setting-admin' );
                    submit_button();
                ?>
            </form>
			
			<hr>
	
<form action="https://huguetteinc.us19.list-manage.com/subscribe/post?u=5e4a771ae0566de48ad8da160&amp;id=901a41d61b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
						
<h2>Join our mailing list for news and updates</h2>
	
<div id="mc_embed_signup">
    <div id="mc_embed_signup_scroll">
<div class="mc-field-group">
	<label for="mce-EMAIL">Email Address: </label>
	<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
</div>
	<div id="mce-responses" class="clear">
		<div class="response" id="mce-error-response" style="display:none"></div>
		<div class="response" id="mce-success-response" style="display:none"></div>
	</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_5e4a771ae0566de48ad8da160_901a41d61b" tabindex="-1" value=""></div>
    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
    </div>

		
	<p><i>Sign up and you can receive periodic updates about this plugin. We'll never spam you, but we will give you a chance to provide feedback that will play a part in the future of this plugin.</i></p>
	
<p><i><a href="https://huguetteinc.com">Huguette Inc.</a></i></p>

</form>
			</div>
        </div>
    <?php }

    public function hugu_ped_setting_page_init() {
        register_setting(
            'hugu_ped_setting_option_group', // option_group
            'hugu_ped_setting_option_name', // option_name
            array( $this, 'hugu_ped_setting_sanitize' ) // sanitize callback
        );

        add_settings_section(
            'hugu_ped_setting_setting_section', // id
            'Settings', // title
            array( $this, 'hugu_ped_setting_section_info' ), // callback
            'hugu_ped-setting-admin' // page
        );

        add_settings_field(
            'hugu_ped_0', // id
            'DateTime Selector:', // title
            array( $this, 'hugu_ped_0_callback' ), // callback
            'hugu_ped-setting-admin', // page
            'hugu_ped_setting_setting_section' // section
        );
    }

    public function hugu_ped_setting_sanitize($input) {
        $sanitary_values = array();
        if ( isset( $input['hugu_ped_0'] ) ) {
            $sanitary_values['hugu_ped_0'] = $input['hugu_ped_0'];
        }

        return $sanitary_values;
    }

    public function hugu_ped_setting_section_info() {

    }
//BUILD THE DROPDOWN
//OPTION 3 HIDDEN FOR NOW!
    public function hugu_ped_0_callback() {
        ?> <select name="hugu_ped_setting_option_name[hugu_ped_0]" id="hugu_ped_0">
            <?php $selected = (isset( $this->hugu_ped_setting_options['hugu_ped_0'] ) && $this->hugu_ped_setting_options['hugu_ped_0'] === 'option-one') ? 'selected' : '' ; ?>
            <option value="option-one" <?php echo $selected; ?>>Universal</option>
            <?php $selected = (isset( $this->hugu_ped_setting_options['hugu_ped_0'] ) && $this->hugu_ped_setting_options['hugu_ped_0'] === 'option-two') ? 'selected' : '' ; ?>
            <option value="option-two" <?php echo $selected; ?>>Native</option>
            <?php $selected = (isset( $this->hugu_ped_setting_options['hugu_ped_0'] ) && $this->hugu_ped_setting_options['hugu_ped_0'] === 'option-three') ? 'selected' : '' ; ?>
            <option value="option-three" style="display: none;"<?php echo $selected; ?>>Option Three</option>
        </select> <?php
    }

}
if ( is_admin() )
    $hugu_ped_setting = new DropdownOptionSetting();

//
//BACK TO VERIONS <=1.1 STUFF
// INCLUDE TIMEDATE PICKER JQUERY IN ADMIN AREA
function HUGU_include_jquery() {

	wp_register_script('flatpickr', 'https://cdn.jsdelivr.net/npm/flatpickr');
	wp_enqueue_script( 'flatpickr' );

	wp_register_style('flatpickrStyle', 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css', 'all');
	wp_enqueue_style('flatpickrStyle');
}
add_action('admin_head', 'HUGU_include_jquery');

// ADD LINKS ON THE PLUGIN PAGE
function hugu_ped_plugin_action_links($links, $file) {
    $this_plugin = basename(plugin_dir_url(__FILE__)) . '/post-expiration-date.php';
    if($file == $this_plugin) {
        $links[] = '<a href="options-general.php?page=hugu_ped_option_setting">' . __('Settings', 'post-expiration-date') . '</a>';
    }
    return $links;
}
add_filter('plugin_action_links', 'hugu_ped_plugin_action_links', 10, 2);

// ADD THE METABOX TO THE EDIT POSTS PAGE
function hugu_ped_add_expire_date_metabox() {
	//ADD CUSTOM POST TYPES HERE
	$screens = array( 'post', 'page');

    foreach ( $screens as $screen ) {
	add_meta_box( 'hugu_ped_expire_date_metabox', __( 'Expiration Date', 'hugu'), 'hugu_ped_expire_date_metabox_callback', $screen, 'side', 'high' );
}
}
add_action( 'add_meta_boxes', 'hugu_ped_add_expire_date_metabox' );

// THIS IS THE CALLBACK FUNCTION FOR THE METABOX
function hugu_ped_expire_date_metabox_callback( $post ) { ?>
	
	<form action="" method="post">
		
	<?php 		
		// THE NONCE
		wp_nonce_field( 'hugu_ped_expire_date_metabox_nonce', 'hugu_nonce' );
		
		//CHECK FOR METADATA
		$hugu_expire_date = get_post_meta( $post->ID, 'expires', true );
		?>
		
		<label for "hugu_expire_date"><?php __('expire Date', 'hugu' ); ?></label>
	
		<script type="text/javascript">
    jQuery(document).ready(function($){
        $('#HUGUdatetime').flatpickr({
			altInput: true,
			altFormat: "M j, Y @ H:i",
			enableTime: true,
			dateFormat: 'Y-m-d\\TH:i'
		});
		$(".clear_button").click(function() {
    		$('#HUGUdatetime').flatpickr().clear();
			$('#HUGUdatetime').attr('value', '');
  		});
		
    });
</script>
		
<?php
//function dateTimePost(){		
	$dropdown_option = get_option( 'hugu_ped_setting_option_name' ); // Array
	$dropdown_value =  $dropdown_option['hugu_ped_0']; // Option value
			if ($dropdown_value === 'option-two') {
				echo'<input id="date" type="datetime-local" class="MyDate" name="hugu_expire_date" value="' . $hugu_expire_date . '"/>';
			} else {
				echo '<input type="text" id="HUGUdatetime" class="MyDate" name="hugu_expire_date" value="' . $hugu_expire_date . '"/><a class="clear_button hide-if-no-js button-cancel" title="clear" data-clear style="text-decoration:underline;">Clear</a>';
			}	
	?>
	</form>
	
<?php }

// SAVE THE DATETIME FROM THE METABOX
function hugu_ped_save_expire_date_meta( $post_id ) {

// NONCE EXISTS?
	if( !isset( $_POST['hugu_nonce'] ) ||
		!wp_verify_nonce( $_POST['hugu_nonce'],
		'hugu_ped_expire_date_metabox_nonce'
		) ) {
		return;
	}

	// CHECK FOR USER PERMISSION
    if ( !current_user_can( 'edit_post', $post_id ) )
        return;

    if ( !empty( $_POST['hugu_expire_date'] ) ) {
        //CHECK THE FORMAT BEFORE SUBMIT
        if(hugu_ped_validateDate($_POST['hugu_expire_date'])){
        	// if expires time is in the past, set post to draft 
        	// and don't save the date

	    	$expires_epoch = strtotime($_POST['hugu_expire_date']);
       		if($expires_epoch < time()){
				remove_action( 'save_post', 'hugu_ped_save_expire_date_meta' );
				wp_update_post(array(
					'ID' => $post_id,
					'post_status' => 'draft',
				));
	            delete_post_meta( $post_id, 'expires' );
				add_action( 'save_post', 'hugu_ped_save_expire_date_meta' );
	        }
	        else {
		        // FORMAT CORRECT? UPDATE. ELSE CLEAR META DATA
	            update_post_meta( $post_id, 'expires', $_POST['hugu_expire_date']);              	
	        }
        } else {
            delete_post_meta( $post_id, 'expires' );  //If you remove the expiration date in the form, it will remove also from the meta
        }
		} else{
			delete_post_meta($post_id, 'expires');
    }

	
}
add_action( 'save_post', 'hugu_ped_save_expire_date_meta' );

function hugu_ped_validateDate($date)
{
	try {
		$dateTime = new DateTime($date);
	}
	catch(Exception $e){
		return false;
	}
    return $dateTime !== false;
}

function hugu_ped_wpdb_query(){
	// CODE COMPETITION METHOD
	global $wpdb;

	// check if there are expirable posts
	$expirable_posts = $wpdb->get_results("
		SELECT * from {$wpdb->prefix}postmeta
		WHERE {$wpdb->prefix}postmeta.meta_key='expires' AND {$wpdb->prefix}postmeta.meta_value <= NOW()
		");

	if(!empty($expirable_posts)){

		$wpdb->query("
			UPDATE {$wpdb->prefix}posts 
			JOIN {$wpdb->prefix}postmeta
			ON {$wpdb->prefix}postmeta.post_id={$wpdb->prefix}posts.ID 
			SET {$wpdb->prefix}posts.post_status= 'draft' 
			WHERE {$wpdb->prefix}postmeta.meta_key='expires' AND {$wpdb->prefix}postmeta.meta_value <= NOW()
			");

		$wpdb->query("
		    DELETE FROM {$wpdb->prefix}postmeta 
		    WHERE meta_key='expires' AND meta_value < NOW()
		");	
	}

}
add_action( 'wp_loaded', 'hugu_ped_wpdb_query' ); 

// ADD COLUMN TO EDIT.PHP //////////
// CREATE THE COLUMNS
add_filter('manage_posts_columns', 'hugu_ped_my_columns');
function hugu_ped_my_columns($columns) {
    $columns['expires'] = 'Exp. Date';
    return $columns;
}
add_filter('manage_pages_columns', 'hugu_ped_my_pages_columns');
function hugu_ped_my_pages_columns($columnsPage) {
    $columnsPage['expires'] = 'Exp. Date';
    return $columnsPage;
}
//POPULATE THE COLUMNS
add_action('manage_posts_custom_column',  'hugu_ped_my_show_columns');
function hugu_ped_my_show_columns($name) {
    global $post;
    switch ($name) {
        case 'expires':
            $eventDate = get_post_meta( $post->ID, 'expires', true );
            if(!empty($eventDate)){
	            echo date('Y/m/d H:i', strtotime($eventDate));
            }
            else {
            	echo '&mdash;';
            }
    }
}
add_action('manage_pages_custom_column',  'hugu_ped_my_show_pages_columns');
function hugu_ped_my_show_pages_columns($name) {
    global $post;
    switch ($name) {
        case 'expires':
            $eventDateP = get_post_meta( $post->ID, 'expires', true );
            if(!empty($eventDateP)){
	            echo date('Y/m/d H:i', strtotime($eventDateP));
            }
            else {
            	echo '&mdash;';
            }
    }
}
/////////COLUMN CREATION FINISHED///////

if (is_admin()) {
	//register_activation_hook(__FILE__, 'activate_HUGU_easyCDS');
	//register_deactivation_hook(__FILE__, 'deactive_HUGU_easyCDS');
	//add_action('admin_init', 'admin_init_HUGU_easyCDS');
	//add_action('admin_menu', 'admin_menu_hugu_ped');
	//add_action( 'admin_init', 'hugu_ped_register_settings' );
}

?>