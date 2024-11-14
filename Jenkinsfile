pipeline {
    agent any

    environment {
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Application') {
            steps {
                // Run the application in the background to allow the pipeline to continue
                sh 'nohup npm start &'
            }
        }

        stage('Cleanup') {
            steps {
                // Ensure cleanup runs to stop the application
                sh 'pkill -f "node"'
            }
        }
    }

    post {
        always {
            echo 'Pipeline completed.'
        }
    }
}
