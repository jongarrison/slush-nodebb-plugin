# Overview 

This project helps users quickly generate new NodeBB plugins by asking a series of questions about the 
functionality needed in the new plugin.  It uses the Slush and Gulp libraries to provide this functionality.

## Getting Started

Install `slush-nodebb-plugin` globally:

```bash
$ npm install -g slush-nodebb-plugin
```

> This global installation also installs the command: nodebb-plugin-generator (which can be used directly).  It
> also installs the required slush and gulp dependencies, if you don't have them installed already.

### Usage

The global installation registered the script 'nodebb-plugin-generator'.  Simply run that in the directory where you
would like to have your new NodeBB plugin created.  

```bash
$ nodebb-plugin-generator
```

### Capabilities

This NodeBB Plugin Generator prompts the user about the required plugin functionality and can currently help to:

* Correctly create the package.json and plugin.json files with the appropriate default contents
* Create the stub methods and files for a new widget
* Create the stub methods and files for listening to a system hook
* Create the stub methods and files for a custom admin page
* Create the stub methods and files for a custom page
* Register a stub javascript file that will be injected on all NodeBB pages
* Register a stub style template (less/css) that will be injected on all NodeBB pages
* Register a reference to a template folder for overriding system templates

### Standard Slush Usage

If you would prefer to call this as a standard slush script

Create a new folder for your project:

```bash
$ mkdir nodebb-plugin-mynewplugin
```

Run the generator from within the new folder:

```bash
$ cd nodebb-plugin-mynewplugin && slush nodebb-plugin
```

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

To find out more about Slush, check out the [documentation](https://github.com/slushjs/slush).

## Contributing

Feel free to contribute code via the Github pull request process

## Support
If you have any problem or suggestion please open an issue [here](https://github.com/jongarrison/slush-nodebb-plugin/issues).

## License 

The MIT License

Copyright (c) 2015, Jon Garrison

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

