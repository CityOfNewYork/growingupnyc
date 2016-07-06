// WordPress Starterkit Gulpfile
// (c) Blue State Digital

// TASKS
// ------
// `gulp`: watch, compile styles and scripts; Browserify
// `gulp build`: default compile task


// PLUGINS
// --------
var autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    chug = require('gulp-chug'),
    concat = require('gulp-concat'),
    cssGlobbing = require('gulp-css-globbing'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    minifycss = require('gulp-clean-css'),
    notify = require('gulp-notify'),
    p = require('./package.json'),
    path = require('path'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    styleguide = require('sc5-styleguide'),
    stylelint = require('gulp-stylelint'),
    sourcemaps = require('gulp-sourcemaps'),
    sourcestream = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack-stream');


// VARIABLES
// ----------
var dist = 'assets/',
    appRoot = '/wp-content/themes/guny/assets/',
    source = 'src/',
    sassInclude = ['node_modules', require('bourbon-neat').includePaths];


// ERROR HANDLING
// ---------------
function handleError() {
    this.emit('end');
}

// BUILD SUBTASKS
// ---------------

// Style Linter
gulp.task('lint-css', function(){
  return gulp.src([
    source + 'scss/**/*.scss'
  ])
  .pipe(stylelint({
    reporters: [
      {formatter: 'string', console: true}
    ],
    syntax: "scss"
  }));
});

// Styles
gulp.task('styles_dev', ['lint-css'], function() {
    return gulp.src([
      source+'scss/style.scss'
    ])
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({includePaths: sassInclude}))
        .on('error', handleError)
        .on('error', notify.onError())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifycss())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('styles', ['lint-css'], function() {
    return gulp.src([
        source+'scss/style.scss'
    ])
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass({includePaths: sassInclude}))
        .on('error', handleError)
        .on('error', notify.onError())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(minifycss())
    .pipe(gulp.dest('./'));
});


// Script Linter
gulp.task('lint', function() {
  return gulp.src([source + 'js/**/*.js', '!' + source + 'js/vendor/*.js'])
    .pipe(eslint())
    .pipe(gif(!browserSync.active, eslint.failOnError()));
});

// Webpack
gulp.task('pack', ['lint'], function() {
  return gulp.src(source+'js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(dist+'js'));
});


// Scripts
gulp.task('scripts', ['pack'], function() {
  return gulp.src([
      source+'js/vendor/_*.js',
      dist+'js/bundle.js'
  ])
  .pipe(concat('source.dev.js'))
  .pipe(gulp.dest(dist+'js'))
  .pipe(rename('source.js'))
  .pipe(uglify())
  .pipe(gulp.dest(dist+'js'))
  .pipe(browserSync.stream({match: '**/*.js'}));
});


// Clean
gulp.task('clean', function(cb) {
    del([dist+'js/bundle.js', dist+'js/source.dev.js', dist+'js/source.js'], cb);
});


// Images
gulp.task('images', function() {
  return gulp.src(source+'img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist+'img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Generate Styleguide
gulp.task('styleguide:generate', function() {
  return gulp.src([source + 'scss/_*.scss'])
    .pipe(styleguide.generate({
      title: 'Styleguide',
      rootPath: dist + 'styleguide',
      appRoot: appRoot + 'styleguide',
      overviewPath: 'styleguide-overview.md',
      extraHead: ''
    }))
    .pipe(gulp.dest(dist + 'styleguide'))
});

// Apply styles to styleguide
gulp.task('styleguide:applystyles', function() {
  return gulp.src(source + 'scss/style.scss')
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass({includePaths: sassInclude}))
      .on('error', handleError)
      .on('error', notify.onError())
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(dist + 'styleguide'))
});


// BUILD TASKS
// ------------

// Build styleguide
gulp.task('styleguide', ['styleguide:generate', 'styleguide:applystyles']);

// Watch
gulp.task('default', function() {

    browserSync.init({
      proxy: 'http://guny.wp.local',
      port:3001,
      ghostMode: {
          scroll: true
      },
      open:false
    });

    // Watch .scss files
    gulp.watch(source+'scss/**/*.scss', ['styles_dev', 'styleguide']);

    // Watch .js files
    gulp.watch(source+'js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch(source+'img/**/*', ['images']);

    // Watch templates, JS, and CSS, reload on change
    gulp.watch([
            'guny/**/*',
        ], { dot: true })
        .on('change', browserSync.reload);
});

// Build
gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts', 'styleguide');
});
