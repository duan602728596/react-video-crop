const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');

const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: [
            'last 2 versions',
            'last 10 Chrome versions',
            'last 1 year',
            'IE 11'
          ]
        },
        modules: false,
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: {
          version: 3,
          proposals: true
        },
        helpers: true,
        regenerator: true,
        useESModules: true
      }
    ]
  ]
};

function projectBabel() {
  return gulp.src('src/**/*.js')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('lib'));
}

function projectSass() {
  return gulp.src('src/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(gulp.dest('lib'));
}

exports.default = gulp.parallel(projectBabel, projectSass);