# angular-embed

This library wraps the embed services from [NoEmbed](http://noembed.com/) and [Embed.ly](http://embed.ly/).

## How it works

[NoEmbed](http://noembed.com/) is an open-source project which provides a lot of supported services.
Because it's free and unlimited, we use this service first.  
But sometimes, when the page is unknown, _NoEmbed_ can't provide anything.  
Then when we try to retrieve information on a page that _NoEmbed_ doesn't support, we use [Embed.ly](http://embed.ly/). It is a lot more accommodating with random page. It use an extractor to retrieve a _title_, a _description_ and an _illustration_ if available.  
_Embed.ly_ limits the amount of requests and requires an API key so __you need to register__.

## How to use it

- You need to import `angular-embed` and `angular-embedly` in your page

```html
<script src="bower/angular-embedly/em-minified/angular-embedly.min.js"></script>
<script src="bower/angular-embed/dist/angular-embed.min.js"></script>
```

- And add them in your angular application

```js
    angular.module('myApp', [
        // set `angular-embed` as a dependency of your module
        'angular-embed'
    // inject the service
    ]).controller('Ctrl', ['embedService', function(embedService) {
        // retrieve page information
        embedService.get('https://www.youtube.com/watch?v=Ksd-a9lIIDc')
    }]).config(function(embedlyServiceProvider) {
        // set your embed.ly key
        embedlyServiceProvider.setKey('your key');
    });
```

- You can also use the directive instead of using the embedService with one of the following syntaxes

```html
<ng-embed url="https://www.youtube.com/watch?v=Ksd-a9lIIDc"></ng-embed>
<div ng-embed="https://www.youtube.com/watch?v=Ksd-a9lIIDc"></div>
<div class="ng-embed:https://www.youtube.com/watch?v=Ksd-a9lIIDc;"></div>
```
## Special Handlers

**angular-embed** comes with some custom handlers

| Name                    | Description                                                                |
|:----------------------- |:---------------------------------------------------------------------------|
| ngEmbedFacebookHandler  | Add a width parameter to the facebook embed code and an App id (see below) |
| ngEmbedInstagramHandler | Use embed.ly for instagram                                                 |
| ngEmbedTwitterHandler   | Construct a custom &lt;blockquote&gt; element from embed.ly's metadata     |
| ngEmbedYoutubeHandler   | Use embed.ly for youtube                                                   |

To use a special handler, register them in the `run` block.

```js
angular.module('myApp')
    .run(['embedService', 'ngEmbedTwitterHandler', 'ngEmbedFacebookHandler',
        function(embedService, ngEmbedTwitterHandler, ngEmbedFacebookHandler) {
            embedService.registerHandler(ngEmbedFacebookHandler);
            embedService.setConfig('facebookAppId', 'xxxxxxxxxxxxxxx');
            embedService.registerHandler(ngEmbedTwitterHandler);
        }
    ]);
```

### Custom Handler

You can register all the handlers you want. An handler must match this structure and must return a promise of a [valid oembed code](http://oembed.com/).

```js
{
    name: 'Twitter',
    patterns: [
        'https?://(?:www|mobile\\.)?twitter\\.com/(?:#!/)?[^/]+/status(?:es)?/(\\d+)/?$',
        'https?://t\\.co/[a-zA-Z0-9]+'
    ],
    embed: function(url, max_width) {
        var deferred = $q.defer();
        ...
        return deferred.promise;
    }
}
```