pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        DB_USERNAME = 'lumera'
        DB_PASSWORD = 'lumera-ci-password'
        DB_ROOT_PASSWORD = 'ci-root-password'
        JWT_SECRET = credentials('lumera-jwt-secret')

        CI_NETWORK = 'lumera-ci-network'
        MYSQL_CONTAINER = 'lumera-ci-mysql'
        BACKEND_CONTAINER = 'lumera-ci-backend'
        FRONTEND_CONTAINER = 'lumera-ci-frontend'

        MYSQL_VOLUME = 'lumera-ci-mysql-data'
        UPLOADS_VOLUME = 'lumera-ci-uploads'

        BACKEND_TEST_IMAGE = 'lumera-ci-backend-test:build'
        BACKEND_IMAGE = 'lumera-ci-backend:build'
        FRONTEND_IMAGE = 'lumera-ci-frontend:build'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                sh '''
                    set -eu
                    echo "Checked out commit:"
                    git rev-parse HEAD
                    echo "Workspace:"
                    pwd
                    test -f Jenkinsfile
                '''
            }
        }

        stage('Validate Docker setup') {
            steps {
                sh '''
                    set -eu
                    docker --version
                    docker info
                    test -f backend/pom.xml
                    test -f backend/mvnw
                    test -f backend/Dockerfile
                    test -f frontend/Dockerfile
                    echo "Required project files found."
                '''
            }
        }

        stage('Prepare CI resources') {
            steps {
                sh '''
                    set -eu
                    docker rm -f "$FRONTEND_CONTAINER" "$BACKEND_CONTAINER" "$MYSQL_CONTAINER" 2>/dev/null || true
                    docker network rm "$CI_NETWORK" 2>/dev/null || true
                    # These are disposable CI volumes, not the local Compose volume.
                    docker volume rm "$MYSQL_VOLUME" "$UPLOADS_VOLUME" 2>/dev/null || true
                    docker network create "$CI_NETWORK"
                    docker volume create "$MYSQL_VOLUME"
                    docker volume create "$UPLOADS_VOLUME"
                '''
            }
        }

        stage('Start MySQL') {
            steps {
                sh '''
                    set -eu
                    docker run -d \\
                      --name "$MYSQL_CONTAINER" \\
                      --network "$CI_NETWORK" \\
                      --network-alias mysql \\
                      --restart no \\
                      -e MYSQL_DATABASE=lumera_db \\
                      -e MYSQL_USER="$DB_USERNAME" \\
                      -e MYSQL_PASSWORD="$DB_PASSWORD" \\
                      -e MYSQL_ROOT_PASSWORD="$DB_ROOT_PASSWORD" \\
                      --mount "source=$MYSQL_VOLUME,target=/var/lib/mysql" \\
                      --health-cmd='mysqladmin ping -h 127.0.0.1 -uroot -p"$MYSQL_ROOT_PASSWORD" --silent' \\
                      --health-interval=5s \\
                      --health-timeout=5s \\
                      --health-start-period=30s \\
                      --health-retries=60 \\
                      mysql:8.4

                    attempt=0
                    while [ "$attempt" -lt 300 ]; do
                        state="$(docker inspect --format='{{.State.Status}}' "$MYSQL_CONTAINER")"
                        health="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$MYSQL_CONTAINER")"
                        echo "MySQL state=$state health=$health attempt=$attempt/300"
                        if [ "$health" = healthy ]; then
                            echo "MySQL is healthy."
                            exit 0
                        fi
                        if [ "$state" = exited ] || [ "$state" = dead ]; then
                            docker logs "$MYSQL_CONTAINER" || true
                            exit 1
                        fi
                        attempt=$((attempt + 1))
                        sleep 3
                    done
                    echo "MySQL health check timed out."
                    docker inspect "$MYSQL_CONTAINER" || true
                    docker logs "$MYSQL_CONTAINER" || true
                    exit 1
                '''
            }
        }

        stage('Build backend test image') {
            steps {
                sh '''
                    set -eu
                    echo "Building test image from backend source."
                    # Docker gets the directory as build context; no workspace bind mount is used.
                    docker build --pull \\
                      --tag "$BACKEND_TEST_IMAGE" \\
                      --file - backend <<'DOCKERFILE'
FROM eclipse-temurin:25-jdk
WORKDIR /app
COPY . /app
RUN chmod +x ./mvnw
ENTRYPOINT ["./mvnw"]
DOCKERFILE
                '''
            }
        }

        
        stage('Backend tests') {
            steps {
                sh '''
                  set -eu

                   echo "Checking MySQL health..."
                  docker inspect --format='{{.State.Status}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' "$MYSQL_CONTAINER"

                 echo "Checking database connectivity..."
                 docker run --rm \
                      --network "$CI_NETWORK" \
                      -e MYSQL_PWD="$DB_PASSWORD" \
                      mysql:8.4 \
                      mysqladmin ping -h mysql -u "$DB_USERNAME" --silent

                   echo "Running Maven tests..."
                    docker run --rm \
                     --network "$CI_NETWORK" \
                    -e DB_URL='jdbc:mysql://mysql:3306/lumera_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true' \
                    -e DB_USERNAME="$DB_USERNAME" \
                     -e DB_PASSWORD="$DB_PASSWORD" \
                     -e JWT_SECRET="$JWT_SECRET" \
                    "$BACKEND_TEST_IMAGE" \
                    --batch-mode --no-transfer-progress test
        '''
    }
}


        stage('Build application images') {
            steps {
                sh '''
                    set -eu
                    docker build --pull --tag "$BACKEND_IMAGE" ./backend
                    docker build --pull --tag "$FRONTEND_IMAGE" ./frontend
                '''
            }
        }

        stage('Start application') {
            steps {
                sh '''
                    set -eu
                    docker run -d \\
                      --name "$BACKEND_CONTAINER" \\
                      --network "$CI_NETWORK" \\
                      --network-alias backend \\
                      --restart no \\
                      -e DB_URL='jdbc:mysql://mysql:3306/lumera_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true' \\
                      -e DB_USERNAME="$DB_USERNAME" \\
                      -e DB_PASSWORD="$DB_PASSWORD" \\
                      -e JWT_SECRET="$JWT_SECRET" \\
                      -e CORS_ALLOWED_ORIGINS='http://localhost' \\
                      -e PAYHERE_CURRENCY=USD \\
                      -e PAYHERE_CHECKOUT_URL='https://sandbox.payhere.lk/pay/checkout' \\
                      -e PAYHERE_RETURN_URL='http://localhost/payment/success?orderId={orderId}' \\
                      -e PAYHERE_CANCEL_URL='http://localhost/payment/cancel?orderId={orderId}' \\
                      -e PAYHERE_NOTIFY_URL='http://localhost/api/payments/payhere/notify' \\
                      -e UPLOAD_DIR=/app/uploads/products \\
                      --mount "source=$UPLOADS_VOLUME,target=/app/uploads" \\
                      "$BACKEND_IMAGE"

                    docker run -d \\
                      --name "$FRONTEND_CONTAINER" \\
                      --network "$CI_NETWORK" \\
                      --network-alias frontend \\
                      --restart no \\
                      "$FRONTEND_IMAGE"
                    docker ps --filter "network=$CI_NETWORK"
                '''
            }
        }

        stage('Smoke tests') {
            steps {
                sh '''
                    set -eu
                    echo "Checking frontend..."
                    attempt=0
                    until docker run --rm \\
                      --network "$CI_NETWORK" \\
                      curlimages/curl:8.12.1 \\
                      --fail --silent --show-error \\
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

                    echo "Checking products API..."
                    docker run --rm \\
                      --network "$CI_NETWORK" \\
                      curlimages/curl:8.12.1 \\
                      --fail --silent --show-error \\
                      --retry 12 --retry-connrefused --retry-delay 5 \\
                      http://frontend/api/products
                    echo "Frontend and products API checks passed."
                '''
            }
        }
    }

    post {
        always {
            sh '''
                echo "Collecting diagnostic logs..."
                docker logs "$MYSQL_CONTAINER" > jenkins-mysql.log 2>&1 || true
                docker logs "$BACKEND_CONTAINER" > jenkins-backend.log 2>&1 || true
                docker logs "$FRONTEND_CONTAINER" > jenkins-frontend.log 2>&1 || true
                docker ps -a > jenkins-docker-ps.log 2>&1 || true

                echo "Cleaning up CI containers..."
                docker rm -f "$FRONTEND_CONTAINER" "$BACKEND_CONTAINER" "$MYSQL_CONTAINER" 2>/dev/null || true
                docker network rm "$CI_NETWORK" 2>/dev/null || true
                docker volume rm "$MYSQL_VOLUME" "$UPLOADS_VOLUME" 2>/dev/null || true
            '''
            archiveArtifacts artifacts: 'jenkins-*.log', allowEmptyArchive: true
        }
        success {
            echo 'Lumera build, backend tests, and smoke checks passed.'
        }
        failure {
            echo 'Pipeline failed. Review the failed stage and archived logs.'
        }
    }
}
