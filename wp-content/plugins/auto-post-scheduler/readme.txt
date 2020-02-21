=== Auto Post Scheduler ===
Contributors: johnh10
Plugin Name: Auto Post Scheduler
Plugin URI: http://www.superblogme.com/auto-post-scheduler/
Donate Link: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=W4W9RA2Q6TAGQ
Tags: schedule post, schedule, auto post, draft, pending, publish, scheduling, posts, queue, post scheduler, automate posts, queue posts, auto publish, post
Requires at least: 3.0
Tested up to: 5.2.1
Stable Tag: 1.82
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This plugin will schedule 'auto post checks' to publish new posts and/or recycle old posts automatically.


== Description ==

Use the Auto Post Scheduler to publish new posts and/or recycle old posts, automatically! No need to schedule post times individually, and recycling old posts keeps your site looking fresh. 

Especially useful when importing a large number of posts, you can 
have the Auto Post Scheduler publish them at whatever frequency you choose.

Works great with the auto blogging plugin <http://videoblogsterpro.com>

Pro version [WP Auto Poster](https://codecanyon.net/item/wp-auto-poster/23805990?ref=johnh10) completely rewritten to be easier to use, with more features, unlimited rulesets, and premium support.

== Installation ==

1. Install the plugin through WordPress admin or upload the `Auto Post
Scheduler` directory to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Visit `Settings -> Auto Post Scheduler` to set options and Enable the scheduler.


== Frequently Asked Questions ==

= Why don't the auto post checks trigger? Nothing is happening. =

1. Auto Post Scheduler hooks into the WordPress WP-Cron for scheduling. These cron events are typically only checked when a visitor loads any WordPress page on the site. If there are no visitors, there can be no cron checks and therefore no site. If there are no visitors, there can be no cron checks and therefore no
auto post checks.

2. If you are using .htaccess to allow,deny by IP, make sure to allow the IP of your WordPress site itself as the wp-cron uses that IP address.

= Error: aps_auto_hook not scheduled, likely another plugin misuse of cron_schedules =

This happens when another plugin incorrectly replaces cron_schedules with their own schedules instead of correctly adding to existing schedules, so the other plugin actually removes our aps_auto_hook. Other plugin code needs to be fixed.

= How do I turn off WP_Cron and use server cron jobs instead? =

WordPress calls WP_Cron on every page load to check for cron_schedules. If you have a high traffic site, you might want to use caching or set cron checks on a schedule instead to save on resources. See [this post](http://www.superblogme.com/wordpress-calling-wp-cron-vs-cron-job-calling-wp-cron/) for more information.

To do this:

1. Make sure Auto Post Scheduler is enabled.
2. Edit /wp-config.php and add the line
`define('DISABLE_WP_CRON', true);`
3. From the server command line, edit your cron with 'crontab -e' and add the line
`*/5 * * * * wget -q -O -"http://www.mydomain.com/wp-cron.php?doing_wp_cron='date +\%s'" > /dev/null2>&1`

and change 'mydomain' to your site domain.

This crontab entry will call wp_cron every 5 minutes.

= When using WP Super Cache the Home/Front page isn't updated when APS publishes a post or recycles an old post. Why is that? =

As far as I know, WP Super Cache must not hook into when a post status has changed. User MassimoD reports "Quick Cache does, W3Total Cache does, Hyper Cache does, Gator Cache does. Only WP Super Cache doesn't."


= Does this plugin have any callable filters? =

Yes! In case you think of something that is not covered in the plugin settings, here are the available filter hooks:

* <strong>aps_eligible_query</strong> - passed value is the array that will be used by WP_Query to find eligible posts. Any changes will also apply to aps_recycle_query as well.
* <strong>aps_recycle_query</strong> - passed value is the array that will be used by WP_Query to find recyclable posts if there are no eligible posts found.
* <strong>aps_update_post</strong> - passed value is the array that will be used by wp_update_post when publishing a draft or pending post.
* <strong>aps_recycle_post</strong> - passed value is the array that will be used by wp_update_post when recycling a published post.

Example Usage #1: I only want to publish or recycle posts that have the tag 'featured'.

Add this code snippet to your theme's functions.php file or equivalent.

`function my_aps_eligible_change($args) {
        $args['tag'] = 'featured';
        return $args;
}
add_filter( 'aps_eligible_query', 'my_aps_eligible_change' );`


Example Usage #2: I want to add a post meta field when a post has been recycled.

Add this code snippet to your theme's functions.php file or equivalent.

`function my_aps_recycle_post($args) {
        $postID = $args['ID'];
        add_post_meta( $postID, 'aps_recycled', 1, true ) || update_post_meta( $postID, 'aps_recycled', 1 );
        return $args;
}
add_filter( 'aps_recycle_post', 'my_aps_recycle_post' );`


= I'm a little confused between Eligible Posts and Recycle Mode. Can you elaborate how it works? =

Hopefully this table will help. Hopefully.

`
Eligible Posts?    Pick Random?    Recycle Posts?  RESULTS over multiple auto post checks

drafts             no              no              drafts ordered by date and published. 
                                                   if no drafts nothing happens.

drafts             yes             no              drafts picked randomly and published. 
                                                   if no drafts nothing happens.

drafts             no              yes             drafts ordered by date and published. 
                                                   if no drafts then published posts ordered by date and recycled.

drafts             yes             yes             drafts ordered randomly and published. 
                                                   if no drafts then published posts ordered by date and recycled.

drafts, publish    no              no              drafts and published posts are ordered by date and either published or recycled.

drafts, publish    yes             no              drafts and published posts are ordered randomly and either published or recycled.

drafts, publish    no              yes             drafts and published posts are ordered by date and either published or recycled. 
                                                   Recycle Posts does not apply since there are always eligible posts.

drafts, publish    yes             yes             drafts and published posts are ordered randomly and either published or recycled. 
                                                   Recycle Posts does not apply since there are always eligible posts.
`


== Screenshots ==

1. The admin options.


== Changelog ==

= 1.82

* Message tweak when more than 1 schedule event detected for APS.
* Note on rewritten Pro version.

= 1.81

* Check max log size when APS triggered, not just when settings page loaded.
* Extra check for WP_Query number of results.

= 1.80

* Added option to limit checks to posts by keyword search.
* Added option to limit checks to posts from certain Authors.
* Added option to set special case recycling to 'On This Day in History'.
* Bugfix - don't check for restart when a published post is edited.
* Bugfix - stop echoing log message to screen when manually publishing a post and 'Restart on Publish?' is checked.
* Bugfix - don't check for eligible posts if no eligible post statuses are checked.

= 1.70

* Log File replaced with rolling Log Messages in database.
* Added select box for post types.
* Added select box for categories. If you used negative category IDs before, please redo selection.
* Extra checks for valid 24-hour format in Limit certain Days.
* Added 'Recycle Posts as New?' option to trigger any publish hooks.
* Combined aps_restart_event and aps_schedule_event.
* Added more DEBUG messages.
* Added check for wp_update_post error from WordPress.
* Expanded aps_updating toggle range, added update_option fail check.
* Bugfix - APS checks 'Restart on Publish?' option only when Enabled.


= 1.63 =

* Added filters for the queries and the updates (see FAQ). Requested by [policieuxjp](https://wordpress.org/support/topic/feature-request-duplicate-instead-of-republish)
* Added option to restart the scheduler if a post is published outside of APS. Requested by [brigcam](https://wordpress.org/support/topic/minimum-delay-to-wait-after-last-post)
* Added option to set max number of posts per day.
* Added option for the scheduler to exclude certain dates. Requested by [rbergeron81](https://wordpress.org/support/topic/exclude-specific-dates), [policieuxjp](https://wordpress.org/support/topic/feature-request-exclude-list-of-dates)
* Added DEBUG mode to display extra information to logfile.
* Changed default WP_Query to ignore sticky posts.
* Added ability to mix Eligible Post Statuses option with Minimum Recycle Age option. Requested by [hjakhrw3](https://wordpress.org/support/topic/minimum-recycle-age-not-working-with-publish-eligible-post-status)

= 1.62 =

* Removed debug line that dumped schedules to log file.
* Fixed bug added in 1.61 that prevented posts from being published. sorry about that.

= 1.61 =

* If limit day is set to 0 no posts will be published that day.

= 1.60 = 

* SVN version change only. WP was using v1.5 instead of 1.50 so no updates.


= 1.50 = 

* Will detect missing aps_auto_post_hook event and re-add if somehow removed by another plugin.
* Added i18n support. Google Translation for: Spanish.
* Changed priority of 'cron_schedules' add_filter call to 99.
* If no 'Eligible Post Statuses?' selected, default is 'publish'.

= 1.41 = 

* Bugfix: Limit by category: WP_Query function uses 'cat' arg instead of 'category'

= 1.4 = 

* Added feature: Option to also handle posts in Pending and Publish status.
* Added feature: Support for a time range in Auto Post Schedule field. i.e. 2-6 hours.
* Added feature: Detect if another plugin removed cron_schedules.
* Updated feature: No longer restarts if settings are updated when Scheduler is Enabled.
* Updated feature: Expanded 'Limit Certain Day(s)' to allow different limits for each day.
* Updated feature: Time display on settings page and log file to use same 24h format.
* Updated feature: Log messages detail post type.
* Updated feature: Added Minimum Recycle Age for recycling posts.
* Internal change: Use WP_Query instead of get_posts for more arg options.
* Internal change: Moved inline css to css file.
* Internal change: Use primary buttons instead of custom.
* Internal change: Easier log file display code.
* Internal change: Easier way to retrieve 'Next auto post check' time.

= 1.3 =

* Will now set post time based on the timezone in Settings->General. Default UTC.
* Added ability to limit post checks to certain days of the week and time ranges.


= 1.2 =

* Minor cosmetic changes on options page.
* Added quick link buttons to support/review/donations on options page.
* Added security check for current_user_can() to manage options.


= 1.1 =

* Added support for custom post types.
* Bypass kses filter check during wp_update_post() to avoid WordPress
* automatically stripping embed codes such as Youtube iframes.
* Added 'Settings' shortcut link under Admin->Plugins->Auto Post Scheduler


= 1.0 =

* Initial Release


== Upgrade Notice ==

= none =


