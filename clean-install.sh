#!/bin/bash
echo "----[ cleaning yarn & npm cache"
yarn cache clean
npm cache clean

# exit on error
set -e
echo "----[ removing temp dirs ./dll, ./release, ./out"
rm -rf ./out
rc=$?
rm -rf ./dll
rc2=$?
rm -rf ./release
rc3=$?
if [ $rc != 0 ] || [ $rc2 != 0 ] || [ $rc3 != 0 ] ; then
    echo "====[ Error: Failed to remove temp dirs"
    exit $rc
fi

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
