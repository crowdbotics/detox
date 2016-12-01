#!/bin/bash

printf "\n#################################################################\n"

if [ -f ios.tar ]; then
  tar -xf ios.tar
  rm -f ios.tar
fi

brew list fbsimctl &> /dev/null
if [ $? != 0 ]; then
  printf "\n#################################################################\n"
  brew help &> /dev/null
  if [ $? != 0 ]; then
    echo "error: could not fix SocketRocket soft links."
    exit 1
  fi

  brew tap facebook/fb
  if [ $? != 0 ]; then
    echo "error: Facebook Tap install failed."
    exit 1
  fi

  brew install fbsimctl --HEAD
  if [ $? != 0 ]; then
    echo "error: fbsimctl install failed."
    exit 1
  fi
else
echo "# fbsimctl already installed."
fi