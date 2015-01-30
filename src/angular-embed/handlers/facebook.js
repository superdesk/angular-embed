(function () {
    'use strict';

    /**
    * Add a width parameter to the facebook embed
    */
    function facebookService(embedlyService, $q) {
        return {
            name: 'Facebook',
            patterns: [
                'https?://(www\\.)facebook.com/.*'
            ],
            embed: function(url, max_width) {
                var deferred = $q.defer();
                embedlyService.embed(url, max_width).then(
                    function successCallback(response) {
                        var data = response.data;
                        if (data.provider_name === 'Facebook' && (max_width !== undefined)) {
                            data.html = data.html.replace('class="fb-post"', 'class="fb-post" data-width="'+max_width+'"');
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
        .service('ngEmbedFacebookHandler', ['embedlyService', '$q', facebookService]);
})();
