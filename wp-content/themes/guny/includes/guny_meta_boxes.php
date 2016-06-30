<?php

/**
* Remove default Age Groups taxonomy box from Ages
*/
function guny_remove_meta() {
  remove_meta_box( 'age_groupdiv', 'age', 'side' );
}
add_action( 'admin_menu', 'guny_remove_meta' );