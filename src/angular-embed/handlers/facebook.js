(function () {
    'use strict';

    /**
    * Add a width parameter to the facebook embed code
    */
    function facebookService(embedlyService, $q, embedService) {
        return {
            name: 'Facebook',
            patterns: [
                'https?://(www\\.)facebook.com/.*'
            ],
            embed: function(url, max_width) {
                var deferred = $q.defer();
                embedlyService.embed(url, max_width).then(
                    function successCallback(response) {
                        var unique_id = '_' + Math.random().toString(36).substr(2, 9);
                        var data = response.data;
                        if (data.provider_name === 'Facebook' && data.html && (max_width !== undefined)) {
                            data.html = data.html.replace(
                                'class="fb-post"',
                                'class="fb-post" data-width="'+max_width+'"'
                            );
                            // remove fb-root
                            data.html = data.html.replace('<div id="fb-root"></div>', '');
                            // wrapper with id
                            data.html = data.html.replace('</script>', '</script><div id="'+ unique_id +'">');
                            data.html += '</div>';
                            // reload script
                            data.html += [
                                '<script>',
                                '  if(window.FB !== undefined) {',
                                '    window.FB.XFBML.parse(document.getElementById("'+unique_id+'"));',
                                '  }',
                                '</script>'
                            ].join('');
                            // add the facebook key
                            if (embedService.getConfig('facebookAppId') !== undefined) {
                                data.html = data.html.replace(
                                    'js#xfbml=1',
                                    'js#xfbml=1&status=0&appId=' + embedService.getConfig('facebookAppId')
                                );
                            }
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
        .service('ngEmbedFacebookHandler', ['embedlyService', '$q', 'embedService', facebookService]);
})();
