({
    appDir: './',
    baseUrl: './javascripts',
    dir: './dist',
    modules: [
        {
            name: 'postlist',
            exclude: [
                "jquery",
                'domReady',
                'bootstrap',
                'util'
            ]
        },
        {
            name: 'applist',
            exclude: [
                "jquery",
                'domReady',
                'bootstrap',
                'util'
            ]
        },
        {
            name: 'boardlist',
            exclude: [
                "jquery",
                'domReady',
                'bootstrap',
                'util'
            ]
        },
        {
            name: 'categorylist',
            exclude: [
                "jquery",
                'domReady',
                'bootstrap',
                'util'
            ]
        }
    ],
    removeCombined: true,
    paths: {
        jquery: 'jquery-1.11.0.min',
        bootstrap: '../plugs/bootstrap-3.0.3/bootstrap.min',
        domReady: 'domReady'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: '$.fn.popover'
        }
    }
})