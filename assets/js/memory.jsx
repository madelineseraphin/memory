import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Memory channel={channel} />, root);
}

class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    this.state = {
      flipped: [],
      flipped_values: [],
      matched: [],
      score: 0,
      max_tiles: 0,
    }

    this.channel.join()
	.receive("ok", resp => {
          console.log("Joined successfully", resp);
	  this.setState(resp.game);
	})
	.receive("error", resp => { console.log("Unable to join", resp); });
  }
  
  // Handle flipping a tile
  flip(id) {
    this.channel.push("flip", { tileId: id, flipped: this.state.flipped, matched: this.state.matched })
	.receive("ok", (resp) => { this.setState(resp.game); this.check();});
  }

  // Check if the two flipped tiles are a match
  check() {
    this.channel.push("check")
	.receive("ok", (resp) => { this.setState(resp.game); });
  }

  // Restart the game
  restart() {
    this.channel.push("new")
	.receive("ok", (resp) => { this.setState(resp.game); });
  }

  render() {
    if (this.max_tiles === 0) {
      return (
        <div>
	  <button onClick={this.restart.bind(this)}>Start Game</button>
	</div>
      );
    }
    if (this.state.matched.length === 16) {
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
  let root = props.root,
      tiles = [];
  for (let i = 0; i < root.state.max_tiles; i++) {
    let classes = "column",
	value = "";
    if (root.state.flipped.includes(i)) {
      classes = classes + " flipped";
      value = root.state.flipped_values[0];
      root.state.flipped_values.shift();
    }
    if (root.state.matched.includes(i)) {
      classes = classes + " matched";
    }
    tiles.push(<div className={classes} key={i} onClick={() => { root.flip(i) }}><div>{value}</div></div>);
  }
  return (
    <div>
      <div className="row tileRow">
        {tiles.slice(0, 4)}
      </div>  
      <div className="row tileRow">
        {tiles.slice(4, 8)}
      </div>
      <div className="row tileRow">
        {tiles.slice(8, 12)}
      </div>
      <div className="row tileRow">
        {tiles.slice(12, 16)}
      </div>
    </div>
  );
}
