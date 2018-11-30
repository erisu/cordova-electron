# Cordova Electron

- [Cordova Electron](#cordova-electron)
  - [System Requirements](#system-requirements)
    - [Linux](#linux)
    - [Mac](#mac)
    - [Windows](#windows)
    - [Multi Platform Build Support](#multi-platform-build-support)
  - [Quick Start](#quick-start)
    - [Create a Project](#create-a-project)
    - [Preview a Project](#preview-a-project)
    - [Build a Project](#build-a-project)
      - [Debug Builds](#debug-builds)
      - [Release Builds](#release-builds)
  - [Customizing the Application's Icon](#customizing-the-applications-icon)
  - [Customizing the Application's Main Process](#customizing-the-applications-main-process)
    - [Window Appearance (BrowserWindow)](#window-appearance-browserwindow)
      - [How to set the window default size?](#how-to-set-the-window-default-size)
      - [How to make the window not resizable?](#how-to-make-the-window-not-resizable)
      - [How to make my window fullscreen?](#how-to-make-my-window-fullscreen)
    - [DevTools](#devtools)
  - [Building Configurations](#building-configurations)
    - [Defaults](#defaults)
      - [Linux](#linux-1)
      - [Mac](#mac-1)
      - [Windows](#windows-1)
    - [Adding Package Targets](#adding-package-targets)
    - [Building for Multiple OS](#building-for-multiple-os)
    - [Setting the Archutechture](#setting-the-archutechture)
  - [Signing Configurations](#signing-configurations)
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

*

### Windows
* **Powershell** must be updated to version 3.0 or greater for Windows 7 users.

### Multi Platform Build Support

Building for multiple platforms on a single operating system can possible but with limitation. For full support, it is recommended that the targeted platform and host OS are identical.

The matrix below shows each host OS and for which platforms they are capable of building applications.

| Host <sup>**[1]**</sup> | Linux              | Mac                | Window                       |
| ----------------------- | :----------------: | :----------------: | :--------------------------: |
| Linux                   | :white_check_mark: |                    | :warning: <sup>**[2]**</sup> |
| Mac <sup>**[3]**</sup>  | :white_check_mark: | :white_check_mark: | :warning: <sup>**[2]**</sup> |
| Window                  |                    |                    | :white_check_mark:           |

**Limitations:**
* **[1]** If the app contains native dependency, it can only be compiled on the target platform.
* **[2]** Linux and macOS is unable to build Windows Appx packages for Windows Store.
* **[3]** [All required system dependencies, except rpm, will be downloaded automatically on demand. RPM can be installed with brew. (macOS Sierra 10.12+)](https://www.electron.build/multi-platform-build#macos)

## Quick Start
### Create a Project
```
$ npm i -g cordova
$ cordova create sampleApp
$ cd sampleApp
$ cordova platform add electron
```

### Preview a Project
```
$ cordova run electron --no-build
```

For Electron, it is not necessary to build the application before previewing. Since the building process can be slow, it is recommended to use the `--no-build` flag when previewing to disable the build process.

### Build a Project
#### Debug Builds
```
$ cordova build electron
$ cordova build electron --debug
```

#### Release Builds
```
$ cordova build electron --release
```

**Difference between macOS and Mac Apple Store:**

See the Signing Configurations on how to setup.

<!-- @todo Update prepare.
## Customizing the Application's Icon

In the `config.xml` file, there should be an Electron platform node with the icons defined. Example seen as below:
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

Electron provides many optional options that can be used to manipulate the BrowserWindow. In this section, we will only cover a few of the options that many use. A full list of options can be found at [Electron's Docs - BrowserWindow Options](https://electronjs.org/docs/api/browser-window#new-browserwindowoptions)

#### How to set the window default size?

Using the `width` and `height` option, you can define the windows default starting height and width.

```
mainWindow = new BrowserWindow({
  width: 800,
  height: 600
});
```

#### How to make the window not resizable?

Using the `resizable` flag, you can diable the default behavor that allows the application window to be resizable.

```
mainWindow = new BrowserWindow({ resizable: false });
```

#### How to make my window fullscreen?

Using the `fullscreen` flag, you can change the default behavor that will force your application to load in fullscreen.

```
mainWindow = new BrowserWindow({ fullscreen: true });
```

### DevTools

In the current state of the Cordova Electron platform, the `--release` and `--debug` flag does not controll the ability to enable or disable the visibility of the DevTools. To enable the DevTools, in the main process file, find the line shown below and uncomment.

```
// mainWindow.webContents.openDevTools();
```

## Building Configurations

### Defaults
By default, with no additional configuration, `cordova build electron` will build the default packages for the host operating system (OS) that runs the command. Below, are the default packages for each OS.

#### Linux

| Package | Arch  |
| ------- | :---: |
| tar.gz  | x64   |

#### Mac

| Package | Arch  |
| ------- | :---: |
| dmg     | x64   |
| zip     | x64   |

#### Windows

| Package | Arch  |
| ------- | :---: |
| nsis    | x64   |

### Adding Package Targets
when you add a package, the defaults will not be built. For example if you want a tar.gz for mac but you still want a dmg and zip, you will need to add all three.

Defining your own target..
```
{
  "electron": {
    "mac": {
      "target": [
        "tar.gz"
      ]
    },
  }
}
```
Any values that are not defined, for example `arch`, the default (`x64`) will be used.

### Building for Multiple OS
If you want to build for multiple os and use the defaults, you only need to define the target OS with no options.

```
{
  "electron": {
    "linux": {},
    "mac": {},
    "windows": {}
  }
}
```

### Setting the Archutechture

## Signing Configurations

```
{
  "electron": {
    "mac": {
      "target": [
        "dmg",  // use debug or release
        "mas", // use only store
        "mas-dev", // use debug
      ],
      "signing": {
        "debug": {

        },
        "release": {

        },
        "store": {

        }
      }
    },
  }
}
```

```
$ cordova build electron --debug
```

* dmg => debug
* mas-dev => debug
* mas => *iggnored*

```
$ cordova build electron --release
```

* dmg => release
* mas-dev => *iggnored*
* mas => store

## Plugins

All browser based plugins are usable with the Electron platform. 

Internally, Electron is using Chromium (Chrome) as its web view. Some plugins may have condition written specificly for each browser. In this tpye of case, it may affect the behaviou from what is intended. Since Electron may support feature that the browser does not, these plugins would need to be updated for Electron.

When adding a plugin, if the plugin supports both Electron and Browser, the Electron portion will be used. If there is browser, but no Electron, browser will be used.

