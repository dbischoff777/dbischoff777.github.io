import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './socialMedia/sM.css';
import './PathfindingVisualizer.css';

const START_NODE_ROW = 20;
const START_NODE_COL = 20;
const FINISH_NODE_ROW = 1;
const FINISH_NODE_COL = 24;

export default class Visualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      value: 'Select Algorithm first',
    };
    this.clickFunction = this.clickFunction.bind(this);
  }
  
  changeValue(text) {
    this.setState({value: text})
  }

  clickFunction() {
    if (this.state.value === "Start Dijkstra Pathfinding")
      this.visualizeDijkstra()
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 9 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 9 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 24 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render = () => {
    
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
          <div class="container-fluid">
            <a class="navbar-brand" href="#">Logistical Pathfinder</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="navbar-nav">
                <li class="nav-item">
                  <a class="nav-link text-white" href="">Reset</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle text-white" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-expanded="false" href="#" >
                    Algorithms
                  </a>
                  <ul class="dropdown-menu bg-dark" aria-labelledby="navbarDropdownMenuLink">
                    {/* <li><a class="dropdown-item text-white" href="#" onClick={(e) => (this.changeValue("Start " + e.target.textContent + " Pathfinding"))}>A Star Search</a></li>
                    <li><a class="dropdown-item text-white" href="#" onClick={(e) => (this.changeValue("Start " + e.target.textContent + " Pathfinding"))}>Breadth-first Search</a></li> */}
                    <li><a class="dropdown-item text-white" href="#" onClick={(e) => (this.changeValue("Start " + e.target.textContent + " Pathfinding"))}>Dijkstra</a></li>
                  </ul>
                </li>
                <li class="nav-item">
                  <form class="container-fluid justify-content-center">
                    <button class="btn btn-outline-light me-2" type="button" onClick={this.clickFunction}>{this.state.value}</button>
                  </form>
                </li>
              </ul>
              <ul class="navbar-nav ml-auto">
                <div class="sm">
                  <a href="https://twitter.com/" target="_blank"><i class="fab fa-twitter"></i></a>
                  <a href="https://www.instagram.com/" target="_blank"><i class="fab fa-instagram"></i></a>
                  <a href="https://www.youtube.com/" target="_blank"><i class="fab fa-youtube"></i></a>
                  <a href="https://www.twitch.tv/" target="_blank"><i class="fab fa-twitch"></i></a>
                  <a href="https://de.linkedin.com/" target="_blank"><i class="fab fa-linkedin-in"></i></a>
                  <a href="https://www.xing.com/" target="_blank"><i class="fab fa-xing"></i></a>
              </div>
              </ul>
            </div>
          </div>
        </nav>

        <form class="box" method="post">
          <h1>Racklayout</h1>
          <input type="number" min="10" max="50" name="aisles" placeholder="Enter number of Aisles"></input>
          <input type="number" min="10" max="74" name="xPositions" placeholder="Enter number of X-Positions"></input>
          <input type="submit" value="Generate Racking"/>
        </form>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 34; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
