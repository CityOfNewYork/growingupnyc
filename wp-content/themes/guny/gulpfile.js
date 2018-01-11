// WordPress Starterkit Gulpfile
// (c) Blue State Digital

// TASKS
// ------
// `gulp`: watch, compile styles and scripts; Browserify
// `gulp build`: default compile task


// PLUGINS
// --------
var browserSync = require('browser-sync').create(),
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
    modernizr = require('gulp-modernizr'),
    notify = require('gulp-notify'),
    p = require('./package.json'),
    path = require('path'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    size = require('gulp-size'),
    styleguide = require('sc5-styleguide'),
    stylelint = require('gulp-stylelint'),
    sourcemaps = require('gulp-sourcemaps'),
    sourcestream = require('vinyl-source-stream'),
    svgSprite = require('gulp-svg-sprite'),
    uglify = require('gulp-uglify'),
    webpack = require('webpack-stream');
    rtlcss = require('gulp-rtlcss'),
    jsonToSass = require('gulp-json-to-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    hashFilename = require('gulp-hash-filename');


// VARIABLES
// ----------
var dist = 'assets/',
    appRoot = '/wp-content/themes/guny/assets/',
    source = 'src/',
    views = 'views/',
    sassInclude = ['node_modules', require('bourbon-neat').includePaths, require('bourbon').includePaths];


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

// Clean Styles
gulp.task('clean (styles)', (callback) => {
  del([
    'default-*.css',
    'default-*.css.map',
    'microsite-*.css',
    'microsite-*.css.map'
  ], callback);
});

// Styles
gulp.task('styles (dev)', ['lint-css'], function() {
  var plugins = [
    autoprefixer(['last 2 versions', 'ie 9-11', 'iOS 8']),
    cssnano()
  ];
  return gulp.src([
    source + 'scss/default.scss',
    // source + 'scss/style-rtl.scss',
    source + 'scss/microsite.scss'
  ]).pipe(jsonToSass({
    jsonPath: source + '/variables.json',
    scssPath: source + '/scss/settings/_variables.json.scss'
  }))
  .pipe(cssGlobbing({
    extensions: ['.scss']
  }))
  .pipe(sourcemaps.init())
  .pipe(sass({includePaths: sassInclude}))
    .on('error', handleError)
    .on('error', notify.onError())
  //.pipe(autoprefixer(['last 2 versions', 'ie 9-11', 'iOS 8']))
  //.pipe(minifycss())
  .pipe(postcss(plugins))
  .pipe(hashFilename())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('./'))
  .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('styles', ['lint-css'], function() {
    return gulp.src([
        source + 'scss/default.scss'
    ]).pipe(jsonToSass({
      jsonPath: source + '/variables.json',
      scssPath: source + '/scss/settings/_variables.json.scss'
    }))
    .pipe(cssGlobbing({
      extensions: ['.scss']
    }))
    .pipe(sass({includePaths: sassInclude}))
        .on('error', handleError)
        .on('error', notify.onError())
    .pipe(autoprefixer(['last 2 versions', 'ie 9-11', 'iOS 8']))
    .pipe(minifycss())
    .pipe(size({
      'showFiles': true
    }))
    .pipe(rtlcss())
    .pipe(rename({ basename: 'rtl' }))
    .pipe(gulp.dest('./'));
});

// gulp.task('styles_rtl_dev', ['lint-css'], function() {
//     return gulp.src([
//       source+'scss/style-rtl.scss'
//     ])
//     .pipe(cssGlobbing({
//       extensions: ['.scss']
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(sass({includePaths: sassInclude}))
//         .on('error', handleError)
//         .on('error', notify.onError())
//     .pipe(autoprefixer(['last 2 versions', 'ie 9-11', 'iOS 8']))
//     //.pipe(minifycss())
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('./'))
//     .pipe(browserSync.stream({match: '**/*.css'}));
// });

// gulp.task('styles_microsite_dev', ['lint-css'], function() {
//     return gulp.src([
//       source+'scss/microsite.scss'
//     ])
//     .pipe(cssGlobbing({
//       extensions: ['.scss']
//     }))
//     .pipe(sourcemaps.init())
//     .pipe(sass({includePaths: sassInclude}))
//         .on('error', handleError)
//         .on('error', notify.onError())
//     .pipe(autoprefixer(['last 2 versions', 'ie 9-11', 'iOS 8']))
//     //.pipe(minifycss())
//     .pipe(sourcemaps.write('./'))
//     .pipe(gulp.dest('./'))
//     .pipe(browserSync.stream({match: '**/*.css'}));
// });

// Script Linter
gulp.task('lint', function() {
  return gulp.src([source + 'js/**/*.js', '!' + source + 'js/vendor/*.js'])
    .pipe(eslint({fix:true}))
    .pipe(gif(!browserSync.active, eslint.failOnError()));
});

// Modernizr
gulp.task('modernizr', function() {
  gulp.src(source+'js/*.js')
    .pipe(modernizr({
        crawl: false,
        options: [
          "setClasses",
          "addTest",
          "html5printshiv",
          "testProp",
          "fnBind"
        ],
        // https://modernizr.com/docs
        tests: [
          'csstransforms3d',
          'csstransitions',
          'touchevents',
          'flexbox',
          'pointerevents'
        ]
    }))
    .pipe(uglify())
    .pipe(gulp.dest(dist+'js'))
});

// Webpack
gulp.task('pack', ['lint'], function() {
  return gulp.src(source + 'js/main.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(dist + 'js'));
});


// Scripts
gulp.task('scripts', ['clean (scripts)', 'pack'], function() {
  return gulp.src([
    source + 'js/vendor/_*.js',
    dist + 'js/bundle.js'
  ])
  .pipe(concat('source.js'))
  .pipe(hashFilename())
  .pipe(gulp.dest(dist + 'js'))
  .pipe(uglify())
  .pipe(rename({suffix: '.min'}))
  .pipe(size({showFiles: true}))
  .pipe(gulp.dest(dist + 'js'))
  .pipe(browserSync.stream({match: '**/*.js'}));
});


// Clean
gulp.task('clean (scripts)', function(cb) {
  del([
    dist + 'js/bundle.js',
    dist + 'js/source.dev.js',
    dist + 'js/source.js',
    dist + 'js/source-*.js',
    dist + 'js/source-*.min.js'
  ], cb);
});


// Images
gulp.task('images', function() {
  return gulp.src(source + 'img/**/*')
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest(dist + 'img'))
    .pipe(notify({message: 'Images task complete'}));
});

// SVGs
gulp.task('icons', function() {
  return gulp.src(source + 'icons/*.svg')
    .pipe(rename({prefix: 'icon-'}))
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'svg-sprite.twig',
          bust: false,
          inline: true
        }
      }
    }))
    .pipe(gulp.dest(views + 'partials'));
});

gulp.task('styleguideIcons', function() {
  return gulp.src(source+'icons/*.svg')
    .pipe(svgSprite({
      mode: {
        symbol: {
          dest: '.',
          sprite: 'svg-sprite.svg',
          bust: false,
          inline: false
        }
      }
    }))
    .pipe(gulp.dest(dist + 'styleguide/assets/img'))
});

// Generate Styleguide
gulp.task('styleguide:generate', ['styles'], function() {
  return gulp.src([source + 'scss/base/_*.scss', source + 'scss/components/_*.scss'])
    .pipe(styleguide.generate({
      title: 'Growing Up NYC',
      rootPath: dist + 'styleguide',
      appRoot: appRoot + 'styleguide',
      overviewPath: 'styleguide-overview.md',
      extraHead: '<script src="//use.typekit.net/gyh3xur.js"></script><script>try{Typekit.load({ async: true });}catch(e){}</script>',
      commonClass: 'styleguide'
    }))
    .pipe(gulp.dest(dist + 'styleguide'))
});

// Apply styles to styleguide
gulp.task('styleguide:applystyles', ['styleguide:generate'], function() {
  return gulp.src(source + 'scss/default.scss')
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
gulp.task('styleguide', ['styleguide:applystyles']);

// Watch
gulp.task('default', function() {

    browserSync.init({
      proxy: 'http://localhost:8080',
      port:3001,
      ghostMode: {
          scroll: true
      },
      open:false
    });

    // Watch .scss files
    gulp.watch(source+'scss/**/*.scss', ['clean (styles)', 'styles (dev)']);

    // Watch .scss RTL files
    // gulp.watch(source+'scss/**/*.scss', ['styles_rtl_dev']);

    // Watch .scss Micro Site files
    // gulp.watch(source+'scss/**/*.scss', ['styles_microsite_dev']);

    // Watch .js files
    gulp.watch(source+'js/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch(source+'img/**/*', ['images']);

    // Watch SVG icons
    gulp.watch(source+'icons/*.svg', ['icons', 'styleguideIcons']);

    // Watch templates, JS, and CSS, reload on change
    gulp.watch([
            'guny/**/*',
        ], { dot: true })
        .on('change', browserSync.reload);
});

// Build
gulp.task('build', ['clean (scripts)'], function() {
    gulp.start('modernizr', 'scripts', 'styleguide');
});
