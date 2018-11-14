/*
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
*/

const fs = require('fs-extra');
const path = require('path');

function deepMerge (mergeTo, mergeWith) {
    for (const property in mergeWith) {
        if (Object.prototype.toString.call(mergeWith[property]) === '[object Object]') {
            mergeTo[property] = deepMerge((mergeTo[property] || {}), mergeWith[property]);
        } else if (Object.prototype.toString.call(mergeWith[property]) === '[object Array]') {
            mergeTo[property] = [].concat((mergeTo[property] || []), mergeWith[property]);
        } else {
            mergeTo[property] = mergeWith[property];
        }
    }

    return mergeTo;
}

const PLATFORM_MAPPING = {
    linux: 'linux',
    mac: 'darwin',
    windows: 'win32'
};

class ElectronBuilder {
    constructor (buildOptions, api) {
        this.api = api;
        this.isDevelopment = buildOptions.debug;
        this.buildConfig = buildOptions && buildOptions.buildConfig && fs.existsSync(buildOptions.buildConfig) ? require(buildOptions.buildConfig) : false;
    }

    configure () {
        this.buildSettings = this.configureUserBuildSettings()
            .configureBuildSettings();

        // Replace the templated placeholders with the project defined settings into the buildSettings.
        this.injectProjectConfigToBuildSettings();

        return this;
    }

    configureUserBuildSettings (buildOptions) {
        if (this.buildConfig && this.buildConfig.electron) {
            let userBuildSettings = {};

            for (const platform in this.buildConfig.electron) {
                if(platform !== 'mac' && platform !== 'linux' && platform !== 'windows') continue;

                if(Object.keys(this.buildConfig.electron[platform]).length === 0) {
                    // user is looking for this platform to be built but with default configurations.
                    userBuildSettings = deepMerge(userBuildSettings, this.fetchPlatformDefaults(PLATFORM_MAPPING[platform]));
                } else if (!this.buildConfig.electron[platform].package && !this.buildConfig.electron[platform].arch) {
                    throw `The platform "${platform}" contains an invalid property. Valid properties are: package, arch`;
                } else {
                    userBuildSettings[platform] = [];

                    if (!userBuildSettings.config) userBuildSettings.config = {};

                    userBuildSettings.config[platform] = {
                        type: '${BUILD_TYPE}',
                        target: []
                    }

                    if (this.buildConfig.electron[platform].package) {
                        this.buildConfig.electron[platform].package.forEach((target) => {
                            userBuildSettings.config[platform].target.push({
                                target,
                                arch: this.buildConfig.electron[platform].arch || ['x64']
                            });
                        })
                    } else {
                        // handle missing platform case.
                        // const platformDefaults = this.fetchPlatformDefaults(PLATFORM_MAPPING[platform]);
                        // userBuildSettings.config[platform].target.push({
                        //     target: platformDefaults.config[platform].target[0].,
                        //     arch: this.buildConfig.electron[platform].arch || ['x64']
                        // });
                    }
                }
            }

            this.userBuildSettings = userBuildSettings;
        }

        return this;
    }

    configureBuildSettings () {
        const baseConfig = require(path.resolve(__dirname, './build/base.json'));
        const platformConfig = this.userBuildSettings || this.fetchPlatformDefaults(process.platform);

        return deepMerge(baseConfig, platformConfig);
    }

    injectProjectConfigToBuildSettings () {
        // const isDevelopment = false;
        const packageJson = require(path.join(this.api.locations.www, 'package.json'));
        const userConfig = {
            APP_ID: packageJson.name,
            APP_TITLE: packageJson.displayName,
            APP_WWW_DIR: this.api.locations.www,
            APP_BUILD_DIR: this.api.locations.build,
            BUILD_TYPE: this.isDevelopment ? 'development' : 'distribution'
        };

        // convert to string for string replacement
        let buildSettingsString = JSON.stringify(this.buildSettings);

        Object.keys(userConfig).forEach((key) => {
            const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
            const value = userConfig[key].replace(/\\/g, `\\\\`);
            buildSettingsString = buildSettingsString.replace(regex, value);
        });

        // update build settings with formated data
        this.buildSettings = JSON.parse(buildSettingsString);

        return this;
    }

    fetchPlatformDefaults (platform) {
        const platformFile = path.resolve(__dirname, `./build/${platform}.json`);

        if (!fs.existsSync(platformFile)) {
            throw `Your platform "${platform}" is not supported as a default target platform for Electron.`;
        }

        return require(platformFile);
    }

    build () {
        return require('electron-builder').build(this.buildSettings);
    }
}

module.exports.run = (buildOptions, api) => require('./check_reqs')
    .run()
    .then(() => {
        (new ElectronBuilder(buildOptions, api))
            .configure()
            .build();
    })
    .catch((error) => {
        console.log(error);
    });

module.exports.help = () => {
    console.log('Usage: cordova build electron');
    console.log('Packages your app for distribution, or running locally.');
};
