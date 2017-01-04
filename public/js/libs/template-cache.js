/** AUTOGENERATED BY GULP templatecache TASK **/ 

angular
    .module('citizenos')
    .run(['$log', '$http', '$templateCache', function ($log, $http, $templateCache) {
        var templates = [
            '/views/about.html',
            '/views/faq.html',
            '/views/groups.html',
            '/views/help.html',
            '/views/home.html',
            '/views/my.html',
            '/views/my_groups_groupId.html',
            '/views/my_topics_topicId.html',
            '/views/mytopics.html',
            '/views/mytopics_view.html',
            '/views/no_groups.html',
            '/views/no_topics.html',
            '/views/topics.html',
            '/views/default/nav.html',
            '/views/default/nav_mobile.html',
            '/views/default/search.html',
            '/views/layouts/main.html',
            '/views/modals/add_topics.html',
            '/views/modals/confirm.html',
            '/views/modals/date_picker.html',
            '/views/modals/group_create.html',
            '/views/modals/group_delete_confirm.html',
            '/views/modals/group_member_topic_delete_confirm.html',
            '/views/modals/group_member_user_delete_confirm.html',
            '/views/modals/group_member_user_leave_confirm.html',
            '/views/modals/input_test.html',
            '/views/modals/invite_users.html',
            '/views/modals/login.html',
            '/views/modals/login_esteid.html',
            '/views/modals/my_account.html',
            '/views/modals/password_forgot.html',
            '/views/modals/password_reset.html',
            '/views/modals/set_number.html',
            '/views/modals/sign_up.html',
            '/views/modals/topic_delete_confirm.html',
            '/views/modals/topic_member_group_delete_confirm.html',
            '/views/modals/topic_vote_sign.html',
        ];
        var i = 0;
        if (templates.length) {
            downloadToCache();
        }
        function downloadToCache() {
            var template = templates[i];
            $http
                .get(template, {
                    ignoreLoadingBar: true
                })
                .then(
                    function (response) {
                        $templateCache.put(response.config.url, response.data);
                        $log.debug('cached page', response.config.url);

                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    },
                    function (err) {
                        $log.error('error', err);
                        if (++i < templates.length) {
                            downloadToCache();
                        }
                    }
                );
        }
    }]);