(function () {
    'use strict';

    /**
    * Use embed.ly for instagram
    */
    function instagramService(embedlyService, $q) {
        return {
            name: 'Instagram',
            patterns: ['https?://instagr(?:\\.am|am\\.com)/p/.+'],
            embed: function(url, max_width) {
                // use embed.ly for youtube video
                var deferred = $q.defer();
                embedlyService.embed(url, max_width).then(
                    function successCallback(response) {
                        // remove the description which is a copy of the title
                        delete response.data.description;
                        deferred.resolve(response.data);
                    },
                    function errorCallback(error) {
                        deferred.reject(error.error_message || error.data.error_message);
                    }
                );
                return deferred.promise;
            }
        };
    }
    angular.module('angular-embed.handlers')
        .service('ngEmbedInstagramHandler', ['embedlyService', '$q', instagramService]);
})();
