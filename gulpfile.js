const gulp = require('gulp');
const clean = require('gulp-clean');
const { exec } = require('child_process');

// Removes previous dist
gulp.task('clean', () => {
  return gulp.src('./deploy/dist', { allowEmpty: true }).pipe(clean());
});

// Initial ts compile
gulp.task('tsc', (cb) => {
  exec('tsc', () => cb());
});

// Heroku copy dist files
gulp.task('heroku-copy-dist', () => {
  return gulp.src(['./react/build/**/*']).pipe(gulp.dest('./deploy/dist'));
});

// Heroku copy root files
gulp.task('heroku-copy-root', () => {
  return gulp
    .src(['./package.json', './package-lock.json', './Procfile'])
    .pipe(gulp.dest('./deploy'));
});

// Heroku clean files
gulp.task('heroku-clean', () => {
  return gulp
    .src(
      [
        './deploy/Procfile',
        './deploy/package.json',
        './deploy/package-lock.json',
        './deploy/tsconfig.tsbuildinfo',
      ],
      { allowEmpty: true }
    )
    .pipe(clean());
});

// Heroku deploy
gulp.task(
  'deploy',
  gulp.series(
    'clean',
    'tsc',
    'heroku-clean',
    'heroku-copy-root',
    'heroku-copy-dist'
  )
);
