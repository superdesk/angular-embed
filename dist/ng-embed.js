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
        return providers.some(function(provider) {
            return provider.patterns.some(function(pattern) {
                var regex = new RegExp(pattern);
                return regex.test(url);
            });
        });
    }

    return {
        get: function(url) {
            var deferred = $q.defer();
            noEmbedProviders.then(function(providers){
                if (isSupportedByNoEmbedProviders(providers, url)) {
                    deferred.resolve(noEmbedService.embed(url));
                } else {
                    embedlyService.embed(url).then(function(response) {
                        deferred.resolve(response.data);
                    });
                }
            });
            return deferred.promise;
        }
    };
}

angular.module('ngEmbed.services').service('embedService', ['embedlyService', 'noEmbedService', '$q', embedService]);

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
