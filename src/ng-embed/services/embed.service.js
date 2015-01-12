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
