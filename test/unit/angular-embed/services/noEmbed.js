'use strict';

describe('noEmbed', function() {

    var dependencies;
    var noEmbed;
    var httpBackend;
    var youtube_url = 'https://www.youtube.com/watch?v=Ksd-a9lIIDc';
    var youtube_response = {
        /*jshint ignore:start,-W101*/
        'author_name':'Cats Go Boom Mixes','width':480,'author_url':'http://www.youtube.com/user/SickMixxxes','provider_url':'http://www.youtube.com/','version':'1.0','thumbnail_width':480,'provider_name':'YouTube','thumbnail_url':'https://i.ytimg.com/vi/Ksd-a9lIIDc/hqdefault.jpg','height':270,'thumbnail_height':360,'html':'\n<div class=\'noembed-embed \'>\n  <div class=\'noembed-wrapper\'>\n    \n<div class=\'noembed-embed-inner noembed-youtube\'>\n  \n<iframe width=\' 480\' height=\'270\' src=\'https://www.youtube.com/embed/Ksd-a9lIIDc?feature=oembed\' frameborder=\'0\' allowfullscreen></iframe>\n\n</div>\n\n    <table class=\'noembed-meta-info\'>\n      <tr>\n        <td class=\'favicon\'><img src=\'https://noembed.com/favicon/YouTube.png\'></td>\n        <td>YouTube</td>\n        <td align=\'right\'>\n          <a title=\'https://www.youtube.com/watch?v=Ksd-a9lIIDc\' href=\'https://www.youtube.com/watch?v=Ksd-a9lIIDc\'>https://www.youtube.com/watch?v=Ksd-a9lIIDc</a>\n        </td>\n      </tr>\n    </table>\n  </div>\n</div>\n','url':'https://www.youtube.com/watch?v=Ksd-a9lIIDc','title':'LCD Soundsystem - Get Innocuous! (Soulwax Remix)','type':'video'
        /*jshint ignore:end,+W101*/
    };
    dependencies = [];

    beforeEach(module('noEmbed'));

    beforeEach(inject(function(noEmbedService, _$httpBackend_) {
        httpBackend = _$httpBackend_;
        httpBackend.when('JSONP', 'https://noembed.com/embed?callback=JSON_CALLBACK&url='+youtube_url).respond(youtube_response);
        noEmbed = noEmbedService;
    }));

    it('should retrieve the embed code for a youtube video', function() {
        noEmbed.embed(youtube_url).then(
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
