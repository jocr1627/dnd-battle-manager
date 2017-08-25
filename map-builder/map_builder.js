// declare global variables which cannot be written
/* global cytoscape:false document:false window:false */

function addRegion(cy) {
  let name = window.prompt('What is the name of this region?');
  cy.add({
    data: { id: name },
    position: { x: 0, y: 0 },
  });
}

function removeRegion(cy) {
  let name = window.prompt('What is the name of the region to remove?');
  let node = cy.$id(name);
  if (!node.length) {
    window.alert(`No region named "${name}" exists.`);
    return;
  }
  cy.remove(node);
}

function removeConnection(cy) {
  let name = window.prompt('Enter the names of the connected regions with a "-", like "Stairs-Balcony"');
  let node = cy.$id(name);
  if (!node.length) {
    // If the user provides a region name with a hyphen this will look weird, but
    // internally we use edge IDs of Node1-Node2, so if it shows up there was still an error
    window.alert(`There is no connection between ${name.split('-')[0]} and ${name.split('-')[1]}`);
    return;
  }
  cy.remove(node);
}

function convertJsonToMap(json) {
  let elements = json.elements;
  if (!elements.nodes) { elements.nodes = []; }
  if (!elements.edges) { elements.edges = []; }
  elements.nodes = elements.nodes.map((node) => ({
    name: node.data.id,
  }));
  elements.edges = elements.edges.map((edge) => ({
    node0: edge.data.source,
    node1: edge.data.target,
  }));
  return JSON.stringify(elements, null, 2);
}

function populateJson(cy) {
  let jsonContainer = document.getElementById('json_container');
  if (!jsonContainer) {
    throw new Error('No container for map JSON found');
  }
  jsonContainer.textContent = convertJsonToMap(cy.json());
}

function main() {
  // Initialize cytoscape
  let cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#555',
          'label': 'data(id)', // define node labels to be their ids
        },
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'background-color': '#ccc',
        },
      },
    ],
  });
  cy.edgehandles({
    toggleOffOnLeave: true, // make one edge at a time, but more intuitively
    edgeParams(sourceNode, targetNode) {
      const source = sourceNode.data('id');
      const target = targetNode.data('id');
      return {
        data: {
          id: `${source}-${target}`,
          source,
          target,
        },
      };
    },
  });

  // set up buttons
  function setUpButton(buttonName, clickHandler) {
    let button = document.getElementsByName(buttonName)[0];
    if (!button) { throw new Error(`Couldn't find a button named "${buttonName}"`); }
    button.onclick = function() {
      clickHandler(cy);
    };
  }

  setUpButton('add_region', addRegion);
  setUpButton('remove_region', removeRegion);
  setUpButton('remove_edge', removeConnection);
  setUpButton('json', populateJson);

}

main();
