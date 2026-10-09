# Jenkins and Docker setup

The repository contains a `Jenkinsfile`, a Compose file, and separate Dockerfiles for the React/Vite frontend and Spring Boot backend. Docker Compose starts MySQL, the API, and Nginx; Nginx serves the frontend and proxies `/api` and `/uploads` to the backend.

## Run locally

1. Install Docker Engine/Desktop with the Compose v2 plugin.
2. Copy `.env.example` to `.env` and set database credentials and a long random `JWT_SECRET`.
3. From the repository root, run:

   ```sh
   docker compose up --build -d
   docker compose ps
   ```

4. Open `http://localhost` (or the port set by `APP_PORT`). To inspect startup errors, run `docker compose logs -f`.
5. Stop the stack with `docker compose down`. Add `--volumes` only when you also intend to delete the database and uploaded product images.

PayHere credentials are optional to start the app, but needed to process PayHere payments. Set the production checkout URL, merchant credentials, and public return/cancel/notify URLs in `.env`. Keep the merchant secret out of frontend settings and source control.

## Jenkins agent requirements

Use a Linux Jenkins agent labeled `docker` with Docker Engine, Docker Compose v2, Git, `curl`, and permission to use the Docker daemon. The pipeline builds a temporary isolated stack and removes its containers, network, and CI volumes when finished. It does not deploy to a production host.

## Create the Jenkins job

1. Create a **Pipeline** job and choose **Pipeline script from SCM**.
2. Select Git, enter the repository URL and credentials, then choose the branch (commonly `*/main`).
3. Set **Script Path** to `Jenkinsfile`, save, and run the job.

The pipeline validates Compose, starts a disposable MySQL for the Spring context test, runs backend tests, builds both application images, starts the complete stack, and checks the frontend and public products API. It archives Compose logs as `jenkins-compose.log` even when a stage fails.

For deployment, run `docker compose up -d --build` on the deployment host after configuring its `.env` from `.env.example`; keep production secrets in Jenkins credentials or a host secret manager. Do not run a production deployment on the CI job's workspace.

## Windows note

The Jenkinsfile uses Linux shell commands and a Docker socket. Use a Linux agent, including a Linux VM or WSL2-based agent, rather than a native Windows agent.
