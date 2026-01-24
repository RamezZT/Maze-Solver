pipeline {
    agent any

    tools {
nodejs 'node'
}

    stages {

        stage('Pre-build check (npm build)') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'npm ci'
                sh 'npm run build'
            }
        }

        stage('Docker build') {
            steps {
                sh 'docker build -t ramezzt/mazeSolver:latest .'
            }
        }

        stage('Push image') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'Docker',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push yourname/yourapp:latest
                    '''
                }
            }
        }
    }
}
