var gulp = require('gulp');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');


var FILES = {
  html: 'src/**/*.html',
  js: 'src/**/*.js',
  sass: 'src/sass/*.scss',
  allSrc: 'src/**/*',
  jsLib: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js'
  ]
};


var CONFIG = {
  sass: {
    outputStyle: 'compressed',
    includePaths: ['node_modules/bootstrap-sass/assets/stylesheets/'],
    precision: 8 // Required by bootstrap-sass
  },
  autoprefixer: {
    browsers: [
      "Android 2.3",
      "Android >= 4",
      "Chrome >= 20",
      "Firefox >= 24",
      "Explorer >= 8",
      "iOS >= 6",
      "Opera >= 12",
      "Safari >= 6"
    ]
  }
}



// Concatenates files from the node_modules folder into single files
gulp.task('build-lib', function() {
  if (FILES.jsLib) {
    gulp.src(FILES.jsLib)
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('./'))
      .pipe(connect.reload());
  }

  if (FILES.cssLib) {
    gulp.src(FILES.cssLib)
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('./'))
      .pipe(connect.reload());
  }
});

gulp.task('build-sass', function() {
  gulp.src(FILES.sass)
    .pipe(sourcemaps.init())
    .pipe(sass(CONFIG.sass))
    .pipe(autoprefixer(CONFIG.autoprefixer))
    .pipe(concat('index.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

gulp.task('build-html', function() {
  gulp.src(FILES.html)
    .pipe(gulp.dest('./'))
    .pipe(connect.reload());
});

// Compiles all sass and javascript files
gulp.task('build', ['build-sass', 'build-html']);

gulp.task('reload-sass', ['build-sass'], function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

gulp.task('reload-html', ['build-html'], function() {
  gulp.src('index.html')
    .pipe(connect.reload());
});

// Starts a livereload server
gulp.task('server', ['build'], function() {
  connect.server({
    livereload: true,
    port: 8080
  });
});

// Reprocesses html files when they change
gulp.task('watch', function() {
  gulp.watch(FILES.sass, ['build-sass', 'reload-sass']);
  gulp.watch(FILES.html, ['build-html', 'reload-html']);
});

// Default task
gulp.task('default', ['server', 'watch']);
