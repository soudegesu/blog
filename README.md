# blog
github pages with Jekyll.

## Requirements
* ruby 2.4.0 or more
* bundler

## Setup

* update gem
```
gem install rubygems-update
update_rubygems
```

* install bundler
```
gem install bundler
```

* bundle install
```
bundle install --path vendor/bundler
```

* build(local)
```
bundle exec jekyll serve -s docs -w --config _config.yml,_config_dev.yml
```
