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
    const isVertexes = vertex1 instanceof Vertex<string> && vertex2 instanceof Vertex<string>
    const result: Path = {path: [], distance: 0};
    const remoteLinks: Set<T> = new Set();

    vertices.forEach((value, key) => {
      value.has(vertex1 || vertex2) && remoteLinks.add(key);
    });

    if (remoteLinks.size < 2) {
      result.distance = Infinity;
      return result;
    }

    remoteLinks.forEach((valueRemote) => {
      const isVertex = isVertexes && valueRemote instanceof Vertex<string>
      let iteratedDistance: number = 0;
      iteratedDistance += vertices.get(valueRemote)?.get(vertex1)!;
      iteratedDistance += vertices.get(valueRemote)?.get(vertex2)!;
      if (!Number.isInteger(iteratedDistance)) {
        result.distance = Infinity;
        return result;
      }

      if (((!result.distance) || iteratedDistance < result.distance) && isVertex) {
        result.distance = iteratedDistance;
        result.path = [vertex1.value, valueRemote.value, vertex2.value];
      }
    });

    return result;
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
    const vertex2Lists: Set<T> = new Set();
    const result: Record<string, Path> = {};
    vertices.forEach((value, key) => {
      key !== vertex && vertex2Lists.add(key);
    });

    vertex2Lists.forEach((vertex2) => {
      const isVertex = vertex2 instanceof Vertex<string>;
      if (isVertex) {
        result[vertex2.value] = this.findShortestPath(vertex, vertex2);
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


console.log(dijkstra.findShortestPath(vertex1, vertex5));
console.log(dijkstra.findShortestPath(vertex4, vertex3));
console.log(dijkstra.findShortestPath(vertex3, vertex4));
console.log(dijkstra.findShortestPath(vertex1, vertex1));
console.log(dijkstra.findShortestPath(vertex1, vertex2));
console.log(dijkstra.findShortestPath(vertex2, vertex4));
console.log(dijkstra.findShortestPath(vertex2, vertex3));
console.log(dijkstra.findShortestPath(vertex2, vertex5));
console.log(dijkstra.findShortestPath(vertex5, vertex2));
console.log(dijkstra.findShortestPath(vertex5, vertex5));
console.log(dijkstra.findShortestPath(vertex6, vertex5));
console.log(dijkstra.findShortestPath(vertex3, vertex1));
console.log(dijkstra.findShortestPath(vertex3, vertex2));
console.log(dijkstra.findShortestPath(vertex2, vertex1));

console.log(dijkstra.findAllShortestPaths(vertex4));
console.log(dijkstra.findAllShortestPaths(vertex1));