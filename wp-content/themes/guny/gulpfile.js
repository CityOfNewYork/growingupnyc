/**
 * Dependencies
 */
var browserSync = require('browser-sync').create(),
  cache = require('gulp-cache'),
  concat = require('gulp-concat'),
  cssGlobbing = require('gulp-css-globbing'),
  del = require('del'),
  eslint = require('gulp-eslint'),
  gulp = require('gulp'),
  gif = require('gulp-if'),
  imagemin = require('gulp-imagemin'),
  notify = require('gulp-notify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  size = require('gulp-size'),
  stylelint = require('gulp-stylelint'),
  sourcemaps = require('gulp-sourcemaps'),
  svgSprite = require('gulp-svg-sprite'),
  uglify = require('gulp-uglify'),
  tailwind = require('tailwindcss'),
  purgecss = require('@fullhuman/postcss-purgecss'),
  webpack = require('webpack-stream'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano'),
  hashFilename = require('gulp-hash-filename');

/**
 * Variables
 */
var dist = 'assets/',
  source = 'src/',
  patterns = 'node_modules/@nycopportunity/growingup-patterns/src/',
  patternsDist = 'node_modules/@nycopportunity/growingup-patterns/dist/',
  views = 'views/';

/**
 * Styles
 */
gulp.task('styles:lint', function () {
  return gulp.src([
    source + 'scss/**/*.scss'
  ])
    .pipe(stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ],
      syntax: "scss"
    }));
});

gulp.task('styles:clean', (callback) => {
  del([
    './assets/styles/default-*.css',
    './assets/styles/default-*.css.map',
    './assets/styles/style-*.css',
    './assets/styles/style-*.css.map',
    './assets/styles/microsite-*.css',
    './assets/styles/microsite-*.css.map'
  ])
  callback()
});

gulp.task('styles:sass', gulp.series('styles:lint', function () {
  return gulp.src([
    source + 'scss/style-*.scss',
    ])
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({ includePaths:
      [
        'node_modules',
        'node_modules/@nycopportunity/growingup-patterns/src',
        require('bourbon-neat').includePaths,
        require('bourbon').includePaths
      ]
    }))
    .pipe(postcss([
      tailwind(),
      autoprefixer(),
      cssnano(),
      purgecss({
        content: [
          './src/scss/style-gunyc-og.scss', 
          './src/scss/style-microsite.scss', 
          './views/**/*.twig', 
          patterns + '**/*.scss',
          patternsDist + 'scripts/**/*',
          patternsDist + '**/*.html',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
      })
    ]))
    .pipe(hashFilename())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./assets/styles'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
    .pipe(notify({ message: 'Styles task complete' }));
}));

gulp.task('styles', gulp.series('styles:clean', 'styles:sass'))

/**
 * Images
 */
gulp.task('images', function () {
  return gulp.src([source + 'img/**/*', patterns + 'images/**/*'])
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dist + 'img'))
    .pipe(notify({ message: 'Images task complete' }));
});

/**
 * Icons - compile into sprite
 */
gulp.task('icons:sprite', function () {
  return gulp.src(patternsDist + 'svg/icons.svg')
    .pipe(rename('svg-sprite.twig'))
    .pipe(gulp.dest(views + 'partials'));
});

gulp.task('icons:copy', function () {
  return gulp.src(patternsDist + 'svg/*')
    .pipe(gulp.dest(dist + 'svg'));
});

gulp.task('icons', gulp.series('icons:sprite', 'icons:copy'))

/**
 * Scripts
 */
gulp.task('scripts:clean', function (callback) {
  del([
    dist + 'js/source.dev.js',
    dist + 'js/source.js',
    dist + 'js/source-*.js',
    dist + 'js/source-*.min.js'
  ]);
  callback();
});

// lints
gulp.task('scripts:lint', function () {
  return gulp.src([source + 'js/**/*.js', '!' + source + 'js/vendor/*.js'])
    .pipe(eslint({ fix: true }))
    .pipe(gif(!browserSync.active, eslint.failOnError()));
});

// Webpack
gulp.task('scripts:webpack', gulp.series('scripts:lint', function () {
  return gulp.src(source + 'js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(dist + 'js'));
}));

// Scripts
gulp.task('scripts', gulp.series('scripts:clean', 'scripts:webpack', function () {
  return gulp.src([
    source + 'js/vendor/_*.js',
    dist + 'js/bundle.js'
  ])
    .pipe(concat('source.js'))
    .pipe(hashFilename())
    // .pipe(uglify())
    .pipe(size({ showFiles: true }))
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.stream({ match: '**/*.js' }))
    .pipe(notify({ message: 'Scripts task complete' }))
}));

/**
 * WATCH
 */
gulp.task('default', function () {

  browserSync.init({
    proxy: 'http://localhost:8080',
    port: 3001,
    ghostMode: {
      scroll: true
    },
    open: false
  });

  gulp.watch(source + 'scss/**/*', gulp.series('styles'));

  gulp.watch(source + 'js/**/*.js', gulp.series('scripts'));

  gulp.watch(source + 'img/**/*', gulp.series('images'));

  gulp.watch(source + 'icons/*.svg', gulp.series('icons'));

  // Watch templates, JS, and CSS, reload on change
  gulp.watch([
    'guny/**/*',
  ], { dot: true })
    .on('change', browserSync.reload);
});

gulp.task('build',
  gulp.series(
    'styles',
    'scripts',
    'images',
    'icons'
));