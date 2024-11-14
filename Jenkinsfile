pipeline {
    agent any

    environment {
        // Set up any necessary environment variables (optional)
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        // stage('Checkout') {
        //     steps {
        //         git credentialsId: 'c812990a-cdd7-4e7a-8acf-0fe5f780442d', url: 'git@github.com:yuancye/LifeOnGreen.git', branch: 'main'
        //     }
        // }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Start Application') {
            steps {
                sh 'nohup npm start &'
            }
        }
        // stage('Cleanup') {
        //     steps {
        //         sh 'pkill -f "node"'
        //     }
        // }
    }

    post {
        always {
            // Cleanup steps or notifications (if needed)
            echo 'Pipeline completed.'
        }
    }
}