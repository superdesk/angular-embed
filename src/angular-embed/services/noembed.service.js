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
