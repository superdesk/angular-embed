(function () {
    'use strict';

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

    // Config
    angular.module('angular-embed.config', [])
        .value('angular-embed.config', {
            debug: true
        });

    // Modules
    angular.module('noEmbed', ['ngResource']);
    angular.module('angular-embed.services', ['angular-embedly', 'noEmbed']);
    angular.module('angular-embed',
        [
            'angular-embed.config',
            'angular-embed.services'
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
            noEmbedProviders.then(function successCallback(providers) {
                // if the url is in the NoEmbed providers list, we use NoEmbed
                if (isSupportedByNoEmbedProviders(providers, url)) {
                    deferred.resolve(noEmbedService.embed(url));
                } else {
                    // otherwise we use embedly which limits requests
                    embedlyService.embed(url).then(function(response) {
                        deferred.resolve(response.data);
                    });
                }
            }, function errorCallback(error) {
                // on NoembedProviders error, use the embedly service
                embedlyService.embed(url).then(function(response) {
                    deferred.resolve(response.data);
                });
            });
            return deferred.promise;
        }
    };
}

angular.module('angular-embed.services').service('embedService', ['embedlyService', 'noEmbedService', '$q', embedService]);

'use strict';

function noEmbedService($resource) {
    return {
        embed: function(url) {
            var resource = $resource('https://noembed.com/embed?callback=JSON_CALLBACK&url='+url, {},
                {
                    get: {
                        method: 'JSONP'
                    }
                });
            return resource.get().$promise;
        },
        providers: function() {
            var resource = $resource('https://noembed.com/providers', {},
                {
                    query: {
                        method: 'JSONP',
                        isArray: true,
                        params: {callback:'JSON_CALLBACK'}
                    }
                });
            return resource.query().$promise;
        }
    };
}

angular.module('noEmbed').service('noEmbedService', ['$resource', noEmbedService]);
