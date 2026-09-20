pipeline {
    agent any

    environment {
        NODE_IMAGE = 'node:20-alpine'
        JAVA_IMAGE = 'eclipse-temurin:21-jdk'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out Lumera...'
                checkout scm
            }
        }

        stage('Environment Check') {
            steps {
                sh '''
                    set -e
                    git --version
                    docker --version
                    docker compose version
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                sh '''
                    set -e
                    docker run --rm \
                      -v "$WORKSPACE/frontend:/app" \
                      -w /app \
                      "$NODE_IMAGE" \
                      sh -c "npm ci && npm run build"
                '''
            }
        }

        stage('Backend Build') {
            steps {
                sh '''
                    set -e
                    docker run --rm \
                      -v "$WORKSPACE/backend:/app" \
                      -w /app \
                      "$JAVA_IMAGE" \
                      sh -c "chmod +x mvnw && ./mvnw clean package -DskipTests"
                '''
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    docker compose down || true
                    docker compose up -d
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                    sleep 10
                    docker compose ps
                '''
            }
        }
    }

    post {
        success {
            echo 'Lumera deployment completed successfully.'
        }
        failure {
            echo 'Lumera pipeline failed. Check the failed stage above.'
        }
    }
}
