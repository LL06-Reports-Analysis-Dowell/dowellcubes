# DoWell Cubes

## Getting Started with DoWellCubes 🛠️

### Prerequisites 📋

Before you start, make sure you have the following:

- **Docker Installed:** DoWellCubes runs inside Docker containers, so ensure Docker is installed and running on your system. 🐳
  - You can check if Docker is running by using this command:
    ```bash
    docker info
    ```

- **Docker Images:** Ensure you have the required Docker images for DoWellCubes available.

### Starting DoWellCubes 🚦

You can start DoWellCubes interactively based on what components you need to run. Here's how:

1. **Make the Startup Script Executable:**

   First, give the `DoWellCubes.sh` script execute permissions:

   ```bash
   chmod +x dowellcubes.sh
   ```

2. **Run the Interactive Menu:**

   To run DoWellCubes interactively, simply execute the script:

   ```bash
   ./dowellcubes.sh
   ```

   You'll then be prompted to choose which services to run:

   ```text
   Please select the service you want to run:
   1) All (This will remove all containers and images and start everything from scratch. NOTE: It will take time)
   2) Server (Only start the server)
   3) Client (Only start the client)
   4) Server & Client (Start both server and client)
   5) Exit
   Enter your choice [1-5]:
   ```

3. **Choose an Option:**

   - **Option 1:** Start **All** — This will clean up any existing DoWellCubes containers, images, and volumes, then build everything from scratch. (⚠️ This option will take time.)
   - **Option 2:** Start **only the server**.
   - **Option 3:** Start **only the client**.
   - **Option 4:** Start **both the server and client** without cleanup.
   - **Option 5:** **Exit** the script.

4. **Docker Commands:** If you want to manually start DoWellCubes without the script, you can run:
   ```bash
   docker-compose --env-file .env.development -f docker-compose.dev.yml up --build
   ```

### Docker Management Tips 📝

- **Backup Data:** Before running any cleanup operation, ensure you backup critical data. 💾
- **Check Logs for Errors:** If you face any issues during the setup or operation, you can check the Docker logs:
  ```bash
  docker logs <container_name>
  ```
