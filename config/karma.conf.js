module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
      'public/js/lib/angular/angular.js',
      'public/js/lib/angular/angular-mocks.js',
      'public/js/*.js',
      'test/unit/**/*.js'
    ],


    logLevel : LOG_DEBUG,

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
