from distribute_setup import use_setuptools
use_setuptools()

PACKAGE = ''
VERSION = __import__(MAIN_PACKAGE).get_version()

kwargs = {
    'name': PACKAGE,
    'version': VERSION,

    'packages': find_packages(exclude=['tests', '*.tests', 'tests.*', '*.tests.*'])

    # Tests
    'test_suit': 'test_suite',
    'tests_require': [
        'coverage',
    ],

    'author': '',
    'author_email': '',
    'description': '',
    'license': '',
    'keywords': '',
    'url': '',
    'classifiers': [],
}


setup(**kwargs)
