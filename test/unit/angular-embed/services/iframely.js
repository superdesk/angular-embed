'use strict';

describe('iframely', function() {

    var iframely;
    var httpBackend;
    var url = 'https://www.instagram.com/p/BAUqqo4MK1n';
    var response = {
        /*jshint ignore:start,-W101*/
        "url": "https://www.instagram.com/p/BAUqqo4MK1n","meta": {"canonical": "https://www.instagram.com/p/BAUqqo4MK1n/","author_url": "https://www.instagram.com/pirhoo","author": "pirhoo","site": "Instagram","title": "[insérez ici un jeu de mot pourri sur Les Chouettes]"},"links": {"app": [{"rel": ["app","ssl","html5","inline"],"type": "text/html","html": "<blockquote class=\"instagram-media\" data-instgrm-version=\"6\" style=\" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);\"><div style=\"padding:8px;\"> <div style=\" background:#F8F8F8; line-height:0; margin-top:40px; padding:62.5% 0; text-align:center; width:100%;\"> <div style=\" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;\"></div></div><p style=\" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;\"><a href=\"https://www.instagram.com/p/BAUqqo4MK1n/\" style=\" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;\" target=\"_blank\">A photo posted by Pierre Romera (@pirhoo)</a> on <time style=\" font-family:Arial,sans-serif; font-size:14px; line-height:17px;\" datetime=\"2016-01-09T15:13:53+00:00\">Jan 9, 2016 at 7:13am PST</time></p></div></blockquote>\n<script async defer src=\"//platform.instagram.com/en_US/embeds.js\"></script>"}],"image": [{"media": {"height": 800,"width": 640},"rel": ["image","ssl","thumbnail"],"type": "image/jpeg","href": "https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/sh0.08/e35/p640x640/12424544_214212152254233_842647129_n.jpg"},{"media": {"height": 612,"width": 490},"rel": ["image"],"type": "image","href": "http://instagram.com/p/BAUqqo4MK1n/media/?size=l"}],"thumbnail": [{"media": {"height": 800,"width": 640},"rel": ["image","ssl","thumbnail"],"type": "image/jpeg","href": "https://scontent.cdninstagram.com/hphotos-xfp1/t51.2885-15/sh0.08/e35/p640x640/12424544_214212152254233_842647129_n.jpg"},{"media": {"height": 150,"width": 120},"rel": ["thumbnail"],"type": "image","href": "http://instagram.com/p/BAUqqo4MK1n/media/?size=t"},{"media": {"height": 306,"width": 245},"rel": ["thumbnail"],"type": "image","href": "http://instagram.com/p/BAUqqo4MK1n/media/?size=m"}],"icon": [{"type": "image/png","rel": ["apple-touch-icon-precomposed","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/apple-touch-icon-precomposed.png/29d68fc587d7.png"},{"type": "image/svg","rel": ["mask-icon","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/favicon.svg/dfde15ef1533.svg"},{"type": "image/x-icon","rel": ["shortcut","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/favicon.ico/7cdab0872b15.ico"},{"media": {"height": 72,"width": 72},"type": "image/png","rel": ["apple-touch-icon-precomposed","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/apple-touch-icon-72x72-precomposed.png/3f5e04d85488.png"},{"media": {"height": 144,"width": 144},"type": "image/png","rel": ["apple-touch-icon-precomposed","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/apple-touch-icon-144x144-precomposed.png/52fcc0fc09e4.png"},{"media": {"height": 114,"width": 114},"type": "image/png","rel": ["apple-touch-icon-precomposed","icon","ssl"],"href": "https://instagramstatic-a.akamaihd.net/h1/images/ico/apple-touch-icon-114x114-precomposed.png/29d68fc587d7.png"}]},"rel": ["app","ssl","html5","inline"],"html": "<blockquote class=\"instagram-media\" data-instgrm-version=\"6\" style=\" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);\"><div style=\"padding:8px;\"> <div style=\" background:#F8F8F8; line-height:0; margin-top:40px; padding:62.5% 0; text-align:center; width:100%;\"> <div style=\" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAAGFBMVEUiIiI9PT0eHh4gIB4hIBkcHBwcHBwcHBydr+JQAAAACHRSTlMABA4YHyQsM5jtaMwAAADfSURBVDjL7ZVBEgMhCAQBAf//42xcNbpAqakcM0ftUmFAAIBE81IqBJdS3lS6zs3bIpB9WED3YYXFPmHRfT8sgyrCP1x8uEUxLMzNWElFOYCV6mHWWwMzdPEKHlhLw7NWJqkHc4uIZphavDzA2JPzUDsBZziNae2S6owH8xPmX8G7zzgKEOPUoYHvGz1TBCxMkd3kwNVbU0gKHkx+iZILf77IofhrY1nYFnB/lQPb79drWOyJVa/DAvg9B/rLB4cC+Nqgdz/TvBbBnr6GBReqn/nRmDgaQEej7WhonozjF+Y2I/fZou/qAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;\"></div></div><p style=\" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;\"><a href=\"https://www.instagram.com/p/BAUqqo4MK1n/\" style=\" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;\" target=\"_blank\">A photo posted by Pierre Romera (@pirhoo)</a> on <time style=\" font-family:Arial,sans-serif; font-size:14px; line-height:17px;\" datetime=\"2016-01-09T15:13:53+00:00\">Jan 9, 2016 at 7:13am PST</time></p></div></blockquote>\n<script async defer src=\"//platform.instagram.com/en_US/embeds.js\"></script>"
        /*jshint ignore:end,-W101*/
    };

    beforeEach(module('iframely'));
    beforeEach(inject(function(iframelyService, _$httpBackend_) {
        httpBackend = _$httpBackend_;
        httpBackend
            .when('JSONP', 'https://iframe.ly/api/iframely?callback=JSON_CALLBACK&api_key=undefined&url='+url)
            .respond(response);
        iframely = iframelyService;
    }));

    it('should retrieve the embed code for a instagram video', function() {
        iframely.embed(url).then(
            function successCallback(data) {
                assert.property(data, 'title');
                assert.property(data, 'url');
                assert.property(data, 'provider_name');
            },
            function errorCallback(error) {
                throw new Error(error);
            });
        httpBackend.flush();
    });

});
