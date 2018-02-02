<?php

/**
 * Development environment config
 */

// Disable the google-authenticator plugin for local environments.
require_once(ABSPATH . 'wp-admin/includes/plugin.php');
deactivate_plugins('google-authenticator/google-authenticator.php');