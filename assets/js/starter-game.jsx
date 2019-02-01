import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
	    tiles: [],
      flipped: [],
      matches: 0,
      score: 0
    };
  }

  // Restart the game
  restart() {
    let values = ["A", "B", "C", "D", "E", "F", "G", "H"];
    values = values.concat(values);
    values.sort(function(a, b) { return 0.5 - Math.random() });
    console.log(values);
    let tiles = [];
    for (var i = 0; i < values.length; i++) {
      tiles.push({ value: values[i], flipped: false, matched: false, id: i });
    }
    return this.setState({ tiles: tiles, flipped: [], matches: 0, score: 0});
  }

  // Flip the tile unless it is already flipped
  flip(tile) {
    let tiles = this.state.tiles.slice(),
        clickedTile = tiles[tile.id];
    if (this.state.flipped.length === 2 || clickedTile.flipped || clickedTile.matched) {
      return;
    } else {
      clickedTile.flipped = true;
      tiles[clickedTile.id] = clickedTile;
      let flipped = this.state.flipped.slice();
      flipped.push(tile.id);
      if (flipped.length === 2) {
        return this.setState(
          { tiles: tiles, flipped: flipped, score: this.state.score + 1 },
	  () => this.check());
      } else {
        return this.setState({ tiles: tiles, flipped: flipped, score: this.state.score + 1 });
      }
    }
  }

  // Check if the flipped tiles are match
  check() {
    let	tiles = this.state.tiles,
	tile1 = tiles[this.state.flipped[0]],
        tile2 = tiles[this.state.flipped[1]],
	matches = this.state.matches;
    if (tile1.value === tile2.value) {
      tile1.matched = true;
      tile2.matched = true;
      matches = matches + 1;
    }
    tile1.flipped = false;
    tile2.flipped = false;
    tiles[tile1.id] = tile1;
    tiles[tile2.id] = tile2;
    console.log(matches);
    let component = this;
    window.setTimeout(function() {
      return component.setState({ tiles: tiles, flipped: [], matches: matches });
    }, 1000);
  }

  render() {
    if (this.state.tiles.length === 0) {
      return (
        <div>
	  <button onClick={this.restart.bind(this)}>Start Game</button>
	</div>
      );
    }
    if (this.state.matches === 8) {
      return (
        <div>
	  <p>YOU WON!</p>
	  <p>Clicks: {this.state.score}</p>
	  <button onClick={this.restart.bind(this)}>Play Again</button>
	</div>
      );
    }
    else {
      return (
        <div>	
	  <p>
	    Clicks: {this.state.score}
	    <button className="restart" onClick={this.restart.bind(this)}>Restart</button>
          </p>
	  <div>
	    <Board root={this} />
	  </div>
        </div>
      );
    }
  }
}

function Board(props) {
  let root = props.root;
  let tiles = root.state.tiles;
  let renderedTiles = _.map(tiles, (tile, i) => {
    let classes = "column",
        value = "";
    if (tile.flipped) {
      classes = classes + " flipped";
      value = tile.value;
    }
    if (tile.matched) {
      classes = classes + " matched";
    }
    return <div className={classes} key={tile.id} onClick={() => { root.flip(tile) }}><div>{value}</div></div>;
  });
  return (
    <div>
      <div className="row">
        {renderedTiles.slice(0, 4)}
      </div>  
      <div className="row">
        {renderedTiles.slice(4, 8)}
      </div>
      <div className="row">
        {renderedTiles.slice(8, 12)}
      </div>
      <div className="row">
        {renderedTiles.slice(12, 16)}
      </div>
    </div>
  );
}
