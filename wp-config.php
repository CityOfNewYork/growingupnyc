<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'guny');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '[~>HXFUxTNmae;++[l&GB#.YW[Kjc__2=/le77s4#LypF(c ~G1Fm]5LT90:1O?B');
define('SECURE_AUTH_KEY',  '^u3[61Z]kj@3s+8@22B1, ld4VoB^t9*IG>+DG@,T52-]_L2YtF{;f@QWq^}Sx_{');
define('LOGGED_IN_KEY',    'Av%7};hYeTRpx*Wts<OxepbH#2ErKJ)FR@&xvW~Vp3YPHapqdb#fflYAWNiI`3*Y');
define('NONCE_KEY',        'ZC/.8#U:Pj_@xwF:f1Bnb1Om(&E`)ZeB`v~A1ph|4yurS9Ba@p*Qj^YrY7DJbjL{');
define('AUTH_SALT',        '?L!U&{V$b/fvyi*6~7J*! U}-67/173!AU[:7Y*.#W zHi)!T{[j;Z>Bg-H[G|qn');
define('SECURE_AUTH_SALT', 'hd.58iaSYpLJyzopjV6:d$X>2x{i+cEdaPFHx_NN&@}?o4l/8omDEX46JUJd2ga^');
define('LOGGED_IN_SALT',   '*|oM(#/hxv1.jmv8O.j^1872$UM(aZ}DN.#<LP!e>$o V~qE2u0Uc m5qEV7MvxQ');
define('NONCE_SALT',       '83-;FOK l}P{AU-_~lsQY$!AVU,^oG-W=-Pq|r~R_ Zmn]%g[-|y{QSvOKfykvE&');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
