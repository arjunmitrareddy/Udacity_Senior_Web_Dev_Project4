/**
 * Created by arjunMitraReddy on 7/15/2016.
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var del = require('del');
var mergeStream = require('merge-stream');
var args = process.argv.slice(3);

gulp.task('clean', () => {
    del(['build']);
});

gulp.task('css', () => {
    return gulp.src('public/scss/*.scss')
        .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
        .pipe(plugins.sass({ outputStyle: 'compressed' }))
        .pipe(plugins.autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(gulp.dest('public/css'));
});

gulp.task('wire-dep', () => {
    var injectJsFiles = [
        'public/js/**/*.module.js',
        'public/js/**/*.config.js',
        'public/js/*.js'
    ];
    var wireDepOptions = {
        bowerJson: require('./bower.json'),
        directory: 'bower_components',
        ignorePath: '..'
    };
    return gulp
        .src('public/index.html')
        .pipe(wiredep(wireDepOptions))
        .pipe(plugins.inject(gulp.src(injectJsFiles)))
        .pipe(plugins.inject(gulp.src('public/css/*.css')))
        .pipe(gulp.dest('public'));
});

gulp.task('copy', () => {
    return mergeStream(
        gulp.src('public/imgs/**/*').pipe(plugins.imagemin({optimizationLevel: 4})).pipe(gulp.dest('build/public/imgs/')),
        gulp.src([
            'bower_components/bootstrap/fonts/*',
            'bower_components/font-awesome/fonts/*'
        ]).pipe(gulp.dest('build/public/fonts')),
        gulp.src('public/templates/*.html').pipe(gulp.dest('build/public/templates')),
        gulp.src('public/json/*.json').pipe(gulp.dest('build/public/json')),
        gulp.src('public/csv/*').pipe(gulp.dest('build/public/csv'))

    )
});

gulp.task('babelify-client', () => {
    var assets = plugins.useref({searchPath: './'});
    var cssFilter = plugins.filter('**/*.css', {restore: true});
    var jsFilter = plugins.filter('**/*.js', {restore: true});
    gulp.src('public/index.html').pipe(plugins.plumber()).pipe(assets).pipe(cssFilter).pipe(plugins.csso({comments: false})).pipe(plugins.sourcemaps.init()).pipe(plugins.sourcemaps.write('./')).pipe(cssFilter.restore)
        .pipe(jsFilter).pipe(plugins.sourcemaps.init()).pipe(plugins.uglify()).pipe(plugins.sourcemaps.write('./')).pipe(jsFilter.restore)
        .pipe(gulp.dest('build/public'))
});

gulp.task('babelify-server', () => {
    return gulp.src('server/**/*.js')
        .pipe(plugins.babel({stage: 1}))
        /*.pipe(plugins.uglify())*/
        .on('error', plugins.util.log.bind(plugins.util))
        .pipe(gulp.dest('build/server'));
});

gulp.task('cache-templates', () => {
    var templateCacheOptions = {
        file: 'templatesCache.js',
        options: {
            module: 'restrevirew',
            standAlone: false,
            root: '/templates'
        }
    };
    return gulp
        .src('public/templates/*.html')
        .pipe(plugins.minifyHtml({empty: true}))
        .pipe(plugins.angularTemplatecache(
            templateCacheOptions.file,
            templateCacheOptions.options
        ))
        .pipe(gulp.dest('build/cache'))
});

gulp.task('watch', () => {
    gulp.task('watch', () => {
        gulp.watch(['public/scss/**/*.scss'], () => {runSequence('css', 'copy')});
        gulp.watch(['server/**/*.js'], ['babelify-server']);
        gulp.watch(['public/imgs/**/*'], ['copy']);
        gulp.watch('public/index.html', ['refresh']);
        gulp.watch(['public/js/**/*', 'public/js/*'], ['refresh']);
        gulp.watch(['public/templates/**/*', 'public/templates/*'], ['refresh']);
    });
});

gulp.task('server', () => {
    plugins.developServer.listen({
        path: './index.js',
        cwd: './build/server',
        args: args
    });
    gulp.watch([
        'build/server/**/*.js'
    ], plugins.developServer.restart);
});

gulp.task('refresh', (callback) => {
    runSequence('css', 'wire-dep', 'copy', 'babelify-client', 'cache-templates', 'babelify-server', callback);
});

gulp.task('heroku', (callback) => {
    runSequence('clean', 'css', 'wire-dep', 'copy', 'babelify-client', 'cache-templates', 'babelify-server', callback);
});

gulp.task('serve', (callback) => {
    runSequence('clean', 'css', 'wire-dep', 'copy', 'babelify-client', 'cache-templates', 'babelify-server','watch', 'server', callback);
});
