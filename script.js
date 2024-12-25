let grid = [];
let start = { x: 0, y: 0 };
let end = { x: 9, y: 9 };
let obstacles = [];
let numObstacles = 0;
let visited = [];
let prev = [];

// Directions for BFS (Right, Down, Left, Up)
const dirX = [0, 1, 0, -1];
const dirY = [1, 0, -1, 0];

// Function to initialize the grid
function initializeGrid() {
    grid = [];
    visited = [];
    prev = [];
    for (let i = 0; i < 10; i++) {
        grid[i] = [];
        visited[i] = [];
        prev[i] = [];
        for (let j = 0; j < 10; j++) {
            grid[i][j] = '.';
            visited[i][j] = false;
            prev[i][j] = null;
        }
    }
    // Set start and end points
    grid[start.x][start.y] = 'S';
    grid[end.x][end.y] = 'E';
}

// Function to draw the grid
function drawGrid() {
    const gridContainer = document.getElementById("grid");
    gridContainer.innerHTML = '';  // Clear the grid

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            
            if (grid[i][j] === 'S') {
                cell.classList.add("start");
            } else if (grid[i][j] === 'E') {
                cell.classList.add("end");
            } else if (grid[i][j] === 'V') {
                cell.classList.add("visited");
            } else if (grid[i][j] === '#') {
                cell.classList.add("obstacle");
            } else if (grid[i][j] === '*') {
                cell.classList.add("path");
            }

            gridContainer.appendChild(cell);
        }
    }
}

// Queue operations for BFS
let queue = [];
function enqueue(p) {
    queue.push(p);
}

function dequeue() {
    return queue.shift();
}

function isEmpty() {
    return queue.length === 0;
}

// BFS Algorithm
function bfs() {
    enqueue(start);
    visited[start.x][start.y] = true;

    while (!isEmpty()) {
        let current = dequeue();

        if (current.x === end.x && current.y === end.y) {
            break;
        }

        // Explore 4 directions
        for (let i = 0; i < 4; i++) {
            let newX = current.x + dirX[i];
            let newY = current.y + dirY[i];

            if (newX >= 0 && newY >= 0 && newX < 10 && newY < 10 &&
                !visited[newX][newY] && grid[newX][newY] !== '#') {
                visited[newX][newY] = true;
                enqueue({ x: newX, y: newY });
                prev[newX][newY] = current;
                grid[newX][newY] = 'V';
                drawGrid();
            }
        }
    }

    // Trace the path from end to start
    let at = end;
    while (prev[at.x][at.y]) {
        grid[at.x][at.y] = '*';
        at = prev[at.x][at.y];
    }
    drawGrid();
}

// Function to show the obstacle input form
function showObstacleInputs() {
    const obstacleInputContainer = document.getElementById("obstacleInputContainer");
    const obstacleInputs = document.getElementById("obstacleInputs");
    
    obstacleInputs.innerHTML = '';  // Clear previous inputs

    for (let i = 0; i < numObstacles; i++) {
        const obstacleInput = document.createElement("div");
        obstacleInput.innerHTML = `
            <label for="obsX${i}">Obstacle ${i + 1} X:</label>
            <input type="number" id="obsX${i}" min="0" max="9">
            <label for="obsY${i}">Obstacle ${i + 1} Y:</label>
            <input type="number" id="obsY${i}" min="0" max="9">
        `;
        obstacleInputs.appendChild(obstacleInput);
    }

    obstacleInputContainer.style.display = 'block';
    document.getElementById("startBFSButton").style.display = 'inline-block';  // Show the Start button
}

// Function to get obstacle positions from the user
function getObstaclesFromInput() {
    obstacles = [];

    for (let i = 0; i < numObstacles; i++) {
        const obsX = parseInt(document.getElementById(`obsX${i}`).value);
        const obsY = parseInt(document.getElementById(`obsY${i}`).value);

        // Validate obstacle position
        if ((obsX === start.x && obsY === start.y) || (obsX === end.x && obsY === end.y)) {
            alert(`Obstacle ${i + 1} cannot overlap with start or end point.`);
            return false;
        }
        if (obsX < 0 || obsX > 9 || obsY < 0 || obsY > 9) {
            alert(`Obstacle ${i + 1} has invalid coordinates.`);
            return false;
        }

        obstacles.push({ x: obsX, y: obsY });
    }

    return true;
}

// Function to place obstacles on the grid
function placeObstacles() {
    for (let obs of obstacles) {
        grid[obs.x][obs.y] = '#';  // Mark obstacle on the grid
    }
}

// Start the visualization
function startVisualizing() {
    start.x = parseInt(document.getElementById("startX").value);
    start.y = parseInt(document.getElementById("startY").value);
    end.x = parseInt(document.getElementById("endX").value);
    end.y = parseInt(document.getElementById("endY").value);
    numObstacles = parseInt(document.getElementById("numObstacles").value);

    if (numObstacles < 0 || numObstacles > 98) {
        alert("Number of obstacles must be between 0 and 98.");
        return;
    }

    // Initialize the grid
    initializeGrid();

    // If there are obstacles, show the input form
    if (numObstacles > 0) {
        showObstacleInputs();
    } else {
        startBFS();
    }
}

// Function to start BFS after obstacle inputs
function startBFS() {
    if (numObstacles > 0 && !getObstaclesFromInput()) {
        return;  // If obstacles are invalid, stop
    }

    // Place obstacles on the grid
    placeObstacles();

    // Draw the initial grid
    drawGrid();

    // Run BFS
    bfs();
}
