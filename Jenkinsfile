// pipeline {
//     agent any
//     stages {
//         stage('Build') {
//          agent {
//             docker {
//                image 'node:20-alpine'
//                resueNode true
//             }
//          steps {
//             sh '''
//                node --version
//                npn --version
//                npm ci
//                npm run build
//                '''
//             }
//          }
//         }
//     }
// }

pipeline {
    agent any
    environment {
        DOCKER_IMAGE = 'yuanchaoye/jenkins-web-app'  // Your Docker Hub image
        DOCKER_TAG = '1.0'
        PORT = '8000'  // Adjust this to your web app's port
    }
    stages {
        stage('Pull Docker Image') {
            steps {
                script {
                    // Pull the Docker image from Docker Hub
                    sh "docker pull $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }
        stage('Run Web App') {
            steps {
                script {
                    // Run the Docker container
                    sh "docker run -d -p $PORT:$PORT --name web-app $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }
        stage('Test Web App') {
            steps {
                script {
                    // Test if the web app is accessible
                    sh "curl http://localhost:$PORT"  // Example test
                }
            }
        }
        stage('Clean Up') {
            steps {
                script {
                    // Clean up by stopping and removing the Docker container
                    sh "docker stop web-app"
                    sh "docker rm web-app"
                }
            }
        }
    }
}
