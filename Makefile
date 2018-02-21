publish:
	rm -rf docs && \
		rbenv exec bundle exec jekyll build -s . -d docs -w --config _config.yml

serve:
	rm -rf _site && \
		rbenv exec bundle exec jekyll serve -s . -d _site -w --config _config.yml,_config_dev.yml