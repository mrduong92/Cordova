/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//TDD

var SERVER_URL = 'http://192.168.7.90:9293/';

$('#selectAll').click(function () {
    if ($(this).val() == 0) {
        $('input[name="massdel[]"]').prop('checked', true);
        $(this).val('1');
    } else if ($(this).val() == 1) {
        $('input[name="massdel[]"]').prop('checked', false);
        $(this).val('0');
    }
});

$('#deleteAll').on('click', function (e) {
    e.preventDefault();
    var ids = '';
    var massDel = $('input[name="massdel[]"]:checked');
    massDel.each(function (index, element) {
        ids += $(this).val();
        if (massDel.length != index + 1) {
            ids += ',';
        }
    });
    $('#massDel').find('input[name="ids"]').val(ids);
    $('#deleteModal').modal('show');

});

$('#deleteModal #accept').click(function () {
    $('#massDel').submit();
});

$("#add-user").click(function () {
    $(".wrapper").html();
    $(".wrapper").load("users/create.html");
});

//getUsers();
//$("#list-users").find("table tbody").append("Abc");
//
//function getUsers() {
//    $.ajax({
//        method: "GET",
//        url: SERVER_URL + "api/v1/users",
//        data: {},
//        beforeSend: function (xhr) {
//
//        },
//        success: function (msg) {
//            if (msg.header.status == 200) {
//                $.each(msg.data, function (key, value) {
//                    var oddOrEven = key % 2 == 0 ? "odd" : "even";
//                    var appendUser = `<tr role="row" class="` + oddOrEven + `">
//                                    <td>
//                                        <input type="checkbox" name="massdel[]" value="` + value.id + `">
//                                    </td>
//                                    <td class="sorting_1">
//                                        <a href="#">` + value.name + `</a>
//                                    </td>
//                                    <td>
//                                        <a href="#">` + value.email + `</a>
//                                    </td>
//                                    <td>1</td>
//                                </tr>`;
//                    $("#list-users").find("table tbody").append("Abc");
//                });
//            } else {
//                alert('Có lỗi xảy ra');
//            }
//        },
//        error: function (request, status, error) {
//
//        }
//    });
//}

//Angular JS

var app = angular.module("userManager", ["ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "users/index.html",
                controller: "IndexController"
            })
            .when("/create", {
                templateUrl: "users/create.html",
                controller: "CreateController"
            })
            .when("/calculator", {
                templateUrl: "calculator.html",
                controller: "CalController"
            });
});

app.service('userService', function ($scope, $http, $window) {

});

app.controller("CreateController", function ($scope, $rootScope, $http, $window, userService) {
    

    $scope.submit = function () {
        $window.location.href = '#/';
    };
});

app.controller("CalController", ['$scope', function ($scope) {
        $scope.data = {
            title: 'Calculator',
            so_thu_nhat: 'So thu nhat',
            so_thu_hai: 'So thu hai',
            mess_result: 'Ket qua',
            cong: 'Cong hai so',
            tru: 'Tru hai so',
            nhan: 'Nhan hai so',
            chia: 'Chia hai so'
        };
        $scope.show_result = function () {
            $scope.result = {
                cong: parseInt($scope.so_thu_nhat) + parseInt($scope.so_thu_hai),
                tru: parseInt($scope.so_thu_nhat) - parseInt($scope.so_thu_hai),
                nhan: parseInt($scope.so_thu_nhat) * parseInt($scope.so_thu_hai),
                chia: parseInt($scope.so_thu_nhat) / parseInt($scope.so_thu_hai)
            };
        };
    }]);

app.controller("IndexController", function ($scope, $rootScope, $http, $window) {
    $rootScope.server_url = "http://192.168.7.90:9293/";

    $rootScope.getAction = function (subdomain) {
        return $rootScope.server_url + subdomain;
    };
//    $rootScope.getUsers();
//    $rootScope.getUsers = function(){
        $http.get($rootScope.getAction("api/v1/users")).
            success(function (data, status, headers, config) {
                $rootScope.users = data;
                $rootScope.status = 200;
            }).
            error(function (data, status, headers, config) {
                $rootScope.status = 500;
            });
//    };
});