# EncloseJS

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/igorklopov/enclose?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Compile your node.js project into an executable

### Use cases

* Make a commercial version of your application without sources.
* Make a demo/evaluation/trial version of your app without sources.
* Make some kind of self-extracting archive or installer.
* Make a closed source GUI application using [node-thrust](https://github.com/breach/node-thrust).
* No need to install node and npm to deploy the compiled application.
* No need to download hundreds of files via `npm install` to deploy
your application. Deploy it as a single independent file.
* Put your assets inside the executable to make it even more portable.
* Test your app against new node version without installing it.

### Install

```
npm install -g enclose
```

### The package

As input you specify the entry file of your project `/path/project.js`.
As output you get a standalone executable `/path/project`. When it is
run, it does the same as `node /path/project.js`.

### Command line

Command line call `./project a b` is equivalent to `node ./project.js a b`.

### Dependencies

The compiler parses your sources, detects calls to `require`, traverses
the dependencies of your project and includes them into the package. You
don't need to list them manually.

### Assets

If your project has assets (html templates, css, etc), for example to
serve via http, you can bundle them into the package. Just list them
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

Also, node.js code is put inside the executable (along with your code)
to support node API for your application at run-time. This increases
output file size.

So, this is not that static compilation we used to know. But nevertheless
you get fully functional binary without sources. Also, performance and
file size overhead are vectors of future work.

### Code protection?

The code protection is as strong as possible when the sources are
compiled to native code. Hackers will deal with
[that push-mov stuff](https://github.com/v8/v8-git-mirror/blob/master/src/x87/full-codegen-x87.cc#L1110).
No need to obfuscate, no need to encrypt, no "hidden" decryption keys.
Also

```
myfunc.toString()
function myfunc() { [native code] }
```

### Node and io.js

You can choose what runtime to wrap your project in - node 0.12.x or
io.js. Both branches are supported.

EncloseJS project does not aim to add new features to node, to avoid
undesirable issues and to have predictable stability. Let's keep it
vanilla.

### Fast

It takes seconds to make an executable. You dont need to build
node/io.js from sources in order to make the binary. EncloseJS is
shipped with precompiled parts, ready for bundling.

### Unlimited code

You are not limited by the size of project. Big projects like `npm`,
`browserify`, `eslint` can be easily compiled using EncloseJS (see
[examples directory](https://github.com/igorklopov/enclose/tree/master/examples/22-npm)).
Probably, your existing project can be compiled too, with minimal
adjustments.

### Platforms

EncloseJS can build executables for Linux, Windows and Mac OS X.

- You can only build Windows executables (.exe) on Windows platform.
Same for Unix and Mac. Cross compilation is not currently supported.
- If you don't have the OS installed, you can use a VM such as VirtualBox
or VMWare and compile your executable in that OS.

### Node runtime

Currently the size of built executables is additionally increased by
5-7 MB, due to node runtime. Each executable has the node runtime
packaged with it (captive runtime).

### Native modules

Native modules are supported (.node files), for all platforms
([more info](https://github.com/igorklopov/enclose/issues/12#issuecomment-82587865),
[serialport example](https://github.com/igorklopov/enclose/tree/master/examples/24-serialport),
[oracle example](https://github.com/igorklopov/enclose/tree/master/examples/25-oracle)).
- EncloseJS cannot package a native module inside the executable.
- You have to package your native modules along with your final
executable, and `require` that native module at runtime.
- You have to compile native module against node 0.12.x or io.js 1.x.
- If you are having trouble porting your native module, use [NAN](https://github.com/rvagg/nan).
- On Windows, native module (built with node-gyp) requires executable
name to be 'node.exe'. So in order to make it compatible with your
'myserver.exe' EncloseJS makes a copy of the native module, patches
IAT of the copy (binds it to 'myserver.exe'), and then calls `dlopen`
against the copy.

### License

Free for non-commercial use.
