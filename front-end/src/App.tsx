import React from 'react';
import './App.css';
import { GameState, Cell } from './game';
import BoardCell from './Cell';

interface Props {}

class App extends React.Component<Props, GameState> {
  private initialized = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      cells: [],
      winner: '',
      currentPlayer: '',
      history: []
    };
  }

  // Start a new game
  newGame = async () => {
    const response = await fetch('/newgame');
    const json = await response.json();
    this.setState({
      cells: json['cells'],
      winner: '',
      currentPlayer: 'X',
      history: []
    });
  }

  // Play a move
  play = (x: number, y: number): React.MouseEventHandler => {
    return async (e) => {
      e.preventDefault();

      if (this.state.winner) return; // if game is over, prevent more moves

      const response = await fetch(`/play?x=${x}&y=${y}`);
      const json = await response.json();
      this.setState({
        cells: json['cells'],
        winner: json['winner'],
        currentPlayer: json['currentPlayer'],
        history: [...this.state.history, this.state.cells]
      });
    };
  }

  // Undo last move
  undo = () => {
    const lastHistory = [...this.state.history];
    if (lastHistory.length === 0) return;

    const previousCells = lastHistory.pop()!;
    this.setState({
      cells: previousCells,
      winner: '',
      currentPlayer: this.state.currentPlayer === 'X' ? 'O' : 'X',
      history: lastHistory
    });
  }

  // Render a single cell
  createCell(cell: Cell, index: number): React.ReactNode {
    return (
      <div key={index}>
        <a href='/' onClick={cell.playable ? this.play(cell.x, cell.y) : undefined}>
          <BoardCell cell={cell}></BoardCell>
        </a>
      </div>
    );
  }

  componentDidMount(): void {
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  render(): React.ReactNode {
    return (
      <div className="App">
        <h1>Tic Tac Toe</h1>

        {/* Instructions */}
        <div id="instructions">
          {this.state.winner
            ? `🏆 Winner: ${this.state.winner}`
            : this.state.currentPlayer
              ? `🎮 Current Player: ${this.state.currentPlayer}`
              : 'Loading...'}
        </div>

        {/* Game Board */}
        <div id="board">
          {this.state.cells.length === 0 ? (
            <div>Loading...</div>
          ) : (
            this.state.cells.map((cell, i) => this.createCell(cell, i))
          )}
        </div>

        {/* Buttons */}
        <div id="bottombar">
          <button onClick={this.newGame}>New Game</button>
          <button onClick={this.undo} disabled={this.state.history.length === 0}>Undo</button>
        </div>
      </div>
    );
  }
}

export default App;
