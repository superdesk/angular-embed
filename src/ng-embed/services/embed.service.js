'use strict';

function embedService(embedlyService, noEmbedService, $q) {
    var noEmbedProviders = noEmbedService.providers();

    function isSupportedByNoEmbedProviders(providers, url) {
        return providers.some(function(provider) {
            return provider.patterns.some(function(pattern) {
                var regex = new RegExp(pattern);
                if (regex.test(url)) {
                    return true;
                }
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
                    deferred.resolve(embedlyService.embed(url));
                }
            });
            return deferred.promise;
        }
    };
}

angular.module('ngEmbed.services').service('embed', ['embedlyService', 'noEmbedService', '$q', embedService]);
