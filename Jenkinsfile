pipeline {
    agent any
    stages {
        stage('Build') {
         agent {
            docker {
               image 'node:20-alpine'
               resueNode true
            }
         steps {
            sh '''
            node --version
            npn --version
            npm ci
            npm run build'''
            }
         }
        }
    }
}