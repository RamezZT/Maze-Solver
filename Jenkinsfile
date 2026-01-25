pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {

        stage('Pre-build (npm)') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Docker build') {
            agent {
                docker {
                    image 'docker:26-cli'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                sh 'docker version'
                sh 'docker build -t ramezzt/mazeSolver:latest .'
            }
        }

        stage('Push image') {
            when { branch 'main' }
            agent {
                docker {
                    image 'docker:26-cli'
                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'Docker',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                      echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                      docker push ramezzt/mazeSolver:latest
                    '''
                }
            }
        }
    }
}