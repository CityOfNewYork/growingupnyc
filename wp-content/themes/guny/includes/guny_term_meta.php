<?php
/**
* Add custom meta field to taxonomies
*/

/**
* Add 'Include in Age/Milestone Picker' field to new Age Group terms
*/
function guny_add_age_picker_field() {
  ?><div class="form-field term-include_in_age_picker-wrap">
    <label>
      <input type="checkbox" id="include_in_age_picker" name="include_in_age_picker" value="1" checked>
      Include in age/milestone picker?
    </label>
    <p>If selected, the age group will be included in the age/milestone picker on the homepage and in the ages nav.
      If unchecked, the age group will only be available as a programs filter.</p>
  </div><?php
}
add_action( 'age_group_add_form_fields', 'guny_add_age_picker_field' );

/**
* Add 'Include in Age/Milestone Picker' field to Age Group term edit screens
*
* @param {object} $term - The term object
*/
function guny_edit_age_picker_field( $term ) {
  $is_included = get_term_meta( $term->term_id, 'include-in-age-picker', true );
  ?><tr class="form-field term-group-wrap">
    <th scope="row"></th>
    <td><label>
      <input type="checkbox" id="include_in_age_picker" name="include_in_age_picker" value="1"<?php if ($is_included) { echo ' checked'; }?>>
      Include in age/milestone picker?
    </label>
    <p>If selected, the age group will be included in the age/milestone picker on the homepage and in the ages nav.
      If unchecked, the age group will only be available as a programs filter.</p></td>
  </tr><?php
}
add_action( 'age_group_edit_form_fields', 'guny_edit_age_picker_field' );

/**
* Save 'Include in Age/Milestone Picker' field when term created
*/
function guny_save_age_picker_field( $term_id ) {
  $include = false;
  if ( isset( $_POST['include_in_age_picker'] ) ) {
    $include = boolval($_POST['include_in_age_picker']);
  }
  add_term_meta( $term_id, 'include-in-age-picker', $include, true );
}
add_action( 'created_age_group', 'guny_save_age_picker_field' );

/**
* Update 'Include in Age/Milestone Picker' when existing term saved
*/
function guny_update_age_picker_field( $term_id ) {
  $include = false;
  if ( isset( $_POST['include_in_age_picker'] ) ) {
    $include = boolval($_POST['include_in_age_picker']);
  }
  update_term_meta( $term_id, 'include-in-age-picker', $include, '' );
}
add_action( 'edited_age_group', 'guny_update_age_picker_field' );
