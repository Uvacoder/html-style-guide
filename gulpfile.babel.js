import babelify          from 'babelify';
import browserify        from 'browserify';
import gulp              from 'gulp';
import gulpCleanCss      from 'gulp-clean-css';
import gulpHtmlmin       from 'gulp-htmlmin';
import gulpImagemin      from 'gulp-imagemin';
import gulpJsonminify    from 'gulp-jsonminify';
import gulpPostcss       from 'gulp-postcss';
import gulpSourcemaps    from 'gulp-sourcemaps';
import gulpSvgmin        from 'gulp-svgmin';
import gulpUglify        from 'gulp-uglify';
import postcssCssnext    from 'postcss-cssnext';
import postcssImport     from 'postcss-import';
import stylelint         from 'stylelint';
import vinylBuffer       from 'vinyl-buffer';
import vinylSourceStream from 'vinyl-source-stream';

const dirs = {
  source: './source',
  dest  : './docs'
};

gulp.task('css', () => {
  return gulp.src(`${dirs.source}/assets/css/style.css`)
    .pipe(gulpSourcemaps.init())
    .pipe(gulpPostcss([
      postcssImport(),
      postcssCssnext({
        features: {
          rem: false
        }
      })
    ]))
    .pipe(gulpCleanCss())
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(`${dirs.dest}/assets/css`));
});

gulp.task('copy', () => {
  return gulp.src(`${dirs.source}/**/*.txt`)
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('html', () => {
  return gulp.src(`${dirs.source}/**/*.html`)
    .pipe(gulpHtmlmin({
      caseSensitive                : false,
      collapseBooleanAttributes    : true,
      collapseInlineTagWhitespace  : false,
      collapseWhitespace           : true,
      conservativeCollapse         : false,
      decodeEntities               : false,
      html5                        : true,
      includeAutoGeneratedTags     : false,
      keepClosingSlash             : false,
      minifyCSS                    : true,
      minifyJS                     : true,
      minifyURLs                   : true,
      preserveLineBreaks           : false,
      preventAttributesEscaping    : false,
      processConditionalComments   : false,
      processScripts               : false,
      quoteCharacter               : false,
      removeAttributeQuotes        : true,
      removeComments               : true,
      removeEmptyAttributes        : true,
      removeEmptyElements          : false,
      removeOptionalTags           : true,
      removeRedundantAttributes    : false,
      removeScriptTypeAttributes   : true,
      removeStyleLinkTypeAttributes: true,
      removeTagWhitespace          : true,
      sortAttributes               : true,
      sortClassName                : true,
      trimCustomFragments          : true,
      useShortDoctype              : true
    }))
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('images', () => {
  return gulp.src(`${dirs.source}/**/*.{gif,ico,jpg,jpeg,png}`)
    .pipe(gulpImagemin())
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('js', () => {
  const b = browserify({
    entries: `${dirs.source}/assets/js/script.js`,
    transform: [babelify]
  });

  return b.bundle()
    .pipe(vinylSourceStream('script.js'))
    .pipe(vinylBuffer())
    .pipe(gulpSourcemaps.init())
    .pipe(gulpUglify())
    .pipe(gulpSourcemaps.write('.'))
    .pipe(gulp.dest(`${dirs.dest}/assets/js`));
});

gulp.task('json', () => {
  return gulp.src(`${dirs.source}/**/*.json`)
    .pipe(gulpJsonminify())
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('lint:css', () => {
  return gulp.src(`${dirs.source}/assets/css/**/*.css`)
    .pipe(gulpPostcss([
      stylelint()
    ]));
});

gulp.task('svg', () => {
  return gulp.src(`${dirs.source}/**/*.svg`)
    .pipe(gulpSvgmin())
    .pipe(gulp.dest(`${dirs.dest}`));
});

gulp.task('watch', () => {
  gulp.watch(`${dirs.source}/**/*.html`, ['html']);
  gulp.watch(`${dirs.source}/assets/css/**/*.css`, ['lint:css', 'css']);
  gulp.watch(`${dirs.source}/assets/js/**/*.js`, ['js']);
  gulp.watch(`${dirs.source}/**/*.json`, ['json']);
  gulp.watch(`${dirs.source}/**/*.{gif,ico,jpg,jpeg,png}`, ['images']);
  gulp.watch(`${dirs.source}/**/*.svg`, ['svg']);
  gulp.watch(`${dirs.source}/**/*.txt`, ['copy']);
});

gulp.task('default', [
  'lint',
  'css',
  'html',
  'js',
  'json',
  'images',
  'svg',
  'copy',
  'watch'
]);

gulp.task('lint', [
  'lint:css'
]);

gulp.task('build', [
  'lint',
  'css',
  'html',
  'js',
  'json',
  'images',
  'svg',
  'copy'
]);
