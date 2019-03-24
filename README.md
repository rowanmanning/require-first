
# @rowanmanning/require-first

Require and return the first available module.


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 10+


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


## Contributing

To contribute to this library, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code, and run the linter before opening a pull-request:

```sh
make test    # run all tests
make verify  # run all linters
```


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2019, Rowan Manning
