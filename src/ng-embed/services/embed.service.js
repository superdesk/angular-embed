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
