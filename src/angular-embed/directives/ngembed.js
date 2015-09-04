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