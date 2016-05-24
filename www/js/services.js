angular.module('starter.services', [])

    .factory('Websites', function ($q, $http) {
        return {
            all: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;
                console.log("dateeee"+new Date().getTime()/100);
                // $http.jsonp(host_url+"/albert/mobile/websites?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                $http.jsonp("http://www.toutiao.com/api/article/recent/?count=10&max_behot_time="+new Date().getTime()/1000+"&callback=JSON_CALLBACK")
                    .success(function (data) {
                        d.resolve(data.data);
                    })
                    .error(function (error) {
                        console.log("fail");
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            allTestSpeed: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;

                $http.jsonp("http://api.shequshangdian.com/website/GetAllSitesTestSpeed?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        $scope.testspeeddata = data;
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            allSearchEngine: function ($scope) {
                var d = $q.defer();
                var promise = d.promise;

                $http.jsonp("http://api.shequshangdian.com/website/GetAllSitesSearchEngine?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        $scope.websitesearchengine = data;
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            add: function ($scope) {
                //add new website
                var d = $q.defer();
                var promise = d.promise;

                $http.jsonp("http://api.shequshangdian.com/website/AddWebsite?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&url=" + $scope.data.siteurl + "&name=" + $scope.data.sitename + "&callback=JSON_CALLBACK")
                    .success(function (data) {
                        d.resolve(data);
                    })
                    .error(function (error) {
                        d.reject(error);
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }

                return d.promise;
            },
            remove: function (allsites, site) {
                //执行数据库的删除
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp("http://api.shequshangdian.com/website/DeleteWebsite?userId=" + localStorage.userid + "&signToken=" + localStorage.signtoken + "&siteId=" + site.SiteId + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        //UI删除
                        allsites.splice(allsites.indexOf(site), 1);
                    });

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
            }
        };
    })

    .service('LoginService', function ($q, $http,sha256) {

        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                var loginResult = new Object();
                var salt = "";
                $http.jsonp(host_url+"/albert/mobile/salt/"+name+ "?callback=JSON_CALLBACK")
                    .success(function(data){
                        salt = data.results;

                        $http.jsonp(host_url+"/albert/mobile/login?username="+ name +"&password="+ sha256.convertToSHA256(pw+salt) + "&callback=JSON_CALLBACK")
                        .success(function (response) {
                            loginResult = response;
                            if (loginResult.error == 0) {
                                localStorage.signtoken = loginResult.results;
                                localStorage.userid = name;

                                //设置客户端的别名，用于定向接收消息的推送
                                window.plugins.jPushPlugin.setAlias("Client" + name);

                                deferred.resolve('Welcome ' + name + '!');
                            } else {
                                deferred.reject('Wrong credentials.');
                            }
                        });

                    });

               
                //ajax请求
                
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },

            register: function (email, name, password) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp("http://api.shequshangdian.com/account/Register?email=" + email + "&username=" + name + "&password=" + password + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (response == 1) {
                            deferred.resolve('register successfully');
                        } else {
                            deferred.reject('Wrong register info.');
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },
            resetpassword: function (email) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                //ajax请求
                $http.jsonp("http://api.shequshangdian.com/account/resetpassword?email=" + email + "&callback=JSON_CALLBACK")
                    .success(function (response) {
                        if (response == 1) {
                            deferred.resolve('reset password successfully');
                        } else {
                            deferred.reject('Wrong request');
                        }
                    });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    });
