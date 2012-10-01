# Harvest OpenMRS

## Makefile Commands

- ``build`` - builds and initializes all submodules, compiles SCSS and
    CoffeeScript and optimizes JavaScript
- ``watch`` - watches the CoffeeScript and SCSS files in the background
for changes and automatically recompiles the files
- ``unwatch`` - stops watching the CoffeeScript and SCSS files
- ``sass`` - one-time explicit recompilation of SCSS files
- ``coffee`` - one-time explicit recompilation of CoffeeScript files

## Local Settings

``local_settings.py`` is intentionally not versioned (via .gitignore). It should
contain any environment-specific settings and/or sensitive settings such as
passwords, the ``SECRET_KEY`` and other information that should not be in version
control. Defining ``local_settings.py`` is not mandatory but will warn if it does
not exist.

## CoffeeScript/JavaScript Development

CoffeeScript is lovely. The flow is simple:

- write some CoffeeScript which automatically gets compiled in JavaScript
(assuming you did ``make watch``)
- when ready to test non-``DEBUG`` mode, run ``make optimize``

The ``app.build.js`` file will need to be updated to define which modules
should be compiled to single files. It is recommended to take a tiered
approach to reduce overall file size across pages and increase cache potential
for libraries that won't change for a while, for example jQuery.

## SCSS Development

[Sass](http://sass-lang.com/) is awesome. SCSS is a superset of CSS so you can
use as much or as little SCSS syntax as you want. It is recommended to write
all of your CSS rules as SCSS, since at the very least the Sass minifier can
be taken advantage of.
