<?php

// uninstall file for Auto Post Scheduler

if( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) 
	exit();

        delete_option('aps_enabled');
        delete_option('aps_next');
        delete_option('aps_next_time');
        delete_option('aps_start_delay');
        delete_option('aps_delay_time');
        delete_option('aps_cats');
        delete_option('aps_authors');
        delete_option('aps_keyword_search');
        delete_option('aps_drafts');
        delete_option('aps_pending');
        delete_option('aps_publish');
        delete_option('aps_random');
        delete_option('aps_recycle');
        delete_option('aps_recycle_min');
        delete_option('aps_recycle_min_time');
        delete_option('aps_recycle_onthisday');
        delete_option('aps_batch');
        delete_option('aps_logfile');	// deprecated
        delete_option('aps_post_types');
        delete_option('aps_days');	// deprecated
        delete_option('aps_hours');	// deprecated
        delete_option('aps_hours_mon');
        delete_option('aps_hours_tue');
        delete_option('aps_hours_wed');
        delete_option('aps_hours_thu');
        delete_option('aps_hours_fri');
        delete_option('aps_hours_sat');
        delete_option('aps_hours_sun');
        delete_option('aps_debug');
        delete_option('aps_excludes');
        delete_option('aps_max_per_day');
        delete_option('aps_num_day');
        delete_option('aps_restart');
        delete_option('aps_updating');
        delete_option('aps_db_version');
        delete_option('aps_max_log');

        //drop custom db table
        global $wpdb;
        $wpdb->query( "DROP TABLE IF EXISTS {$wpdb->prefix}" . "aps_log" );
?>
