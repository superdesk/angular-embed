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
