try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

config = {
    'description': 'Final Project CS171',
    'authors' : 'Raul Jordan and Jacques van Rhyn',
    'version' : '0.1',
    'install_requires': [],
    'packages' : ['Pycoin'],
    'name' : 'Pycoin'
}

setup(**config)
