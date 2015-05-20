# -*- coding: utf-8 -*-
import os

SECRET_KEY = 'utr4o&amp;eyma&amp;*-9ve4=+z-yhtqvfo2xnu_r665li+v*6wlou=)_'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(os.path.dirname(__file__), 'tests.db'),
    }
}

INSTALLED_APPS = (
     'openmrs', 
     'openmrs.drugs', 
     'openmrs.vaccines', 
     'openmrs.diagnoses',
     'avocado',
     'django.contrib.contenttypes',
     'django.contrib.auth',
     'django.contrib.sites',
 )

TEST_RUNNER = 'tests.runner.ProfilingTestRunner'
TEST_PROFILE = 'unittest.profile'
