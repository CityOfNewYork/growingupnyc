=== Limit Login Attempts Reloaded ===
Contributors: wpchefgadget
Tags: login, security, authentication, Limit Login Attempts, Limit Login Attempts Reloaded, Limit Login Attempts Revamped, Limit Login Attempts Renovated, Limit Login Attempts Updated, Better Limit Login Attempts, Limit Login Attempts Renewed, Limit Login Attempts Upgraded
Requires at least: 2.8
Tested up to: 4.6
Stable tag: 2.1.0

Reloaded version of the original Limit Login Attempts plugin for Login Protection by a team of WordPress developers.

== Description ==

Limit the number of login attempts that possible both through the normal login as well as using the auth cookies.
WordPress by default allows unlimited login attempts either through the login page or by sending special cookies. This allows passwords (or hashes) to be cracked via brute-force relatively easily.
Limit Login Attempts Reloaded blocks an Internet address from making further attempts after a specified limit on retries has been reached, making a brute-force attack difficult or impossible.

Features:

* Limit the number of retry attempts when logging in (per each IP). This is fully customizable.
* Limit the number of attempts to log in using authorization cookies in the same way.
* Informs the user about the remaining retries or lockout time on the login page.
* Optional logging and optional email notification.
* Handles server behind the reverse proxy.
* It is possible to whitelist IPs using a filter. But you probably shouldn't do this.

= Upgrading from the old Limit Login Attempts plugin =
1. Go to the Plugins section in your site's backend.
1. Remove the Limit Login Attempts plugin.
1. Install the Limit Login Attempts Reloaded plugin.

All your settings will be kept in tact!

Many languages are currently supported in Limit Login Attempts Reloaded plugin but we welcome any additional ones.
Help us bring Limit Login Attempts Reloaded to even more cultures.

Translations: Bulgarian, Brazilian Portuguese, Catalan, Chinese (Traditional), Czech, Dutch, Finnish, French, German, Hungarian, Norwegian, Persian, Romanian, Russian, Spanish, Swedish, Turkish

Plugin uses standard actions and filters only.

Based on the original code from Limit Login Attemps plugin by Johan Eenfeldt.

== Screenshots ==

1. Loginscreen after a failed login with remaining retries
2. Lockout loginscreen
3. Administration interface in WordPress 4.5.3

== Changelog ==

= 2.1.0 =
* The site connection settings are now applied automatically and therefore have been removed from the admin interface.
* Now compatible with PHP 5.2 to support some older WP installations.

= 2.0.0 =
* fixed PHP Warning: Illegal offset type in isset or empty https://wordpress.org/support/topic/limit-login-attempts-generating-php-errors
* fixed the deprecated functions issue
https://wordpress.org/support/topic/using-deprecated-function
* Fixed error with function arguments: https://wordpress.org/support/topic/warning-missing-argument-2-5
* added time stamp to unsuccessful tries on the plugin configuration page.
* fixed .po translation files issue.
* code refactoring and optimization.