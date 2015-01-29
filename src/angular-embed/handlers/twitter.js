(function () {
    'use strict';

    function twitterService(embedlyService, $q) {
        return {
            name: 'Twitter',
            patterns: [
                'https?://(?:www|mobile\\.)?twitter\\.com/(?:#!/)?[^/]+/status(?:es)?/(\\d+)/?$',
                'https?://t\\.co/[a-zA-Z0-9]+'
            ],
            embed: function(url) {
                var deferred = $q.defer();
                embedlyService.embed(url).then(
                    function successCallback(response) {
                        var data = response.data;
                        if (data.provider_name === 'Twitter') {
                            data.html = [
                                '<blockquote class="twitter-tweet" data-partner="tweetdeck">',
                                '    <p>',
                                data.description,
                                '   </p>&mdash; ',
                                '   '+data.title+' (@'+data.author_name+')',
                                '   <a href="'+data.url+'">'+data.url+'</a>',
                                '</blockquote>'
                            ].join('\n');
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
        .service('ngEmbedTwitterHandler', ['embedlyService', '$q', twitterService]);
})();
