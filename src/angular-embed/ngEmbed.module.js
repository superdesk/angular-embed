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
    angular.module('iframely', ['ngResource']);
    angular.module('angular-embed.services', ['angular-embedly', 'noEmbed', 'iframely']);
    angular.module('angular-embed', ['angular-embed.services']);
    angular.module('angular-embed.handlers', ['angular-embed']);
})();
