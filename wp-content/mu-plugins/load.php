<?php
/**
 * Plugin Name: Autoloader
 * Description: The autoloader for 'must use' plugins.
 * Author: NYC Opportunity
 */
namespace MustUsePlugins;

const PLUGINS = [
  '/wp-config/Config.php'
];
for ($i=0; $i < sizeof(PLUGINS); $i++) {
  if (file_exists(WPMU_PLUGIN_DIR . PLUGINS[$i]))
    require WPMU_PLUGIN_DIR . PLUGINS[$i];
}
