let gulp = require('gulp')
let html = require('gulp-htmlmin')

gulp.task('minify-html', () => {
  return gulp.src('views/*.html')
    .pipe(html({collapseWhiteSpace: true}))
    .pipe(gulp.dest('build/html'))
})

gulp.task('default', ['minify-html'])
