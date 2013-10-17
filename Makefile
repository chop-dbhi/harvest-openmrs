all: setup collect

setup:
	@if [ ! -f ./openmrs/conf/local_settings.py ] && [ -f ./openmrs/conf/local_settings.py.sample ]; then \
	    echo 'Creating local_settings.py...'; \
	    cp ./openmrs/conf/local_settings.py.sample ./openmrs/conf/local_settings.py; \
	fi;

collect:
	@echo 'Symlinking static files...'
	@python ./bin/manage.py collectstatic --link --noinput > /dev/null

.PHONY: setup collect