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

    // Config
    angular.module('angular-embed.config', [])
        .value('angular-embed.config', {
            debug: true
        });

    // Modules
    angular.module('noEmbed', ['ngResource']);
    angular.module('angular-embed.services', ['angular-embedly', 'noEmbed']);
    angular.module('angular-embed-handlers', ['angular-embedly']);
    angular.module('angular-embed',
        [
            'angular-embed.config',
            'angular-embed.services'
        ]);
})();
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
                        if (data.provider_name === 'Facebook' && data.html && (max_width !== undefined)) {
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
    angular.module('angular-embed-handlers')
        .service('ngEmbedInstagramHandler', ['embedlyService', '$q', instagramService]);
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
                        var data = response.data;
                        if (data.provider_name === 'Twitter') {
                            data.html = [
                                '<blockquote class="twitter-tweet">',
                                '    <p>',
                                data.description,
                                '    </p>&mdash; ',
                                '    '+data.title+' (@'+data.author_name+')',
                                '    <a href="'+url+'">'+url+'</a>',
                                '</blockquote>',
                                '<script>',
                                '    window.twttr = (function(d, s, id) {',
                                '        var js, fjs = d.getElementsByTagName(s)[0],t = window.twttr || {};',
                                '        if (d.getElementById(id)) return t; js = d.createElement(s);js.id = id;',
                                '        js.src = "https://platform.twitter.com/widgets.js";',
                                '        fjs.parentNode.insertBefore(js, fjs); t._e = [];',
                                '        t.ready = function(f) {t._e.push(f);}; return t;}(document, "script", "twitter-wjs"));',
                                '    window.twttr.ready(function(){window.twttr.widgets.load();});',
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
    angular.module('angular-embed-handlers')
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
    angular.module('angular-embed-handlers')
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
                                deferred.reject(error.error_message || error.data.error_message);
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
        this.$get = ['embedlyService', 'noEmbedService', '$q', embedService];
        // list of specialHandler
        this.specialHandlers = [];
        // method to register specialHandlers
        this.registerHandler = function(handler) {
            provider.specialHandlers.push(handler);
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
