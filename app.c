#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <unistd.h>  
#define ROWS 10
#define COLS 10

int dirX[] = {0, 1, 0, -1};
int dirY[] = {1, 0, -1, 0};

typedef struct {
    int x, y;
} Point;

//linked list
typedef struct Node {
    Point point;
    struct Node* next;
} Node;

Node* front = NULL;
Node* rear = NULL;

// Grid and state
char grid[ROWS][COLS];
bool visited[ROWS][COLS];
Point start = {-1, -1};
Point end = {-1, -1};

// Tree
typedef struct TreeNode {
    Point point;
    struct TreeNode* parent;
} TreeNode;

// Queue 
void enqueue(Point p) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->point = p;
    newNode->next = NULL;
    
    if (rear == NULL) {
        front = rear = newNode;
        return;
    }
    
    rear->next = newNode;
    rear = newNode;
}

Point dequeue() {
    if (front == NULL) {
        printf("Queue is empty.\n");
        return (Point){-1, -1};  // Return an invalid point
    }
    Node* temp = front;
    Point p = front->point;
    front = front->next;
    
    if (front == NULL) {
        rear = NULL;
    }
    
    free(temp);
    return p;
}

bool isEmpty() {
    return front == NULL;
}

// Tree
TreeNode* createTreeNode(Point point, TreeNode* parent) {
    TreeNode* newNode = (TreeNode*)malloc(sizeof(TreeNode));
    newNode->point = point;
    newNode->parent = parent;
    return newNode;
}

void reconstructPath(TreeNode* endNode) {
    TreeNode* current = endNode;
    while (current != NULL) {
        grid[current->point.x][current->point.y] = '*';  // Mark path
        current = current->parent;
    }
}

void initializeGrid() {
    for (int i = 0; i < ROWS; i++) {
        for (int j = 0; j < COLS; j++) {
            grid[i][j] = '.';  
            visited[i][j] = false;
        }
    }
    grid[start.x][start.y] = 'S';  
    grid[end.x][end.y] = 'E';      
}

void clearScreen() {
    printf("\033[H\033[J");
}

void bfs() {
    if (start.x == -1 || end.x == -1) {
        printf("Start or end point not set.\n");
        return;
    }

    enqueue(start);
    visited[start.x][start.y] = true;

    TreeNode* startNode = createTreeNode(start, NULL); 
    TreeNode* endNode = NULL;  

    while (!isEmpty()) {
        Point current = dequeue();
        clearScreen();

        if (grid[current.x][current.y] != 'S' && grid[current.x][current.y] != 'E') {
            grid[current.x][current.y] = 'V';  
        }

        for (int i = 0; i < ROWS; i++) {
            for (int j = 0; j < COLS; j++) {
                printf("%c ", grid[i][j]);
            }
            printf("\n");
        }

        usleep(300000);  

        if (current.x == end.x && current.y == end.y) {
            break;
        }

        for (int i = 0; i < 4; i++) {
            int newX = current.x + dirX[i];
            int newY = current.y + dirY[i];

            if (newX >= 0 && newY >= 0 && newX < ROWS && newY < COLS &&
                !visited[newX][newY] && grid[newX][newY] != '#') {
                
                visited[newX][newY] = true;
                enqueue((Point){newX, newY});
                
                TreeNode* parentNode = createTreeNode((Point){current.x, current.y}, NULL);
                if (endNode == NULL) {
                    endNode = parentNode;  
                }
            }
        }
    }

    reconstructPath(endNode);
}

void takeInput() {
    int startX, startY, endX, endY, numObstacles, obsX, obsY;

    printf("Enter the start point coordinates (x y): ");
    scanf("%d %d", &startX, &startY);
    start = (Point){startX, startY};

    printf("Enter the end point coordinates (x y): ");
    scanf("%d %d", &endX, &endY);
    end = (Point){endX, endY};

    initializeGrid();

    printf("Enter the number of obstacles: ");
    scanf("%d", &numObstacles);

    for (int i = 0; i < numObstacles; i++) {
        printf("Enter obstacle %d coordinates (x y): ", i + 1);
        scanf("%d %d", &obsX, &obsY);
        if (obsX >= 0 && obsX < ROWS && obsY >= 0 && obsY < COLS &&
            (obsX != start.x || obsY != start.y) && (obsX != end.x || obsY != end.y)) {
            grid[obsX][obsY] = '#';
        } else {
            printf("Invalid obstacle position. It cannot overlap with the start or end.\n");
        }
    }
}

int main() {
    takeInput();
    bfs();

    return 0;
}
