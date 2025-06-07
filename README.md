# ARCHIVE NOTICE

## TL;DR - This project is looking for maintainers

If:

1. you have experience with any of the following:
    * Node-TypeScript
    * Keyboard hooking on Windows (current implementation in C++)
    * Keyboard hooking on Mac (current implementation in Swift)
    * Keyboard hooking on Linux (current X11 implementation in C++)
    * Publishing NPM packages
 2. Own a Windows, Mac or Linux machine.
 3. Are interested in maintaining an open source project (e.g. testing PRs on the system, fixing issues)

Please [apply to become a maintainer](https://github.com/LaunchMenu/NGKL-MaintainerApplications). Otherwise this repo will remain archived.

## Thanks & Goodbye

This project was created as a result of the stability concerns for other NodeJS keyboard hooking projects, and initially for use with LaunchMenu. At the beginning we were investing heavily in [launchmenu](http://launchmenu.github.io), however unfortunately this project didn't kick off and the maintainers @TarVK and @Sancarn have moved onto bigger and better things. At this stage, it's been many years since this project has been actively maintained, and the previous stability of this project has been deteriating (see #36, #41, #34, #23). Thusly we sadly feel compelled to archive this project until new serious maintainers for this project hop on board.

Thanks everyone for using this project, and we hope you get use out of the old stable versions.

# node-global-key-listener

## Description

A simple, cross-platform NodeJS package which can be used to listen to and capture keyboard events.

Compatibility table:

| Platform | Compatible?     | Tested        |
| -------- | --------------- | ------------- |
| Windows  | True            | Win10         |
| Mac      | True            | Mac OS Mojave |
| Linux    | X11 only        | Arch Linux    |

This keyboard listener was originally made for the productivity application, [LaunchMenu](http://launchmenu.github.io/).

## Usage

```ts
import {GlobalKeyboardListener} from "node-global-key-listener";
const v = new GlobalKeyboardListener();

//Log every key that's pressed.
v.addListener(function (e, down) {
    console.log(
        `${e.name} ${e.state == "DOWN" ? "DOWN" : "UP  "} [${e.rawKey._nameRaw}]`
    );
});

//Capture Windows + Space on Windows and Command + Space on Mac
v.addListener(function (e, down) {
    if (
        e.state == "DOWN" &&
        e.name == "SPACE" &&
        (down["LEFT META"] || down["RIGHT META"])
    ) {
        //call your function
        return true;
    }
});

//Capture ALT + F
v.addListener(function (e, down) {
    if (e.state == "DOWN" && e.name == "F" && (down["LEFT ALT"] || down["RIGHT ALT"])) {
        //call your function
        return true;
    }
});

//Call one listener only once (demonstrating removeListener())
calledOnce = function (e) {
    console.log("only called once");
    v.removeListener(calledOnce);
};
v.addListener(calledOnce);

/* 
 To add logging of errors please use. This is hopefully not needed in most cases, but may still be useful in production.
    new GlobalKeyboardListener({
        windows: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
            onInfo: (info) => console.info("INFO: " + info)
        },
        mac: {
            onError: (errorCode) => console.error("ERROR: " + errorCode),
        }
    })
*/
```

## Installation

To install this npm package call:

```
npm install node-global-key-listener
```

## Is this the right package for you?

NodeJS has various packages for listening to keyboard events raised in the operating system. We may not have created the best package for you, please use the below descriptions to aid you in making your decision:

### Electron::globalShortcut

#### Advantages:

-   Native to electron apps
-   No compiling issues with Node-gyp
-   All execution occurs in-process

#### Disadvantages:

-   On Windows: Cannot override windows specific shortcuts. E.G. Ctrl+Alt+Delete or Windows+Space etc.
-   On Mac: Will not prevent other applications from listening for events
-   Cannot easily be used to listen for arbitrary keys
-   Requires electron in order to function.

### [IOHook](https://www.npmjs.com/package/iohook)

#### Advantages:

-   All execution occurs in-process
-   On Windows: Allows capture of windows specific shortcuts. E.G. Ctrl+Alt+Delete or Windows+Space etc.
-   On Mac: Prevents other applications from listening for captured events.

#### Disadvantages:

-   Cannot easily be used to listen for arbitrary keys
-   Requires compilation with node-gyp. Sometimes the package is released with binaries, however these binaries need to be compiled seperately for each version of node. Furthermore, when compile errors occur the code given is a black box which you will need to fix, which may be complex if you're not used to the languages they are written in.

### [node-global-key-listener](https://www.npmjs.com/package/node-global-key-listener)

#### Advantages:

-   Easy to setup as an arbitrary key listener/logger.
-   Does not require node-gyp. Our package comes with pre-compiled binaries which are compatible with your OS and not dependent on node version.
-   On Windows: Allows capture of windows specific shortcuts. E.G. Ctrl+Alt+Delete or Windows+Space etc.
-   On Mac: Prevents other applications from listening for captured events.

#### Disadvantages:

-   Most execution occurs out-of-process. Our package executes and runs a seperate key server which NodeJS interfaces with over stdio. This means that this application might require permission to run depending on your anti-virus system.
-   Some workarounds used may rarely lead to unexpected functionality, see windows specific implementation of windows key listeners
-   If installed into an application on Mac explicit permission will be required from the user via Accessibility.

## Development

### Building and Testing

```bash
# Development
npm run dev          # Watch mode compilation
npm run build        # Production build
npm run build:swift  # Compile Swift binary (macOS)
npm run build:win    # Compile Windows binary
npm run build:x11    # Compile Linux binary

# Testing
npm test             # Run all tests
npm run test:manual  # Manual interactive testing

# Code Quality
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix issues
npm run format       # Format code

# Cleanup
npm run clean        # Remove build artifacts
```

### TypeScript Development

If modifying the TypeScript code, run the following command to enable watch mode:

```bash
npm run dev
```

This will recompile the TypeScript whenever source code changes. When making changes to platform-specific code, please consider adding these changes to all keyboard servers if possible.

### Modifying the compiled binaries

To modify the Windows `C++` or Mac `Swift` source code please compile these applications before testing with:

#### Pre-requisites

##### Windows

This project is configured to use [mingw](https://sourceforge.net/projects/mingw/), and thus this should be installed before compiling the source code.

#### Compiling the binary code

To compile the source code of these applications use the below command line commands respective to the system you are working on.

##### Windows

```bash
npm run build:win
```

##### Mac

```bash
npm run build:swift
```

##### Linux (X11)

```bash
npm run build:x11
```

## Notes

-   If Including this package into an Electron application, the built application will require explicit permission from the user on Mac OS X systems.
-   Given that a fallback may be required we may release an `electron-global-key-listener` package to accommodate this in the future. In our case for LaunchMenu, our fallback is implemented in [`core/keyHandler`](https://github.com/LaunchMenu/LaunchMenu/blob/master/packages/core/src/keyHandler/globalKeyHandler/globalKeyHandler.ts).
