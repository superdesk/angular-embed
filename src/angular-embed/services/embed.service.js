(function() {
    'use strict';

    function EmbedServiceProvider() {
        // Embed Service
        function embedService(embedlyService, noEmbedService, $q) {
            var noEmbedProviders = noEmbedService.providers();
            // test the url with all the providers. Return true if the url match a provider
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
                    // prepare a promise to be returned quickly
                    var deferred = $q.defer();
                    // return the embedly response to the promise
                    function useEmbedlyService() {
                        embedlyService.embed(url).then(
                            function successCallback(response) {
                                deferred.resolve(response.data);
                            },
                            function errorCallback(error) {
                                deferred.reject(error.data.error_message);
                            }
                        );
                    }
                    // return the noEmbed response to the promise
                    function useNoEmbedService() {
                        noEmbedService.embed(url).then(function(response) {
                            if (response.error !== undefined) {
                                deferred.reject(response.error);
                            } else {
                                deferred.resolve(response);
                            }
                        });
                    }
                    // wait for the providers list
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
        // register the service in the provider and inject dependencies
        this.$get = ['embedlyService', 'noEmbedService', '$q', embedService];
    }

    angular.module('angular-embed.services')
        .provider('embedService', EmbedServiceProvider);
})();
