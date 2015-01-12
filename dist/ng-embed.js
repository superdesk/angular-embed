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

'use strict';

function embedService(embedlyService, noEmbedService, $q) {
    var noEmbedProviders = noEmbedService.providers();

    function isSupportedByNoEmbedProviders(providers, url) {
        for (var i = 0; i < providers.length; i++) {
            var provider = providers[i];
            for (var j = 0; j < provider.patterns.length; j++) {
                var regex = new RegExp(provider.patterns[j]);
                if (regex.test(url)) {
                    return true;
                }
            }
        }
        return false;
    }

    return {
        get: function(url) {
            var deferred = $q.defer();
            noEmbedProviders.then(function(providers){
                if (isSupportedByNoEmbedProviders(providers, url)) {
                    deferred.resolve(noEmbedService.embed(url));
                } else {
                    deferred.resolve(embedlyService.embed(url));
                }
            });
            return deferred.promise;
        }
    };
}

angular.module('ngEmbed.services').service('embed', ['embedlyService', 'noEmbedService', '$q', embedService]);

'use strict';

function noEmbedService($resource) {
    return {
        embed: function(url) {
            return $resource('http://noembed.com/embed?url='+url).get().$promise;
        },
        providers: function() {
            return $resource('http://noembed.com/providers').query().$promise;
        }
    };
}

angular.module('noEmbed').service('noEmbedService', ['$resource', noEmbedService]);
