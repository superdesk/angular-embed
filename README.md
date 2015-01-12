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

- Set `angular-embed` as a dependency of your module

```js
    var myApp = angular.module('myApp', ['angular-embed']);
```

- Set your embed.ly key

```js
    myApp.config(function(embedlyServiceProvider){
        embedlyServiceProvider.setKey('your key');
    });
```
