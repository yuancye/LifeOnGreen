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

// pipeline {
//     agent any
//     stages {
//         stage('Checkout Code') {
//             steps {
//                 git 'https://github.com/username/project-repo.git'
//             }
//         }
//         stage('Build Image') {
//             steps {
//                 script {
//                     sh 'docker build -t project-name:latest .'
//                 }
//             }
//         }
//         stage('Run Container') {
//             steps {
//                 script {
//                     // Stop and remove any running container with the same name
//                     sh 'docker stop project-container || true && docker rm project-container || true'
//                     // Run the new container
//                     sh 'docker run -d -p 3000:3000 --name project-container project-name:latest'
//                 }
//             }
//         }
//     }
// }

// pipeline {
//     agent any
//     stages {
//         stage('Setup') {
//             steps {
//                 script {
//                     sh 'npm install'
//                     sh 'nohup npm start &'
                    
//                     def appPid = sh(script: 'echo $!', returnStdout: true).trim()
//                     echo "App PID: ${appPid}"
//                 }
//             }
//         }
//         stage('Test') {
//             steps {
//                 script {
//                     // Poll or wait until a certain condition is met (like test completion)
//                     def testComplete = false
                    
//                     while (!testComplete) {
//                         // Check if testing is done or a certain condition is met
//                         testComplete = checkIfTestsAreComplete()
                        
//                         if (!testComplete) {
//                             sleep(time: 10, unit: 'SECONDS')  // Wait for 10 seconds before checking again
//                         }
//                     }
                    
//                     // Once tests are done, stop the app
//                     sh "kill ${appPid}"
//                     echo "App stopped after testing completion"
//                 }
//             }
//         }
//     }
// }

// def checkIfTestsAreComplete() {
//     // Implement logic to check if testing or app activity is complete
//     return true  // For example purposes, returning true to stop the app
// }

pipeline {
    agent any
    stages {
        stage("checkout") {
            steps {
                check scm
            }
        }

        stage("build") {
            steps {
                sh 'sudo apt install npm'
                sh 'sudo npm start'
            }
        }

    }
}