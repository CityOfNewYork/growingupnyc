<?php

/**
 * Development environment config
 */

// Disable plugins
require_once ABSPATH . 'wp-admin/includes/plugin.php';
deactivate_plugins('google-authenticator/google-authenticator.php');

// Discourage search engines
// @url https://codex.wordpress.org/Option_Reference#Privacy
update_option('blog_public', 0);
