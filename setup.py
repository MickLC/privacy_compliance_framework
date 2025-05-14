import os
import sys
from setuptools import setup, find_packages

def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name = "docassemble.privacycomplianceframework",
    version = "0.1.0",
    description = ("A framework for privacy compliance assessment and documentation"),
    long_description = read("README.md"),
    author = "Your Name",
    author_email = "your.email@example.com",
    license = "MIT",
    url = "https://github.com/yourusername/docassemble-privacycomplianceframework",
    packages = find_packages(),
    namespace_packages = ['docassemble'],
    install_requires = [],
    zip_safe = False,
    package_data = {
        'docassemble.privacycomplianceframework': [
            'data/questions/*.yml',
            'data/sources/*.json',
            'data/static/css/*.css',
            'data/templates/*.md'
        ]
    }
)
