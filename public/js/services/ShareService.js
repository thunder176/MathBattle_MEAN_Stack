angular.module('ShareService', []).
    factory('shareFactory', function () {
        var value = '';
        return {
            getVal: function () {
                return value;
            },
            setVal: function (data) {
                value = data;
            }
        }
    });