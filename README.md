# Minesweeper webapp

![picture of the app](src/img/minesweeper-webapp_02.png)

### using docker

    docker build -t minesweeper --target prod .
    docker run -p 8080:8080 minesweeper
or
    docker compose up