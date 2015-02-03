(function () {
    'use strict';

    /**
    * Add a width parameter to the facebook embed code
    */
    function pictureService(embedlyService, $q) {
        return {
            patterns: [
                '(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?'
            ],
            embed: function(url, max_width) {
                var deferred = $q.defer();
                embedlyService.embed(url, max_width).then(
                    function successCallback(response) {
                        var data = response.data;
                        if (data.type === 'photo' && !data.thumbnail_url) {
                            data.thumbnail_url = data.url;
                            data.thumbnail_width = data.width;
                            data.thumbnail_height = data.height;
                        }
                        deferred.resolve(data);
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
        .service('ngEmbedPictureHandler', ['embedlyService', '$q', pictureService]);
})();
