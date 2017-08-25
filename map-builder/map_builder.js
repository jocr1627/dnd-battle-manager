// declare global variables which cannot be written
/* global cytoscape:false document:false */

function main() {
  let cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      {
        data: { id: 'A' },
      },
      {
        data: { id: 'B' },
      },
      {
        data: { id: 'C' },
      },
      {
        data: { id: 'AB', source: 'A', target: 'B' },
      },
    ],
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
    layout: {
      name: 'random',
    },
  });

  cy.edgehandles({});
}

main();
