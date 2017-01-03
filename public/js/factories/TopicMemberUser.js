angular
    .module('citizenos')
    .factory('TopicMemberUser', ['$log', '$resource', 'sLocation', function ($log, $resource, sLocation) {
        $log.debug('citizenos.factory.GroupMemberTopic');

        var TopicMemberUser = $resource(
            sLocation.getAbsoluteUrlApi('/api/users/self/topics/:topicId/members/users/:userId'), // Actually Groups are added to Topic
            {topicId: '@id', groupId: '@userId'},
            {
                query: {
                    isArray: true,
                    transformResponse: function (data, headersGetter, status) {
                        if (status < 400) { // FIXME: think this error handling through....
                            return angular.fromJson(data).data.rows;
                        } else {
                            return angular.fromJson(data);
                        }
                    }
                }
            }
        );

        TopicMemberUser.LEVELS = {
            none: 'none', // Enables to override inherited permissions.
            read: 'read',
            edit: 'edit',
            admin: 'admin'
        };

        return TopicMemberUser;
    }]);
