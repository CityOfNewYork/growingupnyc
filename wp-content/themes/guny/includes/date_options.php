<?php

/**
 * Formating for the date option custom field
 */

namespace Templating;


/**
 * Constants
 */

// The custom field id, in group_5a97275cbdd84.json
const FIELD_DATE_OPTIONS = 'field_5a9727557ffee';


/**
 * Functions
 */

/**
 * This should be refactored to updated the display for multiple dates
 * that have the same month and year. Currently, for multiple_dates and
 * multiple_date_ranges the dates are just concantenated. So multiple dates
 * display as 'March 16, March 24'. It would be smarter to display
 * it as 'March 16, 24, 2018'. This would require comparing the dates and
 * and only displaying certain parts of the string.
 *
 * Also, this needs to take into consideration translating dates in multiple
 * languages.
 *
 * @param  integer $id        ID of the post if global post is not defined
 * @param  string  $sep       The separator for multiple dates
 * @param  string  $range_sep The date range separator
 * @return string             The dates formatted based on their type
 */
function get_dates($id = null, $sep = ' & ', $range_sep = ' - ') {
  $string = '';
  $option = get_field(FIELD_DATE_OPTIONS, $id);
  $field = get_field($option, $id);
  switch ($option) {
    case 'date_range':
      return get_field('start_date', $id) . $range_sep . get_field('end_date', $id);
      break;
    case 'multiple_dates':
      for ($i = 0; $i < sizeof($field); $i++) {
        $postfix = ((sizeof($field) - 1) == $i) ? '' : $sep;
        $string .= $field[$i]['date'] . $postfix;
      }
      break;
    case 'multiple_date_ranges':
      for ($i = 0; $i < sizeof($field); $i++) {
        $postfix = ((sizeof($field) - 1) == $i) ? '' : $sep;
        $string .= $field[$i]['start_date'] . $range_sep . $field[$i]['end_date'] . $postfix;
      }
      break;
    default:
      return $field;
      break;
  }
  return $string;
}
