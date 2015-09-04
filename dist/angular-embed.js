/**
 * This file is part of Superdesk.
 *
 * Copyright 2013, 2014 Sourcefabric z.u. and contributors.
 *
 * For the full copyright and license information, please see the
 * AUTHORS and LICENSE files distributed with this source code, or
 * at https://www.sourcefabric.org/superdesk/license
 */
 
(function () {
    'use strict';

    // Create all modules and define dependencies to make sure they exist
    // and are loaded in the correct order to satisfy dependency injection
    // before all nested files are concatenated by Gulp

    // Modules
    angular.module('noEmbed', ['ngResource']);
    angular.module('angular-embed.services', ['angular-embedly', 'noEmbed']);
    angular.module('angular-embed', ['angular-embed.services']);
    angular.module('angular-embed.handlers', ['angular-embed']);
})();
(function(){
  'use strict';
  
  /**
  * @ngdoc directive
  * @name angularEmbedDirectiveApp.directive:ngEmbed
  * @description
  * # ngEmbed
  * Simple direcive that uses the embedService that loads the html and puts it inside the directive.
  */
  angular.module('angular-embed')
    .directive('ngEmbed', ['embedService',function (embedService) {
      return {
        restrict: 'AEC',
        controller: function($scope, $element, $attrs){
          embedService.get($attrs.url?$attrs.url:$attrs.ngEmbed).then(function(data){
            $element.html(data.html);
          });
        }
      };
    }]);
})();
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
    angular.module('angular-embed.handlers')
        .service('ngEmbedPictureHandler', ['embedlyService', '$q', pictureService]);
})();

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
                        data.element_id = unique_id;
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

(function () {
    'use strict';

    /**
    * Use embed.ly for youtube
    */
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
    angular.module('angular-embed.handlers')
        .service('ngEmbedYoutubeHandler', ['embedlyService', '$q', youtubeService]);
})();

(function() {
    'use strict';

    function EmbedServiceProvider() {
        var provider = this;
        // Embed Service
        function embedService(embedlyService, noEmbedService, $q) {
            var noEmbedProviders = noEmbedService.providers();
            // test the url with all the providers. Return true if the url match a provider
            function isSupportedByNoEmbedProviders(providers, url) {
                return providers.some(function(provider) {
                    return provider.patterns.some(function(pattern) {
                        var regex = new RegExp(pattern);
                        return regex.test(url);
                    });
                });
            }
            return {
                registerHandler: provider.registerHandler,
                setConfig: provider.setConfig,
                getConfig: provider.getConfig,
                get: function(url, max_width) {
                    // prepare a promise to be returned quickly
                    var deferred = $q.defer();
                    // return the embedly response to the promise
                    function useEmbedlyService() {
                        embedlyService.embed(url, max_width).then(
                            function successCallback(response) {
                                deferred.resolve(response.data);
                            },
                            function errorCallback(error) {
                                var message = error.error_message || (error.data)? error.data.error_message : undefined;
                                deferred.reject(message);
                            }
                        );
                    }
                    // return the noEmbed response to the promise
                    function useNoEmbedService() {
                        noEmbedService.embed(url).then(function(response) {
                            if (response.error !== undefined) {
                                deferred.reject(response.error);
                            } else {
                                deferred.resolve(response);
                            }
                        });
                    }
                    // if the url isn't supported by a specialHandler
                    if (
                        // loop over specialHandlers and stop when it find one in order to call it
                        !provider.specialHandlers.some(function(handler) {
                            return handler.patterns.some(function(pattern) {
                                var regex = new RegExp(pattern);
                                if (regex.test(url)) {
                                    handler.embed(url, max_width).then(function(response) {
                                        deferred.resolve(response);
                                    });
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        })
                    ) {
                        // wait for the providers list
                        noEmbedProviders.then(function noEmbedProvidersSuccessCallback(providers) {
                            // if the url is in the NoEmbed providers list, we use NoEmbed
                            if (isSupportedByNoEmbedProviders(providers, url)) {
                                useNoEmbedService();
                            }
                            // otherwise we use embedly which limits requests
                            else {
                                useEmbedlyService();
                            }
                        }, function noEmbedProvidersErrorCallback(error) {
                            // on NoembedProviders error, use the embedly service
                            useEmbedlyService();
                        });
                    }
                    // return the promise
                    return deferred.promise;
                }
            };
        }
        // register the service in the provider and inject dependencies
        provider.$get = ['embedlyService', 'noEmbedService', '$q', embedService];
        // list of specialHandler
        provider.specialHandlers = [];
        // method to register specialHandlers
        provider.registerHandler = function(handler) {
            provider.specialHandlers.push(handler);
        };
        // configuration
        provider.config = {};
        provider.setConfig = function(key, value) {
            provider.config[key] = value;
        };
        provider.getConfig = function(key) {
            return provider.config[key];
        };
    }

    angular.module('angular-embed.services')
        .provider('embedService', EmbedServiceProvider);
})();

(function () {
    'use strict';

    function noEmbedService($resource) {
        return {
            embed: function(url) {
                var resource = $resource('https://noembed.com/embed?callback=JSON_CALLBACK&url='+url, {},
                    {
                        get: {
                            method: 'JSONP'
                        }
                    });
                return resource.get().$promise;
            },
            providers: function() {
                var resource = $resource('https://noembed.com/providers', {},
                    {
                        query: {
                            method: 'JSONP',
                            isArray: true,
                            params: {callback:'JSON_CALLBACK'}
                        }
                    });
                return resource.query().$promise;
            }
        };
    }
    angular.module('noEmbed').service('noEmbedService', ['$resource', noEmbedService]);
})();
