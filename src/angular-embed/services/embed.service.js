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
