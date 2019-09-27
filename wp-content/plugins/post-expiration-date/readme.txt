=== Post Expiration Date ===
Contributors: huguetteinc, expireposts
Donate link: https://huguetteinc.com/
Tags: expiration, expire, expiry, post, schedule, hide
Requires at least: 3.0.1
Tested up to: 5.0
Requires PHP: 5.2.4
Stable tag: trunk
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

This is a simple plugin designed to make Wordpress posts expire at a scheduled time and date. You just set the time, set the date, and a post will hide at the point you schedule.  

== Description ==

This is a free, lightweight plugin designed to make Wordpress posts expire at a set time, on a given date. This was done in the simplest, most expedient manner possible so conflicts should be minimal. Dependencies are minimal as well. WP Cron is not used or required. You can choose from a JQuery datetime picker or the browser's native option.

How it works: You can set an expiration date (an expiry) for a post by selecting the date and time. This uses local time, not GMT, UTC, etc. When the expiration date and time have been passed the post will be moved from Published to Draft status. Picking a date/time is optional -- not all posts require an expiry.

Post Expiration Date plugin is ideal for use with coupons, deals, sales, and any other events where would would want the corresponding Wordpress post to be hidden (or in some way changed) at a scheduled time. 

== Installation ==

1. Upload `Post Expiration Date` to the `/wp-content/plugins/` directory
1. Activate through the 'Plugins' menu in WordPress
1. Review the "Post Expiration" options in Wordpress' Settings tab

== Frequently Asked Questions ==

= What date-time format is the expiration date stored in?
February 2, 2019 1:01 AM will be stored as "2019-02-02T01:01" in your postmeta table.

= Why does the date/time formatted like that?
We opted to use the ISO 8601 standard for date and time format. This can be manipulated if you'd like to view it in other ways, as we do in the "Exp. Date" column of the Posts page.

= My date-time entry text box is blank! What do I do?
This is because your browser does not support input type="datetime-local". If this happens to you please use the settings to change to the "Universal" picker or use Chrome for your browser. Newer verions of this plugin (v1.2 and above) fix this issue and give you the option for different datetime pickers.

== Screenshots ==

1. `/assets/screenshot-1.png`
1. `/assets/screenshot-2.png`
1. `/assets/screenshot-3.png`

== Upgrade Notice ==

= v1.3 =

* You can now expire Wordpress Pages with the Post Expirate Date plugin!

= v1.2 =

* Please check out the options page at Settings > Post Expiration

== Changelog ==

= v1.3 = 

* Added ability to expire Pages
* Added Settings link to Plugin page

= v1.2 =

* Added Settings page
* Option to choose between native and universal input types.
* Fix bug where datetime could not be removed from database
* Added clear button for Universal datetime picker

= 1.1.0 =

* Add datetime picker support for all browsers. 
* Cleaned up the 

= 1.0.0 =

* Released!