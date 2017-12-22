<?

namespace Enqueue;

/**
 * Enqueue a hashed script based on it's name.
 * Enqueue the minified version based on debug mode.
 * @param  [string] $name the name of the script source
 * @return null
 */
function script($name = 'main') {
  $dir = get_template_directory();

  $files = array_filter(scandir("$dir/assets/js/"), function($var) use ($name) {
    return (strpos($var, "$name-") !== false);
  });

  $hash = str_replace(array("$name-", '.js'), '', array_values($files)[0]);
  $min = isset($_GET['debug']) ? '' : '.min';
  $uri = get_template_directory_uri();
  wp_enqueue_script($name, "$uri/assets/js/$name-$hash$min.js", array(), null, true);
}
