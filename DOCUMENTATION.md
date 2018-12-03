# Cordova Electron

Electron is a framework that uses web technologies (HTML, CSS, and JS) to build cross-platform desktop applications.

- [Cordova Electron](#cordova-electron)
  - [System Requirements](#system-requirements)
    - [Linux](#linux)
    - [Mac](#mac)
    - [Windows](#windows)
  - [Quick Start](#quick-start)
    - [Create a Project](#create-a-project)
    - [Preview a Project](#preview-a-project)
    - [Build a Project](#build-a-project)
  - [Customizing the Application's Main Process](#customizing-the-applications-main-process)
    - [Window Appearance (BrowserWindow)](#window-appearance-browserwindow)
      - [How to set the window default size?](#how-to-set-the-window-default-size)
      - [How to make the window not resizable?](#how-to-make-the-window-not-resizable)
      - [How to make my window fullscreen?](#how-to-make-my-window-fullscreen)
    - [DevTools](#devtools)
  - [Build Configurations](#build-configurations)
    - [Default Build Configurations](#default-build-configurations)
    - [Customizing Build Configurations](#customizing-build-configurations)
      - [Adding `target` packages](#adding-target-packages)
      - [Setting the package `arch`](#setting-the-package-arch)
    - [Multi-Platform Build Settings](#multi-platform-build-settings)
  - [Signing Configurations](#signing-configurations)
    - [macOS Signing](#macos-signing)
    - [Windows Signing](#windows-signing)
  - [Plugins](#plugins)

## System Requirements

### Linux

### Mac
* **Xcode** is the IDE for macOS also comes bundled with necessary software development tools to code signing and compile native code for macOS.

* **Homebrew** is a macOS package manager for installing additional tools and dependencies. Homebrew will be needed to install RPM packaging dependencies. [**Brew Install Step**](https://brew.sh/)

* **RPM** a standard package manager for multiple Linux distributions. This tool will be used for creating the Linux RPM package. To install this tool, use the following [**Homebrew**](https://brew.sh/) command:

  ```
  $ brew install rpm
  ```

### Windows
* **Powershell** must be at version 3.0 or greater for Windows 7 users. This [requirement](https://www.electron.build/code-signing#windows) is required for signing an app.

## Quick Start
### Create a Project
```
$ npm i -g cordova
$ cordova create sampleApp
$ cd sampleApp
$ cordova platform add electron
```

### Preview a Project

For Electron, it is not necessary to build the application for previewing. Since the building process can be slow, it is recommended to pass in the `--no-build` flag to disable the build process when previewing.

```
$ cordova run electron --no-build
```

### Build a Project
**Debug Builds**
```
$ cordova build electron
$ cordova build electron --debug
```

**Release Builds**
```
$ cordova build electron --release
```

<!-- @todo Update prepare.
Customizing the Application's Icon

In the `config.xml` file, there should be an Electron platform node with the icons defined. The example is seen as below:
```
<platform name="electron">
  <icon src="res/electron/icon.ico" />
  <icon src="res/electron/icon.icns" />
  <icon src="res/electron/32x32.png" />
</platform>
```
-->

## Customizing the Application's Main Process

In the `{PROJECT_ROOT_DIR}/platform/electron/platform_www/` directory, the file `main.js` defines the application's main process. We can customize the application's window appearance as well as define or enable features in this file.

### Window Appearance (BrowserWindow)

Electron provides many optional options that can manipulate the BrowserWindow. This section will cover a few of these options that many uses. A full list of these options can be found on the [Electron's Docs - BrowserWindow Options](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions).

#### How to set the window default size?

Using the `width` and `height` option, you can define the windows default starting height and width.

```
mainWindow = new BrowserWindow({
  width: 800,
  height: 600
});
```

#### How to make the window not resizable?

Using the `resizable` flag can disable the default behavior that allows users to resize the application's window.

```
mainWindow = new BrowserWindow({ resizable: false });
```

#### How to make my window fullscreen?

Using the `fullscreen` flag can force the application to launch in fullscreen.

```
mainWindow = new BrowserWindow({ fullscreen: true });
```

### DevTools

In the current state of the Cordova Electron platform, the `--release` and `--debug` flag does not control the ability to enable or disable the visibility of the DevTools. To enable the DevTools, in the main process file, find the line shown below and uncomment.

```
// mainWindow.webContents.openDevTools();
```

## Build Configurations

### Default Build Configurations

By default, with no additional configuration, `cordova build electron` will build default packages for the host operating system (OS) that triggers the command. Below, are the list of default packages for each OS.

**Linux**

| Package | Arch  |
| ------- | :---: |
| tar.gz  | x64   |

**Mac**

| Package | Arch  |
| ------- | :---: |
| dmg     | x64   |
| zip     | x64   |

**Windows**

| Package | Arch  |
| ------- | :---: |
| nsis    | x64   |

### Customizing Build Configurations

If for any reason you would like to customize the build configurations, the modifications are placed within the `build.json` file located in the project's root directory. E.g. `{PROJECT_ROOT_DIR}/build.json`. This file contains all build configurations for all platforms (Android, Electron, iOS, Windows).

**Example Config Structure**

```
{
  "electron": {}
}
```

Since the Electron framework can also build multiple operating systems, the `electron` node will contain three sub-properties describing build configurations for each platform.

**Example Config Structure with Each Platform**
```
{
  "electron": {
    linux: {},
    mac: {},
    windows: {}
  }
}
```

Each platform contains sub-properties that are used to identify what to build and how to sign.

These three properties are:
* `target` is a collection of target packages that will be built.
* `arch` is a collection of architectures that each target package will be built for.
* `signing` is an object that contains information necessary for the signing of the application.

#### Adding `target` packages
The `target` property is used for defining which package is to be generated from the build process.
If the target property is defined, the default target packages will no longer be built unless specified.

The example below shows how to config for macOS to build the `tar.gz` package target and the defaults (`dmg` and `zip`).

```
{
  "electron": {
    "mac": {
      "target": [
        "dmg",
        "tar.gz",
        "zip"
      ]
    },
  }
}
```

* The order of the targets has no importance.
* Undefined properties will use default values.

Using the above example, a `dmg`, `tar.gz`, and `zip` will be generated all with the `x64` architecture.

#### Setting the package `arch`
The `arch` property is used to define a collection of the architectures for each package. If the arch property is defined, the default will no longer be used unless specified.

Example:
```
{
  "electron": {
    "mac": {
      "target": [
        "dmg"
      ],
      "arch": ["ia32", "x64"]
    },
  }
}
```

The example above will generate an `ia32` and `x64` dmg.

### Multi-Platform Build Settings

> :warning: This feature is not supported by all platform and has limitation.

Building for multiple platforms on a single operating system can possible but with limitation. For full support, it is recommended that the targeted platform and host OS are identical.

The matrix below shows each host OS and for which platforms they are capable of building applications.

| Host <sup>**[1]**</sup> | Linux              | Mac                | Window                       |
| ----------------------- | :----------------: | :----------------: | :--------------------------: |
| Linux                   | :white_check_mark: |                    | :warning: <sup>**[2]**</sup> |
| Mac <sup>**[3]**</sup>  | :white_check_mark: | :white_check_mark: | :warning: <sup>**[2]**</sup> |
| Window                  |                    |                    | :white_check_mark:           |

**Limitations:**
* **[1]** If the app contains native dependency, it can only be compiled on the target platform.
* **[2]** Linux and macOS are unable to build Windows Appx packages for Windows Store.
* **[3]** [All required system dependencies, except rpm, will be downloaded automatically on demand. RPM can be installed with brew. (macOS Sierra 10.12+)](https://www.electron.build/multi-platform-build#macos)

The example below enables multi-platform build for all OS using the default build configurations.

```
{
  "electron": {
    "linux": {},
    "mac": {},
    "windows": {}
  }
}
```

## Signing Configurations

### macOS Signing

The signing information is comprised of three types. (`debug`, `release`, and `store`). Each section has the following properties:

| key | description |
|-----------------------|-----------------------|
|entitlements|String path value to entitlements file.|
|entitlementsInherit|String path value to the entitlements file which inherits the security settings. |
|identity|String value of the name of the certificate.|
|[requirements](https://developer.apple.com/library/archive/documentation/Security/Conceptual/CodeSigningGuide/RequirementLang/RequirementLang.html)|String path value of requirements file. <br /><br />:warning: This is not available for the `mas` (store) signing configurations.|
|provisioningProfile|String path value of the provisioning profile.|

**Example Config:**
```
{
  "electron": {
    "mac": {
      "target": [
        "dmg",
        "mas",
        "mas-dev",
      ],
      "signing": {
        "release": {
          "identity": "APACHE CORDOVA (TEAMID)",
          "entitlements": "build/entitlements.mac.plist",
          "entitlementsInherit": "build/entitlements.mac.inherit.plist",
          "provisioningProfile": "release.mobileprovision"
        }
      }
    },
  }
}
```

For macOS signing, there are a few exceptions to how the signing information is used.
By default, all targets with the exception of `mas` and `mas-dev`, use the `debug` and `release` signing configurations.

Using the example config above, let's go over some use cases to better understand the exceptions.

**Use Case 1:**

```
$ cordova build electron --debug
```

The command above will:
* Generate a `dmg` build and `mas-dev` build using the `debug` signing configurations.
* Ignore the `mas` target.

*Use Case 2:*

```
$ cordova build electron --release
```

The command above will:
* Generate a `dmg` build using the `release` config.
* Generate a `mas` build using the `store` config.
* Ignore the `mas-dev` target.


### Windows Signing

The signing information is comprised of two types. (`debug`, `release`). Each section has the following properties:

| key | description |
|-----------------------|-----------------------|
|certificateFile|String path value to the certificate file.|
|certificatePassword|String value of the certificate file's password. |
|certificateSubjectName|String value...|
|certificateSha1|String value...|
|signingHashAlgorithms|String value...|
|additionalCertificateFile|String value to the additional certificate files.|

**Example Config:**
```
{
  "electron": {
    "windows": {
      "target": [
        "nsis"
      ],
      "signing": {
        "release": {
          "certificateFile": "path_to_files",
          "certificatePassword": "password",
          "certificateSubjectName": "string",
          "certificateSha1": "string",
          "signingHashAlgorithms": "string",
          "additionalCertificateFile": "path_to_files"
        }
      }
    },
  }
}
```

## Plugins
All browser-based plugins are usable with the Electron platform. 

Internally, Electron is using Chromium (Chrome) as its web view. Some plugins may have condition written specifically for each browser. In this type of case, it may affect the behavior from what is intended. Since Electron may support feature that the browser does not, these plugins would need to be updated for Electron.

When adding a plugin, if the plugin supports both Electron and Browser, the Electron portion will be used. If the plugin contains the browser platform, but missing Electron, the browser platform will be used.