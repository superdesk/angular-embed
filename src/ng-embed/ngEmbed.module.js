(function () {
    'use strict';

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

    // Config
    angular.module('ngEmbed.config', [])
        .value('ngEmbed.config', {
            debug: true
        });

    // Modules
    angular.module('noEmbed', ['ngResource']);
    angular.module('ngEmbed.services', ['angular-embedly', 'noEmbed']);
    angular.module('ngEmbed',
        [
            'ngEmbed.config',
            'ngEmbed.services'
        ]);

})();
