'use strict';

angular
    .module('citizenos')
    .service('sAuth', ['$http', '$q', '$log', 'sLocation', function ($http, $q, $log, sLocation) {
        var sAuth = this;

        sAuth.user = {
            loggedIn: false,
            isLoading: true
        };

        var defaultSuccess = function (response) {
            return response.data;
        };

        var defaultError = function (response) {
            return $q.reject(response);
        };

        sAuth.signUp = function (email, password, name, company, redirectSuccess) {
            var data = {
                email: email,
                password: password,
                name: name,
                company: company,
                redirectSuccess: redirectSuccess
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/signup');
            return $http.post(path, data).then(defaultSuccess, defaultError);
        };

        sAuth.login = function (email, password) {
            var data = {
                email: email,
                password: password
            };

            var success = function (response) {
                sAuth.user.loggedIn = true;
                angular.extend(sAuth.user, response.data.data);
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/login');
            return $http.post(path, data).then(success, defaultError);
        };

        sAuth.loginMobiilIdInit = function (pid, phoneNumber) {
            var data = {
                pid: pid,
                phoneNumber: phoneNumber
            };

            var success = function (response) {
                return response.data.data;
            };


            var path = sLocation.getAbsoluteUrlApi('/api/auth/mobile/init');
            return $http.post(path, data).then(success, defaultError);
        };

        sAuth.linkMobiilIdInit = function (pid, phoneNumber) {
            var data = {
                pid: pid,
                phoneNumber: phoneNumber
            };

            var success = function (response) {
                return response.data.data;
            };


            var path = sLocation.getAbsoluteUrlApi('/api/auth/link/mid');
            return $http.post(path, data).then(success, defaultError);
        };

        sAuth.loginMobiilIdStatus = function (token) {
            var success = function (response) {
                if ([20002, 20003].indexOf(response.data.status.code) > -1) {
                    sAuth.user.loggedIn = true;
                    angular.extend(sAuth.user, response.data.data);
                }
                return response;
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/mobile/status');
            return $http.get(path, {params: {token: token}}).then(success, defaultError);
        };

        sAuth.linkMobiilIdStatus = function (token) {
            var success = function (response) {
                if ([20002, 20003].indexOf(response.data.status.code) > -1) {
                    sAuth.user.loggedIn = true;
                    angular.extend(sAuth.user, response.data.data);
                }
                return response;
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/link/mid/callback');
            return $http.get(path, {params: {token: token}}).then(success, defaultError);
        };

        sAuth.loginSmartIdInit = function (pid, countryCode) {
            var data = {
                pid: pid,
                countryCode:countryCode
            };

            var success = function (response) {
                return response.data.data;
            };


            var path = sLocation.getAbsoluteUrlApi('/api/auth/smartid/init');
            return $http.post(path, data).then(success, defaultError);
        };

        sAuth.linkedAccounts = function () {
            var path = '/api/:userId/auth/link'.replace(':userId',sAuth.user.id);
            var path = sLocation.getAbsoluteUrlApi(path);
            return $http.get(path).then(defaultSuccess, defaultError);
        };

        sAuth.linkInfo = function (connectionId, token) {
            var path = sLocation.getAbsoluteUrlApi('/api/auth/link/:connectionId/info').replace(':connectionId', connectionId);
            return $http.get(path, {params: {token: token}}).then(defaultSuccess, defaultError);
        };

        sAuth.confirmLinkAccount = function (connectionId, token) {
            var path = sLocation.getAbsoluteUrlApi('/api/auth/link/:connectionId?token=:token').replace(':connectionId', connectionId).replace(':token', token);
            return $http.get(path).then(defaultSuccess, defaultError);
        };

        sAuth.loginSmartIdStatus = function (token) {
            var success = function (response) {
                if ([20002, 20003].indexOf(response.data.status.code) > -1) {
                    sAuth.user.loggedIn = true;
                    angular.extend(sAuth.user, response.data.data);
                }
                return response;
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/smartid/status');
            return $http.get(path, {params: {token: token}}).then(success, defaultError);
        };

        sAuth.loginIdCard = function () {
            var success = function (response) {
                $log.debug('Auth.loginId', 'success');
                if ([20002, 20003].indexOf(response.data.status.code) > -1) {
                    sAuth.user.loggedIn = true;
                    angular.extend(sAuth.user, response.data.data);
                }
                return response;
            };

            return $http
                .get('https://id.citizenos.com/authorize', {withCredentials: true}) // withCredentials so that client certificate is sent
                .then(function (response) {
                    var path = sLocation.getAbsoluteUrlApi('/api/auth/id');
                    return $http.post(path, response.data.data);
                })
                .then(success, defaultError);
        };

        sAuth.linkIdCard = function () {
            var success = function (response) {
                console.log(response.data);
                $log.debug('Auth.linkId', 'success');
                if ([20002, 20003].indexOf(response.data.status.code) > -1) {
                    /*sAuth.user.loggedIn = true;
                    angular.extend(sAuth.user, response.data.data);*/
                }
                return response;
            };

            return $http
                .get('https://id.citizenos.com/authorize', {withCredentials: true}) // withCredentials so that client certificate is sent
                .then(function (response) {
                    var path = sLocation.getAbsoluteUrlApi('/api/auth/link/id');
                    return $http.post(path, response.data.data);
                })
                .then(success, defaultError);
        };

        sAuth.link = function (connectionId) {
            var path = sLocation.getAbsoluteUrlApi('/api/auth/link/:connectionId/init'.replace(':connectionId', connectionId));
            location.href = path;
        }

        sAuth.unLink = function (connectionId, connectionUserId) {
            var path = sLocation.getAbsoluteUrlApi('/api/users/self/connections/:connectionId/:connectionUserId'.replace(':connectionId', connectionId).replace(':connectionUserId', connectionUserId));

            return $http
                .delete(path)
                .then(defaultSuccess, defaultError);
        };

        sAuth.logout = function () {
            var success = function (response) {
                // Delete all user data except login status.
                // Cant reference a new object here as Angular looses bindings.
                angular.forEach(sAuth.user, function (value, key) {
                    if (key !== 'loggedIn') {
                        delete sAuth.user[key];
                    }
                });
                sAuth.user.loggedIn = false;
                return response;
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/logout');
            return $http.post(path).then(success, defaultError);
        };

        sAuth.status = function () {
            var success = function (response) {
                $log.debug('sAuth.status', response);
                angular.extend(sAuth.user, response.data.data);
                sAuth.user.loggedIn = true;
                sAuth.user.isLoading = false;
                return response.data.data;
            };

            var error = function (response) {
                sAuth.user.isLoading = false;
                return defaultError(response);
            };

            var path = sLocation.getAbsoluteUrlApi('/api/auth/status');
            return $http.get(path).then(success, error);
        };

        sAuth.passwordResetSend = function (email) {
            var path = sLocation.getAbsoluteUrlApi('/api/auth/password/reset/send');
            return $http.post(path, {email: email}).then(defaultSuccess, defaultError);
        };

        sAuth.passwordReset = function (email, password, passwordResetCode) {
            var path = sLocation.getAbsoluteUrlApi('/api/auth/password/reset');
            return $http.post(path, {email: email, password: password, passwordResetCode: passwordResetCode}).then(defaultSuccess, defaultError);
        };

        sAuth.getUrlPrefix = function () {
            if(sAuth.user.loggedIn) {
                return 'users';
            }
            return null;
        };

        sAuth.getUrlUserId = function () {
            if(sAuth.user.loggedIn) {
                return 'self';
            }
            return null;
        };

    }]);
