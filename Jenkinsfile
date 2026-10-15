pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 40, unit: 'MINUTES')
    }

    environment {
        // Keep CI containers, network, and volumes isolated from a deployment stack.
        COMPOSE_PROJECT_NAME = 'lumera-ci'
        DB_USERNAME = 'lumera'
        DB_PASSWORD = 'lumera-ci-password'
    }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Validate Docker setup') {
            steps {
                sh '''
                    set -eu
                    docker --version
                    docker compose version
                    docker compose config --quiet
                '''
            }
        }

        stage('Backend tests') {
            steps {
                sh '''
                    set -eu
                    docker compose up -d mysql
                    mysql_id="$(docker compose ps -q mysql)"
                    until [ "$(docker inspect --format='{{.State.Health.Status}}' "$mysql_id")" = healthy ]; do
                      if [ "$(docker inspect --format='{{.State.Status}}' "$mysql_id")" = exited ]; then
                        docker compose logs mysql
                        exit 1
                      fi
                      sleep 3
                    done
                    docker run --rm \
                      --network lumera-ci_default \
                      -e DB_URL='jdbc:mysql://mysql:3306/lumera_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true' \
                      -e DB_USERNAME="$DB_USERNAME" \
                      -e DB_PASSWORD="$DB_PASSWORD" \
                      -e JWT_SECRET='ci-only-secret-key-at-least-32-characters-long' \
                      -v "$WORKSPACE/backend:/app" \
                      -w /app \
                      eclipse-temurin:21-jdk \
                      sh -c 'chmod +x mvnw && ./mvnw --batch-mode test'
                '''
            }
        }

        stage('Build application images') {
            steps { sh 'docker compose build --pull' }
        }

        stage('Run stack and smoke check') {
            steps {
                sh '''
                    set -eu
                    docker compose up -d
                    curl --fail --silent --show-error --retry 24 --retry-connrefused --retry-delay 5 http://localhost/
                    curl --fail --silent --show-error --retry 24 --retry-connrefused --retry-delay 5 http://localhost/api/products
                    docker compose ps
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose logs --no-color > jenkins-compose.log 2>&1 || true'
            archiveArtifacts artifacts: 'jenkins-compose.log', allowEmptyArchive: true
            sh 'docker compose down --volumes --remove-orphans || true'
        }
        success { echo 'Lumera build and smoke checks passed.' }
        failure { echo 'Lumera pipeline failed. See the failed stage and archived Compose logs.' }
    }
}
