(function () {
    'use strict';

    /**
    * Construct a custom <blockquote> element from embed.ly's response metadata
    */
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
                        var unique_id = '_' + Math.random().toString(36).substr(2, 9);
                        var data = response.data;
                        if (data.provider_name === 'Twitter') {
                            data.html = [
                                '<div id="'+ unique_id +'">',
                                '     <blockquote class="twitter-tweet">',
                                '         <p>',
                                data.description,
                                '         </p>&mdash; ',
                                '         '+data.title+' (@'+data.author_name+')',
                                '         <a href="'+url+'">'+url+'</a>',
                                '     </blockquote>',
                                '</div>',
                                '<script>',
                                '    window.twttr = (function(d, s, id) {',
                                '        var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};',
                                '        if (d.getElementById(id)) return t; js = d.createElement(s);js.id = id;',
                                '        js.src = "https://platform.twitter.com/widgets.js";',
                                '        fjs.parentNode.insertBefore(js, fjs); t._e = [];',
                                '        t.ready = function(f) {t._e.push(f);}; return t;}(document, "script", "twitter-wjs"));',
                                '    window.twttr.ready(function(){',
                                '        window.twttr.widgets.load(document.getElementById("'+ unique_id +'"));',
                                '    });',
                                '</script>'
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
    angular.module('angular-embed.handlers')
        .service('ngEmbedTwitterHandler', ['embedlyService', '$q', twitterService]);
})();
