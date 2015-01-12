'use strict';

function noEmbedService($resource) {
    return {
        embed: function(url) {
            return $resource('https://noembed.com/embed?url='+url).get().$promise;
        },
        providers: function() {
            return $resource('https://noembed.com/providers').query().$promise;
        }
    };
}

angular.module('noEmbed').service('noEmbedService', ['$resource', noEmbedService]);
