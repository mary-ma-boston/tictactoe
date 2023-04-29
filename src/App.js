
import './App.css';

import { useState } from 'react';
import { SetShowRowCol, GetShowRowCol } from './globalVar';

function Square({ value, onSquareClick, handleBackgound }) {
  if(handleBackgound){
    return <button style={{backgroundColor:'yellow'}} className="square" onClick={onSquareClick}>{value}</button>;
  } else {
    return <button className="square" onClick={onSquareClick}>{value}</button>;
  } 
}

function Board({xIsNext, squares, onPlay, setIfADraw, ifADraw}) {

  const renderSquare = (i, changeBackground)=>{
    return (
      <Square value={squares[i]} onSquareClick={()=>handleClick(i)} handleBackgound = {changeBackground}/>
    )
  }

  const index = [[0,1,2], [3,4,5], [6,7,8]];
  let row = index.length;
  let col = index[0].length;
  

  let rows = null;

  let status;
  const winnerAndHigh = calculateWinner(squares);
  let winner = '';
  let HighLighta,HighLightb,HighLightc = 0;

  function calculateDraw(squares) {
    for(let i=0; i < squares.length; i++){
      if(squares[i] !== 'X' && squares[i] !=='O') {
        return false;
      }
    }
    return true;
  }

  if( winnerAndHigh !== null) {
    [winner, HighLighta, HighLightb, HighLightc] = [...winnerAndHigh];
    rows = index.map((i) => {
      let cells = i.map((j)=>{
        if( j === HighLighta || j === HighLightb || j === HighLightc )
        {
          return (<label key={j.toString()}>{renderSquare(j, true)}</label>)
        }
        else{
          return (<label key={j.toString()}>{renderSquare(j)}</label>)
        }
      });
      return(
        <div key={i.toString()} className="board-row">{cells}</div>
      );
    });  
  } else if(calculateDraw(squares)){
    
    rows = index.map((i) => {
      let cells = i.map((j)=>{
        return (<label key={j.toString()}>{renderSquare(j)}</label>)
      });
      return(
        <div key={i.toString()} className="board-row">{cells}</div>
      );
    });
    setIfADraw(true);
  }
  else{
    rows = index.map((i) => {
      let cells = i.map((j)=>{
        return (<label key={j.toString()}>{renderSquare(j)}</label>)
      });
      return(
        <div key={i.toString()} className="board-row">{cells}</div>
      );
    });
  }
 
  if(winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X": "O");
  }

  if(ifADraw){
    status = "No winner";
  }
  
  function handleClick(i) {
    let tempRowLoc = 0;
    let tempColLoc = 0;
    tempRowLoc = Math.floor(i/row);
    tempColLoc = i % col;
    
    SetShowRowCol( [tempRowLoc, tempColLoc] ) ;
    
    if(squares[i] || calculateWinner(squares)) {
      return
    }

    const nextSquares = squares.slice();
    if(xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    
    onPlay(nextSquares);  
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    for(let i=0; i<lines.length; i++) {
      const [a,b,c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return [squares[a], a, b, c];
      }
    }
    return null
  };

 

  return (
    <>
      <div className='status'>{status}</div>
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={()=>handleClick(0)}/>
        <Square value={squares[1]} onSquareClick={()=>handleClick(1)}/>
        <Square value={squares[2]} onSquareClick={()=>handleClick(2)}/>
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={()=>handleClick(3)}/>
        <Square value={squares[4]} onSquareClick={()=>handleClick(4)}/>
        <Square value={squares[5]} onSquareClick={()=>handleClick(5)}/>
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={()=>handleClick(6)}/>
        <Square value={squares[7]} onSquareClick={()=>handleClick(7)}/>
        <Square value={squares[8]} onSquareClick={()=>handleClick(8)}/>
      </div> */}
      {rows}
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascend, setAscend] = useState(true);
  const [ifADraw, setIfADraw] = useState(false);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove +1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if(ascend) {
        if(move > 0) {
          let row, col;
            
          GetShowRowCol().filter((location, i, arr)=> {
            if(i===(move-1)) {
              row = location[0];
              col = location[1];
              return [row, col];
            }
          });
          
          description = "You are at move #" + move + " Row: " + row + " Col: "+col; 
        } else {
          description = "Go to game start";
        }

        return (
          <li key={move}>
            {/* <button onClick={()=> jumpTo(move)}>{description}</button> */}
            <div className = "listStyle" onClick = {()=>jumpTo(move)}>{description}</div>
          </li>
        )
    }
    else {
      let reverseMove = history.length - move - 1;
      if(reverseMove > 0) {
        let row, col;
            
        GetShowRowCol().filter((location, i, arr)=> {
          if(i===(reverseMove-1)) {
            row = location[0];
            col = location[1];
            return [row, col];
          }
        });

        description = "You are at move #" + reverseMove + " Row: " + row + " Col: "+col;
      } else {
        description = "Go to game start";
      }

      return (
        <li key={reverseMove}>
          {/* <button onClick={()=> jumpTo(move)}>{description}</button> */}
          <div className = "listStyle" onClick = {()=>jumpTo(reverseMove)}>{description}</div>
        </li>
      )
    }
  })


  const handleSort = () => {  
    setAscend(!ascend); 
  }

  return (
    <>
      <div className='game'>
        <div className='game-board'>
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} setIfADraw={setIfADraw} ifADraw={ifADraw} />
        </div>
        <div className='game-info'>
          <ol>{moves}</ol>
        </div> 
        <div>
          <button className = 'reverseButton' onClick={()=>handleSort()}>{ascend? "Ascend moves":"Descend moves"}</button>
        </div>
      </div>  
      {ifADraw ? (<div className='drawContainer'><span>This is draw!</span></div> ): null}
    </> 
  )
}
