// Graph
interface WeightedGraph<T> {
  addVertex(vertex: T): void;

  addEdge(vertex1: T, vertex2: T, weight: number): void;

  getVertices(): Map<T, Map<T, number>>;
}

class WeightedGraphImpl<T> implements WeightedGraph<T> {
  vertices: Map<T, Map<T, number>> = new Map();

  addVertex(vertex: T): void {
    this.vertices.set(vertex, new Map());
  }

  addEdge(vertex1: T, vertex2: T, weight: number): void {
    const vertex = this.vertices.get(vertex1);
    vertex && vertex.set(vertex2, weight);
  }

  getVertices(): Map<T, Map<T, number>> {
    return this.vertices;
  }
}

// Vertex / Edge
class Vertex<T> {
  constructor(public value: T) {
  }
}

const vertices = [
  new Vertex('1'),
  new Vertex('2'),
  new Vertex('3'),
  new Vertex('4'),
  new Vertex('5'),
];

class Edge<T> {
  weight: number;
  from: Vertex<T>;
  to: Vertex<T>;

  constructor(from: Vertex<T>, to: Vertex<T>, weight: number) {
    this.weight = weight;
    this.from = from;
    this.to = to;
  }
}

const edges = [
  new Edge(vertices[0], vertices[3], 3),
  new Edge(vertices[0], vertices[1], 5),
  new Edge(vertices[0], vertices[2], 4),
  new Edge(vertices[1], vertices[3], 6),
  new Edge(vertices[1], vertices[2], 5),
];

// WeightedGraphImpl usages
const graph: WeightedGraph<Vertex<string>> = new WeightedGraphImpl<Vertex<string>>();
vertices.forEach(verticle => graph.addVertex(verticle));
edges.forEach(edge => graph.addEdge(edge.from, edge.to, edge.weight));

// Dijkstra
interface Path {
  path: string[];
  distance: number;
}

interface Dijkstra<T> {
  findShortestPath(vertex1: T, vertex2: T): Path;

  findAllShortestPaths(vertex: T): Record<string, Path>;
}

class DijkstraImpl<T> implements Dijkstra<T> {
  private readonly graph: WeightedGraph<T>;

  constructor(graph: WeightedGraph<T>) {
    this.graph = graph;
  }

  calculatedShortestPath(vertex1: T, vertex2: T): Path {
    const vertices = this.graph.getVertices();
    const infinityPath = { path: [], distance: Infinity };

    if (!vertices.has(vertex1) || !vertices.has(vertex2)) {
      return infinityPath;
    }

    const distances: Map<T, number> = new Map();
    const visited: Set<T> = new Set();
    const previous: Map<T, T> = new Map();
    const pq: Array<[T, number]> = [];

    vertices.forEach((edges, vertex) => {
      if (vertex === vertex1) {
        distances.set(vertex, 0);
        pq.push([vertex, 0]);
      } else {
        distances.set(vertex, Infinity);
      }
    });

    while (pq.length) {
      const [current] = pq.shift()!;
      visited.add(current);

      if (current === vertex2 && vertex2 instanceof Vertex<string>) {
        const path: T[] = [vertex2.value];
        let node: T | undefined = previous.get(vertex2);

        while (node && node instanceof Vertex<string>) {
          path.push(node.value);
          node = previous.get(node);
        }
        return { path: path.reverse().map(String), distance: distances.get(vertex2)! };
      }

      const edges = vertices.get(current)!;
      edges.forEach((weight, neighbor) => {
        if (!visited.has(neighbor)) {
          const alt = distances.get(current)! + weight;

          if (alt < distances.get(neighbor)!) {
            distances.set(neighbor, alt);
            previous.set(neighbor, current);

            const index = pq.findIndex(([vertex]) => vertex === neighbor);

            if (index === -1) {
              pq.push([neighbor, alt]);
            } else {
              pq.splice(index, 1, [neighbor, alt]);
            }

            pq.sort((a, b) => a[1] - b[1]);
          }
        }
      });
    }

    return infinityPath;
  }

  findShortestPath(vertex1: T, vertex2: T): Path {
    const vertices = this.graph.getVertices();

    if (!vertices.size) {
      return {path: [], distance: Infinity};
    }

    if (vertex1 === vertex2) {
      const isVertex = vertex1 instanceof Vertex<string>;
      return {path: [isVertex ? vertex1.value : []], distance: 0};
    }

    const nearestNodeFromTo = vertices.get(vertex1)?.get(vertex2)!;
    const nearestNodeToFrom = vertices.get(vertex2)?.get(vertex1)!;
    if (nearestNodeFromTo || nearestNodeToFrom) {
      const isVertexes = vertex1 instanceof Vertex<string> && vertex2 instanceof Vertex<string>;
      const path = isVertexes ? [vertex1.value, vertex2.value] : [];
      return {path, distance: nearestNodeFromTo || nearestNodeToFrom};
    }

    return this.calculatedShortestPath(vertex1, vertex2);
  }

  findAllShortestPaths(vertex: T): Record<string, Path> {
    const vertices = this.graph.getVertices();
    const distances: Map<T, number> = new Map();
    const previousNodes: Map<T, T | null> = new Map();
    const queue: T[] = [];

    vertices.forEach((_, v) => {
      distances.set(v, Infinity);
      previousNodes.set(v, null);
      queue.push(v);
    });
    distances.set(vertex, 0);

    while (queue.length > 0) {
      const currentNode: T = queue.reduce((minNode, node) => (
        distances.get(node)! < distances.get(minNode)! ? node : minNode
      ));

      queue.splice(queue.indexOf(currentNode), 1);

      vertices.get(currentNode)?.forEach((weight, neighbor) => {
        const altDistance = distances.get(currentNode)! + weight;
        if (altDistance < distances.get(neighbor)!) {
          distances.set(neighbor, altDistance);
          previousNodes.set(neighbor, currentNode);
        }
      });
    }

    const result: Record<string, Path> = {};
    vertices.forEach((value, key) => {
      const path: T[] = [];
      let current = key;
      while (previousNodes.get(current) !== null) {
        path.unshift(current);
        current = previousNodes.get(current)!;
      }
      if (path.length > 0 && key instanceof Vertex<string>) {
        path.unshift(current);
        result[key.value] = {
          distance: distances.get(key)!,
          path: path.map(vert => {
            return vert instanceof Vertex<string> && vert.value;
          }),
        };
      }
    });

    return result;
  }
}

// // DijkstraImpl usages
const dijkstra: Dijkstra<Vertex<string>> = new DijkstraImpl<Vertex<string>>(graph);

const vertex1 = vertices[0];
const vertex2 = vertices[1];
const vertex3 = vertices[2];
const vertex4 = vertices[3];
const vertex5 = vertices[4];
const vertex6 = vertices[5];


// console.log(dijkstra.findShortestPath(vertex1, vertex5));
// console.log(dijkstra.findShortestPath(vertex4, vertex3));
// console.log(dijkstra.findShortestPath(vertex3, vertex4));
// console.log(dijkstra.findShortestPath(vertex1, vertex1));
// console.log(dijkstra.findShortestPath(vertex1, vertex2));
// console.log(dijkstra.findShortestPath(vertex2, vertex4));
// console.log(dijkstra.findShortestPath(vertex2, vertex3));
// console.log(dijkstra.findShortestPath(vertex2, vertex5));
// console.log(dijkstra.findShortestPath(vertex5, vertex2));
// console.log(dijkstra.findShortestPath(vertex5, vertex5));
// console.log(dijkstra.findShortestPath(vertex6, vertex5));
// console.log(dijkstra.findShortestPath(vertex3, vertex1));
// console.log(dijkstra.findShortestPath(vertex3, vertex2));
// console.log(dijkstra.findShortestPath(vertex2, vertex1));

// console.log(dijkstra.findAllShortestPaths(vertex4));
// console.log(dijkstra.findAllShortestPaths(vertex1));

const vertices2 = [  new Vertex('1'),  new Vertex('2'),  new Vertex('3'),  new Vertex('4'),  new Vertex('5'), new Vertex('6')];
const edges2 = [
  new Edge(vertices2[0], vertices2[1], 3),
  new Edge(vertices2[0], vertices2[5], 4),
  new Edge(vertices2[0], vertices2[2], 10),
  new Edge(vertices2[1], vertices2[2], 1),
  new Edge(vertices2[2], vertices2[3], 2),
  new Edge(vertices2[3], vertices2[4], 7),
  new Edge(vertices2[4], vertices2[5], 8),
  new Edge(vertices2[5], vertices2[3], 11),
];
const graph2: WeightedGraph<Vertex<string>> = new WeightedGraphImpl<Vertex<string>>();
vertices2.forEach(verticle => graph2.addVertex(verticle));
edges2.forEach(edge => graph2.addEdge(edge.from, edge.to, edge.weight));
const dijkstra2: Dijkstra<Vertex<string>> = new DijkstraImpl<Vertex<string>>(graph2);
const vertexGraph1 = vertices2[0];
const vertexGraph2 = vertices2[1];
const vertexGraph3 = vertices2[2];
const vertexGraph4 = vertices2[3];
const vertexGraph5 = vertices2[4];
const vertexGraph6 = vertices2[5];
const vertexGraph7 = vertices2[6];

console.log(dijkstra2.findShortestPath(vertexGraph1, vertexGraph4));
console.log(dijkstra2.findShortestPath(vertexGraph1, vertexGraph5));
console.log(dijkstra2.findAllShortestPaths(vertexGraph2));
