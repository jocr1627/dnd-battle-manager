class Edge {
  constructor(rawEdge) {
    const {
      node0,
      node1,
      type,
    } = rawEdge;

    this.node0 = node0;
    this.node1 = node1;
    this.type = type;
  }
}

class Node {
  constructor(rawNode) {
    const {
      name,
    } = rawNode;

    this.edges = {
      movement: {},
      sight: {},
    };
    this.name = name;
    this.occupants = {};
  }
}

export default class Map {
  constructor(rawNodes, rawEdges) {
    this.nodes = rawNodes.reduce((acc, rawNode) => {
      const name = rawNode.name;

      acc[name] = new Node(rawNode);

      return acc;
    }, {});

    rawEdges.forEach((rawEdge) => {
      const edge = new Edge(rawEdge);
      const node0 = this.nodes[edge.node0];
      const node1 = this.nodes[edge.node1];
  
      node0.edges[edge.type][node1.name] = edge;
      node1.edges[edge.type][node0.name] = edge;
    });
  }
}
