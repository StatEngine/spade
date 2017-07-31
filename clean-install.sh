#!/bin/bash

echo "----[ cleaning yarn cache"
yarn cache clean

echo "----[ removing ./node_modules npm packages"
rm -rf ./node_modules
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to remove npm packages"
    exit $rc
fi

echo "----[ removing ./app/node_modules/ npm packages"
rm -rf ./app/node_modules
rc=$?
if [ $rc != 0 ] ; then
    echo "====[ Error: Failed to remove npm packages"
    exit $rc
fi

npm install
echo "----[ clean complete"
