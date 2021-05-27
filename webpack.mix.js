const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js')
//     .postCss('resources/css/app.css', 'public/css', [
//         //
//     ]);

mix.styles([
    'resources/assets/css/fontawesome.min.css',
    'resources/assets/css/bootstrap.min.css',
    'resources/assets/css/loading.css',
    'resources/assets/css/toastr.min.css',
    'resources/assets/css/style.css',
], 'public/assets/all.min.css');


mix.scripts([
    'resources/assets/js/jquery.min.js',
    'resources/assets/js/toastr.min.js',
    'resources/assets/js/jspdf.min.js',
    'resources/assets/js/bootstrap.bundle.min.js',
    'resources/assets/js/jscolor.js',
    'resources/assets/js/fabric.min.js',
    'resources/assets/js/config.js',
    'resources/assets/js/functions.js',
    'resources/assets/js/connection.js',
    'resources/assets/js/icons.js',
    'resources/assets/js/main.js',
], 'public/assets/all.min.js');



mix.copyDirectory('resources/assets/webfonts', 'public/assets/webfonts');
mix.copyDirectory('resources/assets/icons', 'public/assets/icons');


mix.version();
