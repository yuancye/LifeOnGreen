pipeline {
    agent any

    environment {
        // Set up any necessary environment variables (optional)
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Debugging') {
            steps {
                echo 'Debug: Pipeline is running this stage'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Application') {
            steps {
                // sh 'nohup npm start &'
                sh 'npm start'
            }
        }
    }

    post {
        always {
            // Cleanup steps or notifications (if needed)
            echo 'Pipeline completed.'
        }
    }
}