
# @rowanmanning/require-first

Require and return the first available module.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 16+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/require-first
```

Load the library into your code with a `require` call:

```js
const requireFirst = require('@rowanmanning/require-first');
```

Require modules by passing in an array of paths. The first one that successfully resolves will be returned.

```js
const thing = requireFirst(['thing1', './thing2', '~/../example/thing3']);
```

By default, an error will be thrown if none of the modules are found. You can change this behaviour to return a default value specified by you:

```js
const thing = requireFirst(['thing1', './thing2', '~/../example/thing3'], {
  example: true
});
```


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2019, Rowan Manning
