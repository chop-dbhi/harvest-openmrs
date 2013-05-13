# Harvest+OpenMRS

## Prerequisites

- Python 2.7


## The Simple Way

```bash
pip install harvest
harvest init-demo openmrs
```

## The Hard Way

### Setup & Install

Install [virtualenv](http://pypi.python.org/pypi/virtualenv):

```bash
$ wget http://pypi.python.org/packages/source/v/virtualenv/virtualenv-1.8.2.tar.gz
$ tar zxf virtualenv-1.8.2.tar.gz
$ cd virtualenv-1.8.2
$ python setup.py install
```
_You may need to do that last step as root. Just make sure you use the
correct Python binary for OSes with multiple Python versions._

Create a virtual environment for the project:

```bash
$ virtualenv myproject-env
$ cd myproject-env
$ source bin/activate
```

### Clone or Download

**Clone using Git.** The advantages of cloning the repository is to keep-up-date
as updates to the project happen.

```bash
$ git clone git://github.com/cbmi/harvest-openmrs
$ cd harvest-openmrs
$ git checkout demo
```

Alternatively, you can download a zipped version, the `<random-chars>` shown
below will vary depending on the version of the build. 

```bash
$ wget https://github.com/cbmi/harvest-openmrs/zipball/demo
$ unzip cbmi-harvest-openmrs-<random-chars>.zip
$ mv cbmi-harvest-openmrs-<random-chars> harvest-openmrs
$ cd harvest-openmrs
```

### Setup

```bash
$ pip install -r requirements.txt
$ make collect
```

### Run It

```bash
$ ./bin/manage.py runserver
```

Open up your web browser to http://localhost:8000
