<?php

namespace Wpml;

/**
 * Get active languages from the database. This is used in place of WPML's
 * icl_get_languages(...) because that will not retrieve languages for pages
 * without translations.
 * @return [array]   A key value array of language code, english_name, active,
 *                   native_name, tag, and url.
 */
function get_wpdb_languages() {
  try {
    global $wpdb;
    global $wp;
    $array = [];

    // Get languages where they are active
    $active = 1;
    $data = $wpdb -> get_results(
      $wpdb -> prepare("
        SELECT code, english_name, active, tag
        FROM {$wpdb->prefix}icl_languages
        WHERE active = %s", $active)
    );

    // Format data as icl_get_languages would;
    foreach ($data as $key => $value) {
      // Get the native name
      $code = $value->code;
      $native = $wpdb -> get_results(
        $wpdb -> prepare("
          SELECT name
          FROM {$wpdb->prefix}icl_languages_translations
          WHERE language_code = %s AND display_language_code = %s",
            $code, $code
        )
      );

      // Add the code to the path
      $path = ($code !== 'en') ? $code . '/' : '';

      // Rebuild the current url with language code and query parameters
      $url = esc_url(add_query_arg(
        $_GET,
        get_site_url() . '/' . $path . $wp->request
      ));

      // Add the desired data for the language switcher
      $array[$code] = array(
        'native_name' => $native[0]->name,
        'url' => $url
      );

      // Merge the wpdb data with the new array
      $array[$code] = array_merge(
        $array[$code], get_object_vars($value)
      );
    }

    return $array;
  } catch(Exception $e) {
    return false;
  }
}
