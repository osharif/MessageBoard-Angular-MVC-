/// <reference path="C:\Users\1\documents\visual studio 2013\Projects\MessageBoard\MessageBoard\templates/topicsView.html" />

//home-index.js

var appMainModule = angular.module('homeIndex', ['ngRoute']);

appMainModule.config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "topicsController",
        templateUrl: "/templates/topicsView.html"
    }).when("/newmessage", {
        controller: "newTopicController",
        templateUrl: "/templates/newTopicView.html"
    }).when("/message/:id", {
        controller: "singleTopicController",
        templateUrl: "templates/singleTopicView.html" 
    })
        .otherwise({ redirectTo: "/" });
});

appMainModule.factory("dataService", function ($http, $q) {
    
    var _topics = [];
    var _isInit = false;

    var _isReady = function () {
        return _isInit;
    };

    var _getTopics = function () {

        var deferred = $q.defer();

        $http.get("api/v1/topics?includeReplies=true")
        .then(function (result) {
            //successful
            angular.copy(result.data, _topics);
            _isInit = true;
            deferred.resolve();
            },
            function () {
            //error
            deferred.reject();
            });
        return deferred.promise;
    };

    var _addTopic = function (newTopic) {

        var deferred = $q.defer();

        $http.post("api/v1/topics", newTopic)
        .then(function (result) {
            //success
            var newlyCreatedTopic = result.data;
            _topics.splice(0, 0, newlyCreatedTopic);
            deferred.resolve(newlyCreatedTopic);
        },
        function () {
            //error
            deferred.reject();
        });

        return deferred.promise;
    };

    function _findTopic(id) {
        var found = null;

        $.each(_topics, function (i, item) {
            if (item.id==id) {
                found = item;
                return false;
            }
        });

        return found;
    };

    var _getTopicById = function (id) {
        var deferred = $q.defer();

        if (_isReady()) {
                var topic = _findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                } else {
                    deferred.reject();
                }
        } else {
            _getTopics()
            .then(function () {
                //Success
                var topic = _findTopic(id);
                if (topic) {
                    deferred.resolve(topic);
                } else {
                    deferred.reject();
                }
            }, function () {
                //Error
                deferred.reject();
            });
        }
            

        return deferred.promise;
    };

    var _saveReply = function (topic, newReply) {
        var deferred = $q.defer();

        $http.post("/api/v1/topics/" + topic.id + "/replies", newReply)
        .then(function (result) {
            //Success
            if (topic.replies == null) topic.replies = [];

            topic.replies.push(result.data);
            deferred.resolve(result.data);
        }, function () {
            //Error
            deferred.reject();
        });

        return deferred.promise;
    };

    return {
        topics: _topics,
        getTopics: _getTopics,
        addTopic: _addTopic,
        isReady: _isReady,
        getTopicById: _getTopicById,
        saveReply: _saveReply
    };
});

appMainModule.controller("topicsController", function ($scope, $http, dataService) {
    //$scope.name = "Sharif O7";

    $scope.data = dataService;
    $scope.isBusy = false;

    if (dataService.isReady() == false) {
        $scope.isBusy = true;
        dataService.getTopics()
            .then(function () {
                //success

            },
            function () {
                //error
                alert("could not load topics");
            })
        .then(function () {
            $scope.isBusy = false;
        });
    }
});

appMainModule.controller("newTopicController", function ($scope, $http, $window, dataService) {
    $scope.newTopic = {};

    $scope.save = function () {
        
        dataService.addTopic($scope.newTopic)
        .then(function () {
            //Success
            $window.location = "#/";
        }, 
        function () {
            //Error
            alert("colud not save the new topic");
        });
        
    };
});

appMainModule.controller("singleTopicController", function ($scope, dataService, $window, $routeParams) {
    $scope.topic = null;
    $scope.newReply = {};

    dataService.getTopicById($routeParams.id)
    .then(function (topic) {
        //Success
        $scope.topic = topic;
    },
    function () {
        //Error
        $window.location = "#/";
    });

    $scope.addReply = function () {
        dataService.saveReply($scope.topic, $scope.newReply)
        .then(function () {
            //Success\
            $scope.newReply.body="";
        },
        function () {
            //Error
            alert("could not save the new reply");
        });
    };

});

