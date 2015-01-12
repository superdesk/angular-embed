'use strict';

function noEmbedService($resource) {
    return {
        embed: function(url) {
            return $resource('http://noembed.com/embed?url='+url).get().$promise;
        },
        providers: function() {
            return $resource('http://noembed.com/providers').query().$promise;
        }
    };
}

angular.module('noEmbed').service('noEmbedService', ['$resource', noEmbedService]);
