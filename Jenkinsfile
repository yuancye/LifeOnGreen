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

    // environment {
    //     // Set up any necessary environment variables (optional)
    //     PATH = "/usr/local/bin:$PATH"
    // }

    stages {
        stage('Cleanup Existing Container and Image') {
            steps {
                script {
                    // Check if the container exists and remove it
                    sh '''
                        if [ $(docker ps -aq -f name=web-app) ]; then
                            docker stop web-app || true
                            docker rm web-app || true
                        fi
                    '''

                    // Check if the image exists and remove it
                    sh '''
                        if [ $(docker images -q life-on-green) ]; then
                            if [ $(docker ps -aq -f ancestor=life-on-green) ]; then
                                docker stop $(docker ps -aq -f ancestor=life-on-green) || true
                                docker rm $(docker ps -aq -f ancestor=life-on-green) || true
                            fi
                            docker rmi life-on-green || true
                        fi
                    '''
                }
            }
        }

        // stage('Build Docker Image') {
        //     steps {
        //         script {
        //             // Build the Docker image
        //             sh 'docker build -t life-on-green .'
        //         }
        //     }
        // }

        // pull images from Dockerhub
        stage('Pull Docker Image from Docker Hub') {
            steps {
                script {
                    // Pull the Docker image from Docker Hub
                    sh 'docker pull yuanchaoye/life-on-earth:1.0'
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                script {
                    // Run the Docker container
                    sh 'docker run -d -p 8000:8000 --name web-app life-on-green'
                    sh 'sleep 60'
                }
            }
        }
    }

    post {
        always {
            script {
                sh '''
                    docker stop web-app || true
                    docker rm web-app || true
                '''
                sh '''
                    docker rmi life-on-green || true
                '''
            }
            echo 'Pipeline completed.'
        }
    }
}
