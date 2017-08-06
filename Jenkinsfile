#!/usr/bin/groovy

node {
  def root = pwd()

  stage('Setup') {
    git url: 'https://github.com/StatEngine/spade', branch: 'master'
  }

  stage('Archive') {
    sh """
      test -f /etc/runtime && source /etc/runtime

      echo "TODO: write shell script to build the artifact and push to s3 using ./bin/s3push.sh"
    """
  }
}
