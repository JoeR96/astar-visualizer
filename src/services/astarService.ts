import useGridStore from '../Grid/GridStore';
import { TileState } from '../enums/TileStates';

type Node = {
    x: number;
    y: number;
    cost: number;
    heuristic: number;
    total: number;
    parent?: Node;
    order: number;
};

export async function findPath(): Promise<Node[] | null> {
    const gridState = useGridStore.getState().getGridState();
    const start = useGridStore.getState().start;
    const end = useGridStore.getState().end;

    if (!start || !end) return null;

    const startNode: Node = { x: start.row, y: start.col, cost: 0, heuristic: 0, total: 0 };
    const queue: Node[] = [startNode];
    const visitedNodes: Node[] = [];
    const directions: { x: number, y: number }[] = [
        { x: 0, y: -1 },  // up
        { x: 0, y: 1 },   // down
        { x: -1, y: 0 },  // left
        { x: 1, y: 0 }    // right
    ];

    while (queue.length > 0) {
        let currentNode = queue.shift()!;

        if (currentNode.x === end.row && currentNode.y === end.col) {
            // Found the path. Reconstruct and return it.
            const path: Node[] = [];

            while (currentNode) {
                path.unshift(currentNode);
                currentNode = currentNode.parent;
            }

            // Update the path on the grid, excluding start and end
            for (let i = 0; i < path.length; i++) {
                const node = path[i];
                if (!((node.x === start.row && node.y === start.col) || (node.x === end.row && node.y === end.col))) {
                    // Animate the cell update using Framer Motion
                    const row = node.x;
                    const col = node.y;
                    await new Promise(resolve => setTimeout(resolve, 300)); // Adjust the delay time as needed
                    useGridStore.getState().setCell(row, col, TileState.PATH);
                }
            }

            return path;
        }

        for (const direction of directions) {
            const newX = currentNode.x + direction.x;
            const newY = currentNode.y + direction.y;

            if (
                newX >= 0 && newX < gridState.length &&
                newY >= 0 && newY < gridState[0].length &&
                gridState[newX][newY] !== TileState.OBSTACLE &&
                !visitedNodes.some(node => node.x === newX && node.y === newY) &&
                !queue.some(node => node.x === newX && node.y === newY)
            ) {
                const newNode: Node = {
                    x: newX, y: newY, cost: 0, heuristic: 0, total: 0, parent: currentNode
                };
                queue.push(newNode);
            }
        }

        visitedNodes.push(currentNode);
    }

    // If the queue is exhausted and we haven't returned by now, there's no path
    return null;
}



// Helper functions and A* logic goes here...
