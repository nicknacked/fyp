export default {
    user: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/dashboard',
                    icon: 'feather icon-home',
                },
                {
                    id: 'interests',
                    title: 'Interests',
                    type: 'item',
                    url: '/interests',
                    icon: 'feather icon-home',
                },
                {
                    id: 'classes',
                    title: 'Available Classes',
                    type: 'item',
                    url: '/class/list',
                    icon: 'feather icon-home',
                },
                {
                    id: 'classes_enrolled',
                    title: 'Enrolled Classes',
                    type: 'item',
                    url: '/enrolled/class/list',
                    icon: 'feather icon-home',
                },
                {
                    id: 'user_topics',
                    title: 'General Topics',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'listUserTopics',
                            title: 'List',
                            type: 'item',
                            url: '/user/general/topics/list'
                        }
                    ]
                }
            ]
        }
    ],
    faculty: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/home',
                    icon: 'feather icon-home',
                },
                {
                    id: 'classes',
                    title: 'Classes',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'createClass',
                            title: 'Create',
                            type: 'item',
                            url: '/faculty/class/create'
                        },
                        {
                            id: 'listClasses',
                            title: 'List',
                            type: 'item',
                            url: '/faculty/class/list'
                        }
                    ]
                },
                {
                    id: 'topics',
                    title: 'General Topics',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'createTopics',
                            title: 'Create',
                            type: 'item',
                            url: '/faculty/topic/general/create'
                        },
                        {
                            id: 'listTopics',
                            title: 'List',
                            type: 'item',
                            url: '/faculty/topic/general/list'
                        }
                    ]
                }
            ]
        }
    ],
    admin: [
        {
            id: 'navigation',
            title: 'Navigation',
            type: 'group',
            icon: 'icon-navigation',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/admin/dashboard',
                    icon: 'feather icon-home',
                },
                {
                    id: 'interests',
                    title: 'Interests',
                    type: 'item',
                    url: '/admin/interest',
                    icon: 'feather icon-box',
                },
                {
                    id: 'students',
                    title: 'Students',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'listStudents',
                            title: 'List',
                            type: 'item',
                            url: '/admin/student/list'
                        }
                    ]
                },
                {
                    id: 'teachers',
                    title: 'Teachers',
                    type: 'collapse',
                    icon: 'feather icon-box',
                    children: [
                        {
                            id: 'listTeachers',
                            title: 'List',
                            type: 'item',
                            url: '/admin/teacher/list'
                        },
                        {
                            id: 'create',
                            title: 'Create',
                            type: 'item',
                            url: '/admin/teacher/create'
                        }
                    ]
                }
            ]
        }
    ]
}