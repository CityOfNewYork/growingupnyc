<?php

namespace Templating;

/**
 * Loops through an key value pair of query string parameters and validates
 * them against a key value pair of regex patterns.
 * @param  array $query    Key, value pair of parameters.
 * @param  array $patterns Key, value pair of regex patterns.
 * @return array           The validated query, replaces invalid parameters
 *                         with empty strings.
 */
function validate_params($query, $patterns) {
  foreach ($query as $key => $value) {
    $query[$key] = validate_param($key, $value, $patterns);
  }
  return $query;
}

/**
 * Validate a parameter against a key value pair of regex patterns.
 * @param  string $key      The key of the paramter in the key, value pair of parameters
 * @param  string $value    The string to validate, if it's numeric, returns param
 * @param  array  $patterns Key, value pair of regex patterns.
 * @return array            The validated parameter, replaces invalid parameters
 *                          with an empty string.
 */
function validate_param($key, $value, $patterns) {
  if (is_numeric($value)) {
    return $value;
  }
  preg_match($patterns[$key], $value, $matches);
  return (isset($matches[0])) ? $matches[0] : ''; // fail silently
}