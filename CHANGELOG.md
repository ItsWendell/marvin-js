# [1.1.0](https://github.com/ItsWendell/marvin-js/compare/1.0.3...1.1.0) (2019-02-24)


### New features

* experimental chat history improvements ([f6a3b6f](https://github.com/ItsWendell/marvin-js/commit/f6a3b6f))

## [1.0.3](https://github.com/ItsWendell/marvin-js/compare/1.0.2...1.0.3) (2019-02-20)


### Bug fixes

* implement loop security blacklist for factoids ([81829d2](https://github.com/ItsWendell/marvin-js/commit/81829d2))

## [1.0.2](https://github.com/ItsWendell/marvin-js/compare/1.0.1...1.0.2) (2019-02-17)


### Bug fixes

* database connected log, getAll request headers, coalitions job channel ([f32d479](https://github.com/ItsWendell/marvin-js/commit/f32d479))

## [1.0.1](https://github.com/ItsWendell/marvin-js/compare/1.0.0...1.0.1) (2019-02-16)


### Bug fixes

* not properly running in production ([e42d1d6](https://github.com/ItsWendell/marvin-js/commit/e42d1d6))


### Documentation changes

* update readme with release and build shields ([0587949](https://github.com/ItsWendell/marvin-js/commit/0587949))

# 1.0.0 (2019-02-16)


### Bug fixes

* catching 500 errors in express server using app instead of server ([2e36138](https://github.com/ItsWendell/marvin-js/commit/2e36138))
* code improvents and error handling ([b742aab](https://github.com/ItsWendell/marvin-js/commit/b742aab))
* database models not being export correctly ([678a195](https://github.com/ItsWendell/marvin-js/commit/678a195))
* empty text messages crashing the server ([a443b64](https://github.com/ItsWendell/marvin-js/commit/a443b64))
* factoid commands not parsing from right entity ([a62b829](https://github.com/ItsWendell/marvin-js/commit/a62b829))
* factoid duplicates in moongose models and catching error ([de523d7](https://github.com/ItsWendell/marvin-js/commit/de523d7))
* fix coalition stats command function import ([3d8b93e](https://github.com/ItsWendell/marvin-js/commit/3d8b93e))
* imports for intra42 commands file ([0a47bf9](https://github.com/ItsWendell/marvin-js/commit/0a47bf9))
* interceptor request for oauth client double usage ([87c165d](https://github.com/ItsWendell/marvin-js/commit/87c165d))
* intra auth command not exporting message context ([e8897a1](https://github.com/ItsWendell/marvin-js/commit/e8897a1))
* intra online commands not working when not paginated ([2f83764](https://github.com/ItsWendell/marvin-js/commit/2f83764))
* nextjs directory not properly set for deployments ([06af5ac](https://github.com/ItsWendell/marvin-js/commit/06af5ac))
* oauth token reauthentication fix attempt ([8cc3c55](https://github.com/ItsWendell/marvin-js/commit/8cc3c55))
* only show db name instead of whole host after database connection ([9939ba8](https://github.com/ItsWendell/marvin-js/commit/9939ba8))
* prevent server form booting when a module fails loading ([e0e787f](https://github.com/ItsWendell/marvin-js/commit/e0e787f))
* proper node implementation of sentry ([014c0ac](https://github.com/ItsWendell/marvin-js/commit/014c0ac))
* sentry importing not correctly as es6 ([3dee67f](https://github.com/ItsWendell/marvin-js/commit/3dee67f))
* timeout request for 0.5 seconds if got too many requests (429) ([68d92ff](https://github.com/ItsWendell/marvin-js/commit/68d92ff))
* typo in request in axios interceptors ([b282636](https://github.com/ItsWendell/marvin-js/commit/b282636))
* unexpected token at command first word lower case logic ([43cf4af](https://github.com/ItsWendell/marvin-js/commit/43cf4af))
* variable isRefreshingToken wrongly spelled in api client ([85ae374](https://github.com/ItsWendell/marvin-js/commit/85ae374))


### Code refactors

* add aliasses and improve help for commands ([377d23d](https://github.com/ItsWendell/marvin-js/commit/377d23d))
* add database url to env example file ([37758bc](https://github.com/ItsWendell/marvin-js/commit/37758bc))
* improve disabeling of modules in server ([029b5a7](https://github.com/ItsWendell/marvin-js/commit/029b5a7))
* improve error handling, remove auth commands for intra ([08ac22b](https://github.com/ItsWendell/marvin-js/commit/08ac22b))
* improve errors for loading intra42 module ([aa09db4](https://github.com/ItsWendell/marvin-js/commit/aa09db4))
* improve help and command output ([78478b4](https://github.com/ItsWendell/marvin-js/commit/78478b4))
* intra 42 files ([917dbdf](https://github.com/ItsWendell/marvin-js/commit/917dbdf))
* limit history messages and include proof of concept message ([2f1928f](https://github.com/ItsWendell/marvin-js/commit/2f1928f))
* move babel dependencies to regular dependencies ([694926c](https://github.com/ItsWendell/marvin-js/commit/694926c))
* remove unused imports from javascript vm ([dd2a7ef](https://github.com/ItsWendell/marvin-js/commit/dd2a7ef))
* remove unused imports from javascript vm ([843231a](https://github.com/ItsWendell/marvin-js/commit/843231a))
* return actual promise when too many requests ([ffb4af3](https://github.com/ItsWendell/marvin-js/commit/ffb4af3))
* set timeouts for factoids to 5 seconds ([e0972fc](https://github.com/ItsWendell/marvin-js/commit/e0972fc))
* super acruate intra hours command for the entire week in utc ([e28bb51](https://github.com/ItsWendell/marvin-js/commit/e28bb51))
* update code to make mode modular ([077f5fa](https://github.com/ItsWendell/marvin-js/commit/077f5fa))
* update heroku deployment app json to fix settings ([83742fb](https://github.com/ItsWendell/marvin-js/commit/83742fb))
* update package to support heroku ([e37b88b](https://github.com/ItsWendell/marvin-js/commit/e37b88b))


### Documentation changes

* add experimental heroku deployment link image to readme ([a1ecd99](https://github.com/ItsWendell/marvin-js/commit/a1ecd99))
* add share invite link on slack ([51d234a](https://github.com/ItsWendell/marvin-js/commit/51d234a))
* improve readme for setting up MarvinJS ([36f3631](https://github.com/ItsWendell/marvin-js/commit/36f3631))
* update docs with staging dev environment ([b73c457](https://github.com/ItsWendell/marvin-js/commit/b73c457))
* update readme file to match new features and code refactoring ([8f6918f](https://github.com/ItsWendell/marvin-js/commit/8f6918f))
* update readme to include new intra command refactors ([99c9e24](https://github.com/ItsWendell/marvin-js/commit/99c9e24))


### New features

* add initial module for intra42 api ([19d0f86](https://github.com/ItsWendell/marvin-js/commit/19d0f86))
* add support for disabeling modules in environment ([ec6e770](https://github.com/ItsWendell/marvin-js/commit/ec6e770))
* add support for quoteless factoids as array ([6bc8255](https://github.com/ItsWendell/marvin-js/commit/6bc8255))
* code improvements and implement VM javascript factoid execution ([4f86c9a](https://github.com/ItsWendell/marvin-js/commit/4f86c9a))
* final fix of oauth2 reauth tokens app, client improvements and commands ([4cfa4a5](https://github.com/ItsWendell/marvin-js/commit/4cfa4a5))
* first word of command to lower case ([f794cb8](https://github.com/ItsWendell/marvin-js/commit/f794cb8))
* implement automatic token refreshing into requests ([c8ae2d3](https://github.com/ItsWendell/marvin-js/commit/c8ae2d3))
* implement chunking and getAll intra client function ([6e6fa40](https://github.com/ItsWendell/marvin-js/commit/6e6fa40))
* implement intra online command to list active campus users ([195837d](https://github.com/ItsWendell/marvin-js/commit/195837d))
* implement keepawake module for heroku apps ([b6f3925](https://github.com/ItsWendell/marvin-js/commit/b6f3925))
* implement logged in location for hours command ([5d45d15](https://github.com/ItsWendell/marvin-js/commit/5d45d15))
* improve hours command with last seen, add user command ([aebfc37](https://github.com/ItsWendell/marvin-js/commit/aebfc37))
* integrate basic sentry integration using raven ([37c7aa2](https://github.com/ItsWendell/marvin-js/commit/37c7aa2))
* integrate error handling for sentry to express server ([6be72e6](https://github.com/ItsWendell/marvin-js/commit/6be72e6))
* integrate heroku app.json for semi-automated and easy deployments ([fbc6ed0](https://github.com/ItsWendell/marvin-js/commit/fbc6ed0))
* minor code refactoring and add support for intra hours command ([d1be443](https://github.com/ItsWendell/marvin-js/commit/d1be443))
* show help on subcommand factoid ([062268c](https://github.com/ItsWendell/marvin-js/commit/062268c))
* show help on subcommand intra ([cbc7601](https://github.com/ItsWendell/marvin-js/commit/cbc7601))
* temporary auth command for intra42 to reauthenticate ([8b481f5](https://github.com/ItsWendell/marvin-js/commit/8b481f5))


### Other chores

* add -p parameter to node start script for heroku ([e8661d7](https://github.com/ItsWendell/marvin-js/commit/e8661d7))
* add debugging for request errors ([f808cb6](https://github.com/ItsWendell/marvin-js/commit/f808cb6))
* add heroku post build to package json ([9881b4c](https://github.com/ItsWendell/marvin-js/commit/9881b4c))
* export keepawake as module in index ([5acebc6](https://github.com/ItsWendell/marvin-js/commit/5acebc6))
* implement eslint / prettier / semantic-release / pipelines ([5616b9c](https://github.com/ItsWendell/marvin-js/commit/5616b9c))
* improvements in the intra42 api client ([662cd5c](https://github.com/ItsWendell/marvin-js/commit/662cd5c))
* initial commit ([9f2daac](https://github.com/ItsWendell/marvin-js/commit/9f2daac))
* initial refactor of api client to include oauth2 token renewing ([20cab16](https://github.com/ItsWendell/marvin-js/commit/20cab16))
* minor code refactoring and improvements ([f8d7939](https://github.com/ItsWendell/marvin-js/commit/f8d7939))
