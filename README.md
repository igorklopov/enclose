# EncloseJS

Compile your Node.js project into an executable

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/igorklopov/enclose?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![Hello, world!](http://enclosejs.com/screenshot.png)

### Use cases

* Make a commercial version of your application without sources
* Make a demo/evaluation/trial version of your app without sources
* Make some kind of self-extracting archive or installer
* Make a closed source GUI application using [node-thrust](https://github.com/breach/node-thrust)
* No need to install Node.js and npm to deploy the compiled application
* No need to download hundreds of files via `npm install` to deploy
your application. Deploy it as a single independent file
* Put your assets inside the executable to make it even more portable
* Test your app against new Node.js version without installing it

### Install

```
npm install -g enclose
```

### Usage

Run `enclose` without arguments to see help.

In short, as input you specify the entry file of your project
`/path/app.js`. As output you get a standalone executable
`/path/app`. When it is run, it does the same as `node /path/app.js`

### Command line of the executable

Command line call `./app a b` is equivalent to `node ./app.js a b`

### Dependencies

The compiler parses your sources, detects calls to `require`, traverses
the dependencies of your project and includes them into the executable.
You don't need to list them manually.

### Assets

If your project has assets (HTML templates, CSS, etc), for example to
serve via HTTP, you can bundle them into the executable. Just list them
as a [glob](https://github.com/sindresorhus/globby) in the configuration
file.

### Compilation? Srsly?

Both Yes and No.

Yes. Because JavaScript code is transformed into native code at
compile-time using
[V8 internal compiler](https://github.com/v8/v8-git-mirror/blob/master/src/compiler.cc).
Hence, your sources are not required to execute the binary, and they
are not packaged.

No. Optimized native code can be generated only at run-time, using
information collected at run-time. Without that information EncloseJS
can generate only "unoptimized" code. It runs about 2x slower, than
optimized one.

Also, Node.js code is put inside the executable (along with your code)
to support Node.js API for your application at run-time. This increases
output file size.

So, this is not that static compilation we used to know. But nevertheless
you get fully functional binary without sources. Also, performance and
file size overhead are vectors of future work.

### Code protection?

The code protection is as strong as possible when the sources are
compiled to native code. Hackers will deal with
[that push-mov stuff](https://github.com/v8/v8-git-mirror/blob/master/src/full-codegen/x87/full-codegen-x87.cc#L1110).
No need to obfuscate, no need to encrypt, no "hidden" decryption keys.
Also

```
myfunc.toString()
function myfunc() { [native code] }
```

### Versions of Node.js

You can choose what runtime version to wrap your project in -
0.12.x, 4.x or 6.x.

### Vanilla Node.js

EncloseJS project does not aim to add new features to Node.js - to
avoid undesirable issues, to have predictable stability and to make
Node.js native modules compatible with enclosed executables.

### Fast

It takes seconds to make an executable. You don't need to build
Node.js from sources in order to make the binary. EncloseJS is
shipped with precompiled parts, ready for bundling.

### Compatibility with non-enclosed run

Projects like `npm`, `browserify`, `eslint` can be compiled using EncloseJS (see
[examples directory](https://github.com/igorklopov/enclose/tree/master/examples/22-npm)).
Probably, your existing project can be compiled too, with minimal
adjustments. The adjustments preserve the ability to run you project
via `node ./app.js`

### Platforms

EncloseJS can build executables for Linux, Windows and Mac OS X.
Cross compilation is not currently supported, but will be supported in future.

### Native modules

Native modules (.node files) are supported for all platforms
([more info](https://github.com/igorklopov/enclose/issues/12#issuecomment-82587865),
[serialport example](https://github.com/igorklopov/enclose/tree/master/examples/24-serialport),
[oracle example](https://github.com/igorklopov/enclose/tree/master/examples/25-oracle)).

- EncloseJS cannot package a native module inside the executable.
- You have to deploy your native modules along with your final executable.
- On Windows, native modules (built with node-gyp) require executable
name to be 'node.exe'. In order to make a module compatible with your
'myserver.exe' EncloseJS makes a copy of the module, patches
IAT of the copy (binds it to 'myserver.exe'), and then calls `dlopen`
against the copy. This workaround will be deprecated soon.

### License

Proprietary.
