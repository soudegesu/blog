# blog
github pages with Jekyll.

## Requirements
* ruby 2.4.0 or more
* use rbenv

## Setup

* install bundler
```
rbenv exec gem install bundler
```

* bundle install
```
rbenv exec bundle install --path vendor/bundler
```

* build(local)
```
rbenv exec bundle exec jekyll serve -s . -d docs -w --config _config.yml,_config_dev.yml
```
