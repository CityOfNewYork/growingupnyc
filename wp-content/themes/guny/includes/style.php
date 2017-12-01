<?

namespace Enqueue;

/**
 * Enqueue a hashed style based on it's name.
 * @param  [string] $name - the name of the stylesheet source
 * @return null
 */
function style($name = 'style') {
  $dir = get_template_directory();

  $files = array_filter(scandir($dir), function($var) use ($name) {
    return (strpos($var, "$name-") !== false);
  });

  $hash = str_replace(array("$name-", '.css'), '', array_values($files)[0]);
  $uri = get_template_directory_uri();
  wp_enqueue_style($name, "$uri/$name-$hash.css", array(), null, 'all');
}
