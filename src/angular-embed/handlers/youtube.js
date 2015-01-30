(function () {
    'use strict';

    function youtubeService(embedlyService, $q) {
        return {
            name: 'Youtube',
            patterns: [
                'https?://(?:[^\\.]+\\.)?youtube\\.com/watch/?\\?(?:.+&)?v=([^&]+)',
                'https?://youtu\\.be/([a-zA-Z0-9_-]+)'
            ],
            embed: function(url, max_width) {
                // use embed.ly for youtube video
                var deferred = $q.defer();
                embedlyService.embed(url, max_width).then(
                    function successCallback(response) {
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
    angular.module('angular-embed-handlers')
        .service('ngEmbedYoutubeHandler', ['embedlyService', '$q', youtubeService]);
})();
