angular
    .module('citizenos')
    .directive('cosDisabled', ['$log', function ($log) {
        return {
            restrict: 'A',
            scope: {
                cosDisabled: '='
            },
            priority: -10,
            link: function (scope, elem, attrs) {
                var classDisabled = 'disabled';

                var update = function () {
                    if (scope.cosDisabled) {
                        elem.addClass(classDisabled);
                    } else {
                        elem.removeClass(classDisabled);
                    }
                };

                elem.on('click', function (e) {
                    if (scope.cosDisabled) {
                        e.stopImmediatePropagation();
                    }
                });

                scope.$watch(function () {
                    return scope.cosDisabled;
                }, function () {
                    update();
                });

            }
        }
    }]);

