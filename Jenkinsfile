pipeline {
    agent any
    environment {
        // Set NodeJS version (assuming it's installed through Jenkins NodeJS Plugin)
        NODE_HOME = tool name: 'NodeJS', type: 'NodeJSInstallation'
        PATH = "${NODE_HOME}/bin:${env.PATH}"
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/yuancye/LifeOnGreen.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Application') {
            steps {
                sh 'npm start'
            }
        }
    }
}
