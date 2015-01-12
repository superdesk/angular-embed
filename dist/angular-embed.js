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
        // test the url with all the providers. Return true if the url match a provider
        return providers.some(function(provider) {
            return provider.patterns.some(function(pattern) {
                var regex = new RegExp(pattern);
                return regex.test(url);
            });
        });
    }

    return {
        get: function(url) {
            // prepare a promise to be returned quickly
            var deferred = $q.defer();
            // return the embedly response to the promise
            function useEmbedlyService() {
                embedlyService.embed(url).then(function(response) {
                    deferred.resolve(response.data);
                });
            }
            // return the noEmbed response to the promise
            function useNoEmbedService() {
                deferred.resolve(noEmbedService.embed(url));
            }
            // wait the providers list
            noEmbedProviders.then(function noEmbedProvidersSuccessCallback(providers) {
                // if the url is in the NoEmbed providers list, we use NoEmbed
                if (isSupportedByNoEmbedProviders(providers, url)) {
                    useNoEmbedService();
                } else {
                    // otherwise we use embedly which limits requests
                    useEmbedlyService();
                }
            }, function noEmbedProvidersErrorCallback(error) {
                // on NoembedProviders error, use the embedly service
                useEmbedlyService();
            });
            // return the promise
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
