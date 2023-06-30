## Overview

This repository contains two applications which comprise a Web platform for browse/search/filter SEC Form 4 filings, and related financial data. The first application is a background service which pulls the data from publicly available archives, and the second application is a Next.js full-stack application to access the data over the web.

## Background service

The python web spider service pulls news filings from the [SEC Fast Edgar Archive]|https://archive.fast-edgar.com, normailizes the data, and then stores filings in MongoDB Atlas. To install and run this application:

```
$ cd ./spider
$ source venv/bin/active
$ pip3 install
$ python3 index.py start
```

Note above the service has dependencies on a virtual environment, python v3 or better, and makes use of the excellent [python-daemon](https://pypi.org/project/python-daemon) module to manage the service. The service can detect new filings, filter out non-form-4 filings, parse the relevant HTML for a given filing, and then validate and store filings in a MongoDB database. I originally chose [pyquuery](https://pypi.org/project/pyquery/) for HTML parsing due to my familiarity with jQuery, but I believe a faster, more stable parser choice would have been [Beautiful Soup](https://pypi.org/project/beautifulsoup4).

## Website

The website is built on the [Next.js 13 beta meta-framework](https://nextjs.org/docs) and is comprised of both a REST API and front end. The application works well with [Vercel](https://vercel.com) for hosting. To install and run this application:

```
$ cd ./ir-webapp
$ npm install
$ npm run dev
```

The site allows users to browse recent filings, filter and search by various criteria, and save searches in local storage for later usage.