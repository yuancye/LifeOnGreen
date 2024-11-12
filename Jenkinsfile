pipeline {
    agent {
        docker {
            image 'node:20-alpine'
        }
    }
    stages {
        stage('Build') {
            steps {
               sh 'docker build -t life-on-green .'
               sh 'docker run -p 8000:8000 life-on-green'
            }
        }

    }
}