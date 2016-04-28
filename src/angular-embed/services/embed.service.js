(function() {
    'use strict';

    function EmbedServiceProvider() {
        var provider = this;
        // Embed Service
        function embedService(noEmbedService, iframelyService, $q, $injector) {
            var noEmbedProviders = $q.when();
            if (!provider.getConfig('useOnlyFallback', false)) {
                noEmbedProviders = noEmbedService.providers();
            }
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
                setConfig: provider.setConfig,
                getConfig: provider.getConfig,
                get: function(url, max_width) {
                    // prepare a promise to be returned quickly
                    var deferred = $q.defer();
                    // return the embedly response within the promise
                    function useEmbedlyService() {
                        var embedlyService = $injector.get('embedlyService');
                        embedlyService.embed(url, max_width).then(
                            function successCallback(response) {
                                deferred.resolve(response.data);
                            },
                            function errorCallback(error) {
                                var message = error.error_message || (error.data)? error.data.error_message : undefined;
                                deferred.reject(message);
                            }
                        );
                    }
                    // return the noEmbed response within the promise
                    function useNoEmbedService() {
                        noEmbedService.embed(url).then(function(response) {
                            if (response.error !== undefined) {
                                deferred.reject(response.error);
                            } else {
                                deferred.resolve(response);
                            }
                        });
                    }
                    // return the iframely response within the promise
                    function useIframelyService() {
                        iframelyService.embed(url).then(
                            function successCallback(response) {
                                deferred.resolve(response);
                            },
                            function errorCallback(error) {
                                var message = error.error_message;
                                deferred.reject(message);
                            }
                        );
                    }
                    // if the url isn't supported by a specialHandler
                    if (
                        // loop over specialHandlers and stop when it find one in order to call it
                        !provider.specialHandlers.some(function(handler) {
                            return handler.patterns.some(function(pattern) {
                                var regex = new RegExp(pattern);
                                if (regex.test(url)) {
                                    $q.when(handler.embed(url, max_width)).then(function(response) {
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
                            if (!provider.getConfig('useOnlyFallback', false) &&
                            isSupportedByNoEmbedProviders(providers, url)) {
                                useNoEmbedService();
                            }
                            // otherwise we use embedly which limits requests
                            else {
                                var FALLBACK_SERVICES = {
                                    embedly: useEmbedlyService,
                                    iframely: useIframelyService
                                };
                                FALLBACK_SERVICES[provider.getConfig('fallbackService', 'embedly')]();
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
        provider.$get = ['noEmbedService', 'iframelyService', '$q', '$injector', embedService];
        // list of specialHandler
        provider.specialHandlers = [];
        // method to register specialHandlers
        provider.registerHandler = function(handler) {
            provider.specialHandlers.push(handler);
        };
        // configuration
        provider.config = {};
        provider.setConfig = function(key, value) {
            provider.config[key] = value;
        };
        provider.getConfig = function(key, default_value) {
            var value = provider.config[key];
            if(!angular.isDefined(value)) {
                value = default_value;
            }
            return value;
        };
    }

    angular.module('angular-embed.services')
        .provider('embedService', EmbedServiceProvider);
})();
