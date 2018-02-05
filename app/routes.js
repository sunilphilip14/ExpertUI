/**
 * Angular route specifications
 * @author Martin Vach
 */

//Define Routing for app
angApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.// Login
        when('/', {
            templateUrl: 'app/views/auth/auth_installer.html'
        }).// Home
        when('/home', {
            requireLogin: true,
            templateUrl: 'app/views/home/home_installer.html'
        }).// License
        when('/licence', {
            requireLogin: true,
            templateUrl: 'app/views/pages/license.html'
        }).// UZB
        when('/uzb', {
            requireLogin: true,
            templateUrl: 'app/views/pages/uzb.html'
        }).// Help
        when('/help/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/help/help.html'
        }).// Device
        when('/device/status', {
            requireLogin: true,
            templateUrl: 'app/views/device/status.html'
        }).when('/device/battery', {
            requireLogin: true,
            templateUrl: 'app/views/device/battery.html'
        }).when('/device/type', {
            requireLogin: true,
            templateUrl: 'app/views/device/type.html'
        }).when('/device/type', {
            requireLogin: true,
            templateUrl: 'app/views/device/type.html'
        }).when('/device/associations', {
            requireLogin: true,
            templateUrl: 'app/views/device/associations.html'
        }).when('/device/security', {
            requireLogin: true,
            templateUrl: 'app/views/device/security.html'
        }).// Config
        when('/config/configuration/:nodeId?', {
            requireLogin: true,
            template: ' ',
            controller: 'ConfigRedirectController'
        }).// New Configuration
        when('/configuration/interview/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/interview.html'
        }).when('/configuration/configuration/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/configuration.html'
        }).when('/configuration/assoc/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/association/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/assoc.html'
        }).when('/configuration/commands/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/commands.html'
        }).when('/configuration/firmware/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/firmware.html'
        }).when('/configuration/postfix/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/postfix.html'
        }).when('/configuration/health/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/configuration/health.html'
        }).// Network
        when('/network/control', {
            requireLogin: true,
            templateUrl: 'app/views/network/control/control_installer.html'
        }).when('/network/neighbors', {
            requireLogin: true,
            templateUrl: 'app/views/network/neighbors.html'
        }).when('/network/routing', {
            requireLogin: true,
            templateUrl: 'app/views/network/routing.html'
        }).when('/network/timing', {
            requireLogin: true,
            templateUrl: 'app/views/network/timing.html'
        }).when('/network/controller', {
            requireLogin: true,
            templateUrl: 'app/views/network/controller_installer.html'
        }).when('/network/queue', {
            requireLogin: true,
            templateUrl: 'app/views/network/queue.html'
        }).when('/network/routemap', {
            templateUrl: 'app/views/network/routemap.html'
        }).when('/network/map', {
            templateUrl: 'app/views/network/map.html'
        }).when('/network/statistics', {
            requireLogin: true,
            templateUrl: 'app/views/network/statistics.html',
        }).when('/network/linkstatus', {
            requireLogin: true,
            templateUrl: 'app/views/network/linkstatus.html',
        }).when('/network/linkhealth/:nodeId?', {
            requireLogin: true,
            templateUrl: 'app/views/network/link_health.html'
        }).// Installer - zniffer
        when('/installer/zniffer', {
            requireLogin: true,
            templateUrl: 'app/views/installer/zniffer.html'
        }).// Installer - history
        when('/installer/history', {
            requireLogin: true,
            templateUrl: 'app/views/installer/history.html'
        }).// Installer - RSSI
        when('/installer/rssi', {
            requireLogin: true,
            templateUrl: 'app/views/installer/rssi_background.html'
        }).
        when('/installer/rssimeter', {
            requireLogin: true,
            templateUrl: 'app/views/installer/rssi_meter.html'
        }).// Settings
        when('/settings', {
            requireLogin: true,
            templateUrl: 'app/views/settings/settings_installer.html'
        }).// Print
        when('/print', {
            requireLogin: true,
            templateUrl: 'app/views/print/print.html'
        }).// Error page
        when('/error/:code?', {
            requireLogin: true,
            templateUrl: 'app/views/error.html'
        }).// Logout
        when('/logout', {
            requireLogin: true,
            templateUrl: 'app/views/auth/logout_installer.html'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);