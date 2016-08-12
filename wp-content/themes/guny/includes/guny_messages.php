<?php
/**
* Override the default Wordpress messages for Banner post types
*/
function guny_updated_messages( $messages ) {
  $messages['banner'] = $messages['post'];
  $messages['banner'][1] = sprintf( __('Banner updated. <a href="%s">Turn alert banner on</a>'), esc_url( add_query_arg( 'page', 'theme-general-settings', get_admin_url() ) ) );
  $messages['banner'][6] = sprintf( __('Banner published. <a href="%s">Turn alert banner on</a>'), esc_url( add_query_arg( 'page', 'theme-general-settings', get_admin_url() ) ) );
  return $messages;
}
add_filter( 'post_updated_messages', 'guny_updated_messages' );
