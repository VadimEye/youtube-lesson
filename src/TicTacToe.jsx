import { useState } from 'react'
import './TicTacToe.css'

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function calculateWinner(squares) {
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function Square({ value, onSquareClick }) {
  return (
    <button type="button" className="square" onClick={onSquareClick}>
      {value}
    </button>
  )
}

function Board({ squares, xIsNext, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) return

    const nextSquares = squares.slice()
    nextSquares[i] = xIsNext ? 'X' : 'O'
    onPlay(nextSquares)
  }

  return (
    <div className="board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="board-row">
          {[0, 1, 2].map((col) => {
            const i = row * 3 + col
            return (
              <Square
                key={i}
                value={squares[i]}
                onSquareClick={() => handleClick(i)}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  function handlePlay(nextSquares) {
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  const winner = calculateWinner(squares)
  let status
  if (winner) {
    status = `Победитель: ${winner}`
  } else if (squares.every(Boolean)) {
    status = 'Ничья'
  } else {
    status = `Следующий ход: ${xIsNext ? 'X' : 'O'}`
  }

  return (
    <div className="game">
      <h2>Крестики-нолики 3×3</h2>
      <p className="status">{status}</p>
      <Board squares={squares} xIsNext={xIsNext} onPlay={handlePlay} />
    </div>
  )
}

export default TicTacToe
