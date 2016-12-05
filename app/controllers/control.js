/**
 * @overview This is used to control the Z-Wave controller itself and ot manage the Z-Wave network.
 * @author Martin Vach
 */

/**
 * Control root ontroller
 * @class ControlController
 *
 */
appController.controller('ControlController', function($scope, $interval,$timeout,$filter,cfg,dataService) {
    $scope.controlDh = {
        interval: null,
        show: false,
        controller:{},
        nodes:{}
    };
    /**
     * Load zwave data
     */
    $scope.loadZwaveData = function() {
        dataService.loadZwaveApiData().then(function(ZWaveAPIData) {
            setControllerData(ZWaveAPIData);
            $scope.controlDh.show = true;
            $scope.refreshZwaveData(ZWaveAPIData);
        }, function(error) {
            alertify.alertError($scope._t('error_load_data'));
        });
    };
    $scope.loadZwaveData();

    /**
     * Refresh zwave data
     * @param {object} ZWaveAPIData
     */
    $scope.refreshZwaveData = function(ZWaveAPIData) {
        var refresh = function() {
            dataService.loadJoinedZwaveData(ZWaveAPIData).then(function(response) {
                setControllerData(response.data.joined);
            }, function(error) {});
        };
        $scope.controlDh.interval = $interval(refresh, $scope.cfg.interval);
    };

    /**
     * Run zwave command
     * @param {string} cmd
     */
    $scope.runZwaveCmd = function(cmd) {
        $scope.toggleRowSpinner(cmd);
        /*alertify.alertError('Running command ' + '\n' + cmd);
        return;*/
        dataService.runZwaveCmd(cfg.store_url + cmd).then(function (response) {
            $timeout($scope.toggleRowSpinner, 1000);
        }, function (error) {
            $scope.toggleRowSpinner();
            alertify.alertError($scope._t('error_load_data') + '\n' + cmd);
        });
    }
    ;
    /// --- Private functions --- ///
    /**
     * Set controller data
     * @param {object} ZWaveAPIData
     */
    function setControllerData(ZWaveAPIData) {
        var controllerNodeId = ZWaveAPIData.controller.data.nodeId.value;
        var isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        var hasSUC = ZWaveAPIData.controller.data.SUCNodeId.value;
        var hasDevices = Object.keys(ZWaveAPIData.devices).length;

        // Custom controller settings
        $scope.controlDh.controller.hasDevices = hasDevices < 2 ? false : true;
        $scope.controlDh.controller.disableSUCRequest = true;
        if (hasSUC && hasSUC != controllerNodeId) {
            $scope.controlDh.controller.disableSUCRequest = false;
        }

        // Default controller settings
        $scope.controlDh.controller.frequency = $filter('hasNode')(ZWaveAPIData, 'controller.data.frequency.value');;
        $scope.controlDh.controller.controllerState = ZWaveAPIData.controller.data.controllerState.value;
        $scope.controlDh.controller.secureInclusion = ZWaveAPIData.controller.data.secureInclusion.value;
        $scope.controlDh.controller.isPrimary = ZWaveAPIData.controller.data.isPrimary.value;
        $scope.controlDh.controller.isRealPrimary = ZWaveAPIData.controller.data.isRealPrimary.value;
        $scope.controlDh.controller.isSIS = ZWaveAPIData.controller.data.SISPresent.value;

    }

});

/**
 * Shall inclusion be done using Security.
 * @class SetSecureInclusionController
 *
 */
appController.controller('SetSecureInclusionController', function($scope) {
    /**
     * Set inclusion as Secure/Unsecure.
     * state=true Set as secure.
     * state=false Set as unsecure.
     * @param {bool} state
     */
    $scope.setSecureInclusion = function(state) {
    };
});

/**
 * This turns the Z-wave controller into an inclusion mode that allows including a device.
 * @class IncludeDeviceController
 *
 */
appController.controller('IncludeDeviceController', function($scope) {
    /**
     * Start/stop Inclusion of a new node.
     * Turns the controller into an inclusion mode that allows including a device.
     * flag=1 for starting the inclusion mode
     * flag=0 for stopping the inclusion mode
     * @param {int} flag
     */
    $scope.addNodeToNetwork = function(flag) {
    };
});

/**
 * This turns the Z-wave controller into an exclusion mode that allows excluding a device.
 * @class ExcludeDeviceController
 *
 */
appController.controller('ExcludeDeviceController', function($scope) {
    /**
     * Start/stop Exclusion of a node.
     * Turns the controller into an exclusion mode that allows excluding a device.
     * flag=1 for starting the exclusion mode
     * flag=0 for stopping the exclusion mode
     * @param {int} flag
     */
    $scope.removeNodeToNetwork = function(flag) {
    };
});

/**
 * It will change Z-wave controller own Home ID to the Home ID of the new network
 * and it will learn all network information from the including controller of the new network.
 * All existing relationships to existing nodes will get lost
 * when the Z-Way controller joins a dierent network
 * @class IncludeNetworkController
 *
 */
appController.controller('IncludeDifferentNetworkController', function($scope,$timeout,cfg,dataService) {

    // Controller vars
    $scope.includeNetwork ={
        controllerState: 0
    };
    console.log($scope.controlDh)

    /**
     * Include to network
     * @param {string} cmd
     */
    $scope.includeToNetwork = function(cmd) {
        $scope.runZwaveCmd(cmd);
    };

    /**
     * Exclude form to network
     * @param {string} cmd
     */
    $scope.excludeFromNetwork = function(cmd,confirm) {
        alertify.confirm(confirm, function () {
            $scope.runZwaveCmd(cmd);
        });

    };

    /// --- Private functions --- ///
});

/**
 * Restore Z-Wave controller from the backup
 * @class BackupRestoreController
 *
 */
appController.controller('BackupRestoreController', function($scope, $upload, $window,deviceService,cfg,_) {
    $scope.restore = {
        allow: false,
        input: {
            restore_chip_info: '0'
        }
    };

    /**
     * Send request to restore from backup
     * todo: Replace $upload vith version from the SmartHome
     * @returns {void}
     */
    $scope.restoreFromBackup = function($files) {
        $scope.loading = {status: 'loading-spin', icon: 'fa-spinner fa-spin', message: $scope._t('restore_wait')};
        var chip = $scope.restore.input.restore_chip_info;
        var url = cfg.server_url + cfg.restore_url + '?restore_chip_info=' + chip;
        //return;
        for (var i = 0; i < $files.length; i++) {
            var $file = $files[i];
            $upload.upload({
                url: url,
                fileFormDataName: 'config_backup',
                file: $file
            }).progress(function(evt) {
                //$scope.restoreBackupStatus = 1;
            }).success(function(data, status, headers, config) {
                $scope.handleModal('restoreModal');
                if (data && data.replace(/(<([^>]+)>)/ig, "") !== "null") {//Error
                    alertify.alertError($scope._t('restore_backup_failed'));
                    //$scope.restoreBackupStatus = 3;
                } else {// Success
                    deviceService.showNotifier({message: $scope._t('restore_done_reload_ui')});
                    $window.location.reload();
                    //$scope.restoreBackupStatus = 2;
                }
            }).error(function(data, status) {
                $scope.handleModal('restoreModal');
                alertify.alertError($scope._t('restore_backup_failed'));
                //$scope.restoreBackupStatus = 3;
            });

        }
    };
});

/**
 * This controller will perform a soft restart of the firmware of the Z-Wave controller chip
 * without deleting any network information or setting.
 * @class ZwaveChipRebootController
 *
 */
appController.controller('ZwaveChipRebootController', function($scope) {
    /**
     * The reboot function - restarts Z-Wave chip
     */
    $scope.serialAPISoftReset = function() {
    };
});

/**
 * Erases all values stored in the Z-Wave chip and sent the chip back to factory defaults.
 * This means that all network information will be lost without recovery option.
 * @class ZwaveChipResetController
 *
 */
appController.controller('ZwaveChipResetController', function($scope) {
    /**
     * Send Configuration SetDefault
     */
    $scope.setDefault = function() {
    };
});

/**
 * Change Z-Wave Z-Stick 4 frequency.
 * @class ChangeFrequencyController
 *
 */
appController.controller('ChangeFrequencyController', function($scope) {
    /**
     * Send Configuration ZMEFreqChange
     * @param {string} cmd
     */
    $scope.zmeFreqChange = function(cmd) {
        $scope.runZwaveCmd(cmd);
    };
});

/**
 * The controller will then mark the device as 'failed'
 * but will keep it in the current network conguration.
 * @class RemoveFailedNodeController
 *
 */
appController.controller('RemoveFailedNodeController', function($scope) {
    /**
     * Remove failed node from network.
     * nodeId=x Node id of the device to be removed
     * @param {int} nodeId
     */
    $scope.removeFailedNode = function(nodeId) {
    };
});

/**
 * The controller replaces a failed node by a new node.
 * @class ReplaceFailedNodeController
 *
 */
appController.controller('ReplaceFailedNodeController', function($scope) {
    /**
     * Replace failed node with a new one.
     * nodeId=x Node Id to be replaced by new one
     * @param {int} nodeId
     */
    $scope.replaceFailedNode = function(nodeId) {
    };
});

/**
 * Allows marking battery-powered devices as failed.
 * @class BatteryDeviceFailedController
 *
 */
appController.controller('BatteryDeviceFailedController', function($scope) {
    /**
     * Sets the internal 'failed' variable of the device object.
     * nodeId=x Node Id to be marked as failed.
     * @param {int} nodeId
     */
    $scope.markFailedNode = function(nodeId) {
    };
});

/**
 * The controller change function allows to handover the primary function to a different controller in
 * the network. The function works like a normal inclusion function but will hand over the primary
 * privilege to the new controller after inclusion. Z-Way will become a secondary controller of the network.
 * @class ControllerChangeController
 *
 */
appController.controller('ControllerChangeController', function($scope) {
    /**
     * Set new primary controller
     * Start controller shift mode if 1 (True), stop if 0 (False)
     * @param {int} mode
     */
    $scope.controllerChange = function(mode) {
    };
});

/**
 * This will call the Node Information Frame from all devices in the network.
 * @class RequestNifAllController
 *
 */
appController.controller('RequestNifAllController', function($scope) {
    /**
     * Request Node Information Frame (NIF) of a device
     * nodeId=x Node Id to be requested for a NIF
     * @param {int} nodeId
     */
    $scope.requestNodeInformation = function(nodeId) {
    };
});

/**
 * This controller allows controlling the SUC/SIS function for the Z-Wave network.
 * @class SucSisController
 *
 */
appController.controller('SucSisController', function($scope) {
    /**
     * Get the SUC Node ID from the network.
     */
    $scope.getSUCNodeId = function() {
    };

    /**
     * Request network topology update from SUC/SIS.
     */
    $scope.requestNetworkUpdate = function() {
    };

    /**
     * Assign SUC function to a node in the network that is capable of running there SUC function
     * nodeId=x Node id to be assigned as SUC
     * @param {int} nodeId
     */
    $scope.setSUCNodeId = function(nodeId) {
    };


    /**
     * Revoke SUC/SIS role from a device
     * nodeId=x Node id to be disabled as SUC
     * @param {int} nodeId
     */
    $scope.disableSUCNodeId = function(nodeId) {
    };

    /**
     * Assign SIS role to a device
     * nodeId=x Node id to be assigned as SIS
     * @param {int} nodeId
     */
    $scope.disableSUCNodeId = function(nodeId) {
    };



});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});

/**
 * ???
 * @class ???
 *
 */
appController.controller('???Controller', function($scope) {

});