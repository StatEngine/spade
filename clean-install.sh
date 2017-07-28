#!/bin/bash

echo "----[ cleaning yarn cache"
yarn cache clean

echo "----[ removing npm packages"
rm -rf ./node_modules
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to remove npm packages"
    exit $rc
fi

echo "----[ installing npm packages"
npm install
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to npm install"
    exit $rc
fi

echo "----[ clean install complete"
