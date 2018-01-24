<?php

/**
 * Storage for all site related notifications such as missing dependencies, etc.
 */

namespace Notifications;


/**
 * Notify admin to activate Timber if it has not been activated.
 * @return null
 */
function timber() {
  if (!class_exists('Timber')) {
    add_action('admin_notices', function() {
      echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
    });
    return;
  }
}

/**
 * Notify admin to activate custom post types.
 * @return null
 */
function custom_post_types() {
  if (!class_exists('GUPostTypes')) {
    add_action('admin_notices', function() {
      echo '<div class="error"><p>GUPostTypes not activated. Make sure you activate the plugin in <a href="' . esc_url(admin_url('plugins.php#growing-up-nyc-post-types')) . '">' . esc_url(admin_url('plugins.php')) . '</a></p></div>';
    });
    return;
  }
}