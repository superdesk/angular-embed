(function () {
    'use strict';
    function IframelyProvider() {
        var provider = this;
        // register the service in the provider and inject dependencies
        function iframelyService($resource) {
            return {
                embed: function(url) {
                    var api_key = provider.getKey();
                    var resource = $resource('https://iframe.ly/api/iframely?api_key='+api_key+'&url='+url);
                    return resource.get().$promise.then(function(data) {
                        // mimic oembed
                        data.title = data.meta.title;
                        data.provider_name = data.meta.site;
                        return data;
                    });
                }
            };
        }
        angular.extend(provider, {
            $get: ['$resource', iframelyService],
            setKey: function(key) {
                provider.key = key;
            },
            getKey: function() {
                return provider.key;
            }
        });
    }
    angular.module('iframely').provider('iframelyService', IframelyProvider);
})();
