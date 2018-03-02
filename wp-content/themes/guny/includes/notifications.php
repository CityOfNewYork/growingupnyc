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
 * Throw exception if timber context isn't set
 */
function timber_context() {
  if (!isset($timberContext)) {
    throw new \Exception('Timber context not set in footer.');
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

/**
 * Override the default Wordpress messages for Banner post types
 * @return array Updated messages
 */
function guny_updated_messages($messages) {
  $messages['banner'] = $messages['post'];
  $messages['banner'][1] = sprintf( __('Banner updated. <a href="%s">Turn alert banner on</a>'), esc_url( add_query_arg( 'page', 'theme-general-settings', get_admin_url() ) ) );
  $messages['banner'][6] = sprintf( __('Banner published. <a href="%s">Turn alert banner on</a>'), esc_url( add_query_arg( 'page', 'theme-general-settings', get_admin_url() ) ) );
  return $messages;
} add_filter( 'post_updated_messages', 'Notifications\\guny_updated_messages' );