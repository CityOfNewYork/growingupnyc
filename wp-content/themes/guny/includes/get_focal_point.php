<?

namespace Templating;

/**
 * Gets the focal point of an image by ID as css background position attribute
 * with percentage units.
 * @param  number $ID - The ID of the image
 * @return string       The background position property with css coor of the
 *                      focal point
 */
function get_focal_point($ID) {
  if (is_array($ID)) return "content: 'Pass the image ID to return focus point';";

  $meta = get_post_meta($ID);

  if (!isset($meta['_wpsmartcrop_image_focus'])) return "content: 'Could not get focal point for image id $ID, it may not be set.';";

  $focus_point = unserialize($meta['_wpsmartcrop_image_focus'][0]);
  $background_position = "content: 'Check includes/get_focal_point. or the Focus Point Plugin';";

  if (isset($focus_point['top'])) {
    $x = $focus_point['top'];
    $y = $focus_point['left'];
    $background_position = "background-position: $x% $y%;";
  }

  return $background_position;
}
