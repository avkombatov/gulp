const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const include = require('gulp-file-include')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const del = require('del')

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  }
}



function clean() {
  return del(['dist'])
}

function html() {
  return gulp.src('src/**/*.html')
    .pipe(include({
      prefix: '@@'
    }))
    .pipe(gulp.dest(paths.html.dest))
}

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      basename: 'style'
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
  return gulp.src(paths.scripts.src, {
      sourcemaps: true
    })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest))
}

function watch() {
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
}

const build = gulp.series(clean, gulp.parallel(html, styles, scripts), watch)

exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch
exports.build = build
exports.default = build