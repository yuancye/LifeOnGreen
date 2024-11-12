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

// pipeline {
//     agent any
//     environment {
//         DOCKER_IMAGE = 'yuanchaoye/jenkins-web-app'  // Your Docker Hub image
//         DOCKER_TAG = '1.0'
//         PORT = '8000'  // Adjust this to your web app's port
//     }
//     stages {
//         stage('Clean Up Old Containers and Images') {
//             steps {
//                 script {
//                     // Stop and remove old containers
//                     sh '''docker ps -aq --filter ancestor=$DOCKER_IMAGE | xargs -r docker stop'''
//                     sh '''docker ps -aq --filter ancestor=$DOCKER_IMAGE | xargs -r docker rm'''

//                     // Remove old image
//                     sh '''docker images -q $DOCKER_IMAGE:$DOCKER_TAG | xargs -r docker rmi'''
//                 }
//             }
//         }
//         stage('Build New Image') {
//             steps {
//                 sh "docker build -t $DOCKER_IMAGE:$DOCKER_TAG ."
//             }
//         }
       
//         // stage('Pull Docker Image') {
//         //     steps {
//         //         script {
//         //             // Pull the Docker image from Docker Hub
//         //             sh "docker pull $DOCKER_IMAGE:$DOCKER_TAG"
//         //         }
//         //     }
//         // }
//         stage('Run Web App') {
//             steps {
//                 script {
//                     // Run the Docker container
//                     sh "docker run -d -p $PORT:$PORT --name web-app $DOCKER_IMAGE:$DOCKER_TAG"
//                 }
//             }
//         }
//         stage('Test Web App') {
//             steps {
//                 script {
//                     // Test if the web app is accessible
//                     sh "curl http://localhost:$PORT"  // Example test
//                 }
//             }
//         }
//         stage('Clean Up') {
//             steps {
//                 script {
//                     // Clean up by stopping and removing the Docker container
//                     sh '''docker ps -aq --filter ancestor=$DOCKER_IMAGE | xargs -r docker stop'''
//                     sh '''docker ps -aq --filter ancestor=$DOCKER_IMAGE | xargs -r docker rm'''

//                     // Remove old image
//                     sh '''docker images -q $DOCKER_IMAGE:$DOCKER_TAG | xargs -r docker rmi'''
//                 }
//             }
//         }
//     }
// }


pipeline {
    agent { dockerfile true }
    stages {
        stage('Test') {
            steps {
                sh 'node --version'
            }
        }
    }
}