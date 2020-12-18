<a href="https://github.com/reactive-stack-js">
  <img alt="reactive-stack-js" src="https://avatars0.githubusercontent.com/u/72337471?s=75" width="75">
</a>

# rsjs-config

[![build status](https://img.shields.io/travis/reactive-stack-js/rsjs-config.svg?branch=master)](https://travis-ci.org/reactive-stack-js/rsjs-config)
[![codacy](https://app.codacy.com/project/badge/Grade/7a30217a6bb34f61b5a2b29731abbae1)](https://www.codacy.com/gh/reactive-stack-js/rsjs-config/dashboard)
[![coverage](https://img.shields.io/coveralls/github/reactive-stack-js/rsjs-config/master.svg)](https://coveralls.io/github/reactive-stack-js/rsjs-config?branch=master)
[![dependencies](https://david-dm.org/reactive-stack-js/rsjs-config.svg)](https://www.npmjs.com/package/rsjs-config)
[![npm](https://img.shields.io/npm/dt/rsjs-config.svg)](https://www.npmjs.com/package/rsjs-config) [![Greenkeeper badge](https://badges.greenkeeper.io/reactive-stack-js/rsjs-config.svg)](https://greenkeeper.io/)

## Requirements

The config files have to be in a _dedicated_ folder, but the location of this folder and its name are up to you.

This dedicated folder _cannot have any subfolders_ except one _optional_ folder which has to be called __env__. This _
optional_ __env__ folder can only contain environment specific overrides, like development, stage, production or any
other environment value you may set NODE_ENV to be.

The config files can be either ```.ts```, ```.js``` or ```.json``` files. And they can also be mixed, if you want to
play like that.

The ```.json``` files have to contain a pure json object with configurations.

The ```.ts``` and ```.js``` should export the json config:

```typescript
module.exports = {
	...
}
```

The names of config files are used as the config root keys.

### Optional .env file

Optionally, you can also use a ```.env``` file with secret overrides, which you can also name as you wish. This file
should not be commited to your repository and is normally used for passwords. Standard files are ```.env```
, ```.env,local```, ```.local``` and so on.

This file requires a __namespace__ _word_ that will be used as the prefix for _every_ config value in it.

For example, if we want to define the ```foo.pwd``` value, and we decided to use ```blah``` as our namespace, then ```.env``` file would have:
```
blah.foo.pwd = "verysecretpwd"
```

## Usage

Let's say our project is structured as follows:

```bash
├─── main.js
├─── config
│   ├─── env
│   │   ├─── stage.js
│   │   └─── production.js
│   ├─── one.js
│   └─── two.js
├─── .env
```

Then, in ```one.js``` we can have keys ```foo``` and ```bar```, with some content. In ```two.js``` we can have
keys ```goo``` and ```car```, with some content.

In ```stage.js``` we have ```foo.dburl``` for the stage environment database. In ```production.js``` we
have ```foo.dburl``` for the production environment database.

Finally, in ```.env``` we have ```blah.foo.pwd``` for the database password. This file has to exist in each environment and
contain different environment values.

Then, this is how we initiate the RsConfig instance, in ```main.js```:

```javascript
// main.js
const path = require("path");
const RsConfig = require("rsjs-config");

RsConfig.init(path.join(__dirname, 'config'), {
	file: path.join(__dirname, '.env'),
	word: 'blah'
});
const dburl = RsConfig.get('one.foo.dburl');
...
```

## Documentation

[TypeDoc documentation](https://reactive-stack-js.github.io/rsjs-config/docs/)
