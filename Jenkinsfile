#!/usr/bin/groovy

node {
  def root = pwd()

  stage('Setup') {
    git url: 'https://github.com/StatEngine/spade', branch: 'master'
  }

  stage('Archive') {
    sh """
      test -f /etc/runtime && source /etc/runtime

      export ARTIFACT=artifacts/spade.tar.bz2

      ./clean-package.sh

      mkdir -p artifacts
      rm -rf artifacts/*
      tar --exclude artifacts/* -cjf \$ARTIFACT .
      
      ./bin/s3Push.sh
    """
  }
}
