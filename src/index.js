// Refer to React Tic-Tac-Toe example for explanation

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
   return (
      <button className="square" onClick={props.onClick}>
         {props.value}
      </button>
   );
}

class Board extends React.Component {
   renderSquare(i) {
      return (
         <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
         />
      );
   }

   render() {
      return (
         <div>
            <div className="board-row">
               {this.renderSquare(0)}
               {this.renderSquare(1)}
               {this.renderSquare(2)}
            </div>
            <div className="board-row">
               {this.renderSquare(3)}
               {this.renderSquare(4)}
               {this.renderSquare(5)}
            </div>
            <div className="board-row">
               {this.renderSquare(6)}
               {this.renderSquare(7)}
               {this.renderSquare(8)}
            </div>
         </div>
      );
   }
}

class Game extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         history: [{
            squares: Array(9).fill(null)
         }],
         stepNumber: 0, // adding to state to indicate the step that's currently being viewed (will be passed to the jumpTo function)
         xIsNext: true
      };
   }

   handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1); // createing a new array to ensure when jumping back moves, the old games move history is disregarded
      const current = history[this.state.stepNumber]; // the state.stepnumber is now set to the history's length, so this just needs to call the current state.stepnumber
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
         return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
         history: history.concat([{
            squares: squares
         }]),
         stepNumber: history.length,
         xIsNext: !this.state.xIsNext,
      });
   }

   jumpTo(step) {
      this.setState({
         stepNumber: step,
         xIsNext: (step % 2) === 0,
      });
   }

   render() {
      const history = this.state.history;
      const current = history[history.length - 1];
      const winner = calculateWinner(current.squares);

      // map a history of player moves into elements representing display list of button to go back to previous moves
      const moves = history.map((step, move) => {
         const desc = move ?
            'Go to move #' + move :
            'Go to game start';
         return (
            // recommended to assign a proper key to <li> ele. whenever building a dynamic list
            <li key={move}>
               <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
         );
      });
         
      let status;
      if (winner) {
         status = 'Winner: ' + winner;
      } else {
         status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
         <div className="game">
            <div className="game-board">
               <Board
                  squares={current.squares}
                  onClick={(i) => this.handleClick(i)}
               />
            </div>
            <div className="game-info">
               <div>{status}</div>
               <ol>{moves}</ol>
            </div>
         </div>
      );
   }
}

// ========================================

ReactDOM.render(
   <Game />,
   document.getElementById('root')
);

function calculateWinner(squares) {
   const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
   ];
   for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
         return squares[a];
      }
   }
   return null;
}
