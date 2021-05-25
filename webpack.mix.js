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
    'resources/assets/fontawesome.min.css',
    'resources/assets/bootstrap.min.css',
    'resources/assets/loading.css',
    'resources/assets/toastr.min.css',
    'resources/assets/style.css',
], 'public/assets/all.min.css');


mix.scripts([
    'resources/assets/jquery.min.js',
    'resources/assets/toastr.min.js',
    'resources/assets/jspdf.min.js',
    'resources/assets/bootstrap.bundle.min.js',
    'resources/assets/jscolor.js',
    'resources/assets/fabric.min.js',
    'resources/assets/config.js',
    'resources/assets/functions.js',
    'resources/assets/connection.js',
    'resources/assets/icons.js',
    'resources/assets/main.js',
], 'public/assets/all.min.js');



mix.copyDirectory('resources/assets/webfonts', 'public/assets/webfonts');


mix.version();
