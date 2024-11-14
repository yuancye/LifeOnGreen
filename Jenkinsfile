// pipeline {
//     agent any

//     environment {
//         PATH = "/usr/local/bin:$PATH"
//     }

//     stages {
//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//             }
//         }

//         stage('Start Application') {
//             steps {
//                 // Run the application in the background to allow the pipeline to continue
//                 sh 'nohup npm start &'
//             }
//         }

//         stage('Cleanup') {
//             steps {
//                 // Ensure cleanup runs to stop the application
//                 sh 'pkill -f "node"'
//             }
//         }
//     }

//     post {
//         always {
//             echo 'Pipeline completed.'
//         }
//     }
// }


pipeline {
    agent any

    environment {
        // Set up any necessary environment variables (optional)
        PATH = "/usr/local/bin:$PATH"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh 'docker build -t life-on-green .'
                }
            }
        }

        stage('Run Docker Container') {
            steps {
                script {
                    // Run the Docker container
                    sh 'docker run -d -p 8000:8000 --name web-app life-on-green'
                }
            }
        }
    }

    post {
        always {
            // Stop and remove the container after the pipeline run
            script {
                sh '''
                    docker stop web-app || true
                    docker rm life-on-green || true
                '''
            }
            echo 'Pipeline completed.'
        }
    }
}
