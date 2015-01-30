(function () {
    'use strict';

    function facebookService(embedlyService, $q) {
        return {
            name: 'Facebook',
            patterns: [
                'https?://(www\\.)facebook.com/.*'
            ],
            embed: function(url) {
                var deferred = $q.defer();
                embedlyService.embed(url).then(
                    function successCallback(response) {
                        var data = response.data;
                        if (data.provider_name === 'Facebook') {
                            data.html = data.html.replace('class="fb-post"', 'class="fb-post" data-width="400"');
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
