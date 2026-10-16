
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 40, unit: 'MINUTES')
    }

    environment {
        DB_USERNAME = 'lumera'
        DB_PASSWORD = 'lumera-ci-password'
        DB_ROOT_PASSWORD = 'ci-root-password'
        JWT_SECRET = 'ci-only-secret-key-at-least-32-characters-long'

        CI_NETWORK = 'lumera-ci-network'
        MYSQL_CONTAINER = 'lumera-ci-mysql'
        BACKEND_CONTAINER = 'lumera-ci-backend'
        FRONTEND_CONTAINER = 'lumera-ci-frontend'

        MYSQL_VOLUME = 'lumera-ci-mysql-data'
        UPLOADS_VOLUME = 'lumera-ci-uploads'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Docker setup') {
            steps {
                sh '''
                    set -eu
                    docker --version
                    docker info
                '''
            }
        }

        stage('Start MySQL') {
            steps {
                sh '''
                    set -eu

                    docker network create "$CI_NETWORK"
                    docker volume create "$MYSQL_VOLUME"

                    docker run -d \
                      --name "$MYSQL_CONTAINER" \
                      --network "$CI_NETWORK" \
                      --network-alias mysql \
                      --restart no \
                      -e MYSQL_DATABASE=lumera_db \
                      -e MYSQL_USER="$DB_USERNAME" \
                      -e MYSQL_PASSWORD="$DB_PASSWORD" \
                      -e MYSQL_ROOT_PASSWORD="$DB_ROOT_PASSWORD" \
                      --mount "source=$MYSQL_VOLUME,target=/var/lib/mysql" \
                      --health-cmd='mysqladmin ping -h localhost -uroot -pci-root-password --silent' \
                      --health-interval=5s \
                      --health-timeout=5s \
                      --health-retries=30 \
                      mysql:8.4

                    attempt=0
                    until [ "$(docker inspect --format='{{.State.Health.Status}}' "$MYSQL_CONTAINER")" = healthy ]; do
                      state="$(docker inspect --format='{{.State.Status}}' "$MYSQL_CONTAINER")"

                      if [ "$state" = exited ] || [ "$state" = dead ]; then
                        docker logs "$MYSQL_CONTAINER"
                        exit 1
                      fi

                      attempt=$((attempt + 1))
                      if [ "$attempt" -ge 60 ]; then
                        docker logs "$MYSQL_CONTAINER"
                        echo "MySQL health check timed out."
                        exit 1
                      fi

                      sleep 3
                    done
                '''
            }
        }

        stage('Backend tests') {
            steps {
                sh '''
                    set -eu

                    docker run --rm \
                      --network "$CI_NETWORK" \
                      -e DB_URL='jdbc:mysql://mysql:3306/lumera_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true' \
                      -e DB_USERNAME="$DB_USERNAME" \
                      -e DB_PASSWORD="$DB_PASSWORD" \
                      -e JWT_SECRET="$JWT_SECRET" \
                      -v "$WORKSPACE/backend:/app" \
                      -w /app \
                      eclipse-temurin:25-jdk \
                      sh -c 'chmod +x mvnw && ./mvnw --batch-mode test'
                '''
            }
        }

        stage('Build application images') {
            steps {
                sh '''
                    set -eu

                    docker build --pull \
                      -t lumera-ci-backend:build \
                      ./backend

                    docker build --pull \
                      -t lumera-ci-frontend:build \
                      ./frontend
                '''
            }
        }

        stage('Start application') {
            steps {
                sh '''
                    set -eu

                    docker volume create "$UPLOADS_VOLUME"

                    docker run -d \
                      --name "$BACKEND_CONTAINER" \
                      --network "$CI_NETWORK" \
                      --network-alias backend \
                      --restart no \
                      -e DB_URL='jdbc:mysql://mysql:3306/lumera_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true' \
                      -e DB_USERNAME="$DB_USERNAME" \
                      -e DB_PASSWORD="$DB_PASSWORD" \
                      -e JWT_SECRET="$JWT_SECRET" \
                      -e CORS_ALLOWED_ORIGINS='http://localhost' \
                      -e PAYHERE_CURRENCY=USD \
                      -e PAYHERE_CHECKOUT_URL='https://sandbox.payhere.lk/pay/checkout' \
                      -e PAYHERE_RETURN_URL='http://localhost/payment/success?orderId={orderId}' \
                      -e PAYHERE_CANCEL_URL='http://localhost/payment/cancel?orderId={orderId}' \
                      -e PAYHERE_NOTIFY_URL='http://localhost/api/payments/payhere/notify' \
                      -e UPLOAD_DIR=/app/uploads/products \
                      --mount "source=$UPLOADS_VOLUME,target=/app/uploads" \
                      lumera-ci-backend:build

                    docker run -d \
                      --name "$FRONTEND_CONTAINER" \
                      --network "$CI_NETWORK" \
                      --network-alias frontend \
                      --restart no \
                      lumera-ci-frontend:build

                    docker ps --filter "network=$CI_NETWORK"
                '''
            }
        }

        stage('Smoke tests') {
            steps {
                sh '''
                    set -eu

                    attempt=0
                    until docker run --rm \
                      --network "$CI_NETWORK" \
                      curlimages/curl:8.12.1 \
                      --fail --silent --show-error \
                      http://frontend/; do

                      attempt=$((attempt + 1))
                      if [ "$attempt" -ge 24 ]; then
                        echo "Frontend did not become ready."
                        docker logs "$FRONTEND_CONTAINER" || true
                        docker logs "$BACKEND_CONTAINER" || true
                        exit 1
                      fi
                      sleep 5
                    done

                    docker run --rm \
                      --network "$CI_NETWORK" \
                      curlimages/curl:8.12.1 \
                      --fail --silent --show-error \
                      --retry 12 --retry-connrefused --retry-delay 5 \
                      http://frontend/api/products

                    echo "Frontend and product API smoke tests passed."
                '''
            }
        }
    }

    post {
        always {
            sh '''
                docker logs "$MYSQL_CONTAINER" > jenkins-mysql.log 2>&1 || true
                docker logs "$BACKEND_CONTAINER" > jenkins-backend.log 2>&1 || true
                docker logs "$FRONTEND_CONTAINER" > jenkins-frontend.log 2>&1 || true
                docker ps -a > jenkins-docker-ps.log 2>&1 || true

                docker rm -f \
                  "$FRONTEND_CONTAINER" \
                  "$BACKEND_CONTAINER" \
                  "$MYSQL_CONTAINER" 2>/dev/null || true

                docker network rm "$CI_NETWORK" 2>/dev/null || true

                docker volume rm \
                  "$MYSQL_VOLUME" \
                  "$UPLOADS_VOLUME" 2>/dev/null || true
            '''

            archiveArtifacts(
                artifacts: 'jenkins-*.log',
                allowEmptyArchive: true
            )
        }

        success {
            echo 'Lumera build, tests, and smoke checks passed.'
        }

        failure {
            echo 'Lumera pipeline failed. Review the failed stage and archived logs.'
        }
    }
}
