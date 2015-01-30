(function() {
    'use strict';

    function EmbedServiceProvider() {
        var provider = this;
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
                registerHandler: provider.registerHandler,
                get: function(url, max_width) {
                    // prepare a promise to be returned quickly
                    var deferred = $q.defer();
                    // return the embedly response to the promise
                    function useEmbedlyService() {
                        embedlyService.embed(url, max_width).then(
                            function successCallback(response) {
                                deferred.resolve(response.data);
                            },
                            function errorCallback(error) {
                                deferred.reject(error.error_message || error.data.error_message);
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
                    // if the url isn't supported by a specialHandler
                    if (
                        // loop over specialHandlers and stop when it find one in order to call it
                        !provider.specialHandlers.some(function(handler) {
                            return handler.patterns.some(function(pattern) {
                                var regex = new RegExp(pattern);
                                if (regex.test(url)) {
                                    handler.embed(url, max_width).then(function(response) {
                                        deferred.resolve(response);
                                    });
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        })
                    ) {
                        // wait for the providers list
                        noEmbedProviders.then(function noEmbedProvidersSuccessCallback(providers) {
                            // if the url is in the NoEmbed providers list, we use NoEmbed
                            if (isSupportedByNoEmbedProviders(providers, url)) {
                                useNoEmbedService();
                            }
                            // otherwise we use embedly which limits requests
                            else {
                                useEmbedlyService();
                            }
                        }, function noEmbedProvidersErrorCallback(error) {
                            // on NoembedProviders error, use the embedly service
                            useEmbedlyService();
                        });
                    }
                    // return the promise
                    return deferred.promise;
                }
            };
        }
        // register the service in the provider and inject dependencies
        this.$get = ['embedlyService', 'noEmbedService', '$q', embedService];
        // list of specialHandler
        this.specialHandlers = [];
        // method to register specialHandlers
        this.registerHandler = function(handler) {
            provider.specialHandlers.push(handler);
        };
    }

    angular.module('angular-embed.services')
        .provider('embedService', EmbedServiceProvider);
})();
