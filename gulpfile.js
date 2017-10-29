// this is my gulpfile
// there are many like it, but this one is mine
// ver 0.0.2 - 11/10

// base paths
const srcDir = 'src'

// gulp dependencies
const gulp = require('gulp'),
      notify = require('gulp-notify'),
      stylus = require('gulp-stylus'),
      plumber = require('gulp-plumber'),
      browserSync = require('browser-sync').create()


// Custom Plumber function for catching errors
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || 'Gulp Error',
      message: 'Error: <%= error.message %>'
    })
  })
}


// -------- my tasks of goodness ------------

// process stylus files
gulp.task('stylus', () => {
  return ( 
    gulp.src(srcDir + '/stylus/**/*.styl')
        .pipe(customPlumber('Stylus Error'))
        .pipe(stylus({ compress: true }))
        .pipe(gulp.dest(srcDir))
        .pipe(browserSync.stream())
  )
})

// simply watch my hand-written js
gulp.task('js', () => {
  return ( 
    gulp.src(srcDir +'/js/**/*.js')
        .pipe(browserSync.reload({ stream: true }))
  )
})


// simply watch and move all html templates
gulp.task('html', () => {
  gulp.src(srcDir + '/**/*.html')
      .pipe(browserSync.reload({ stream: true }))
})


// setup browser-sync - 'my' original 
gulp.task('browser-sync', () => {
  browserSync.init({
    server: { baseDir: srcDir },
    open: false
  })
})


// build all files
gulp.task('build', () => {
  gulp.start(['stylus', 'js', 'html'])
})
 

// everyday dev-mode task - watch css,js,html in /src, process to /build
gulp.task('dev', () => {
  gulp.start(['build', 'browser-sync'])  
  gulp.watch([srcDir + '/stylus/**/*.styl'], ['stylus'])
  gulp.watch([srcDir + '/js/**/*.js'], ['js'])
  gulp.watch([srcDir + '/**/*.html'], ['html'])
})
