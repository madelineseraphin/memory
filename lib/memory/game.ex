defmodule Memory.Game do
  def max_tiles do
    16
  end

  def new do
    %{
      tiles: new_tiles(),
      flipped: [],
      matched: [],
      score: 0
    }
  end

  def client_view(game) do
    %{
      flipped: game.flipped,
      flipped_values: get_values(game),
      matched: game.matched,
      score: game.score,
      max_tiles: max_tiles(),
    }
  end

  # Flip the tile with the given tileId
  def flip(game, tileId, flipped, matched) do
    flips = flipped
    if (length flips) !== 2 && !Enum.member?(flips, tileId) && !Enum.member?(matched, tileId) do
      flips = [tileId] ++ flips
      game = Map.put(game, :flipped, flips)
      game = Map.put(game, :score, game.score + 1)
      game
    else
      game
    end
  end

  # Check if the flipped tiles are a match
  def check(game) do
    if (length game.flipped) === 2 do
      :timer.sleep(1000)
      index1 = hd game.flipped
      index2 = hd (tl game.flipped)
      tile1 = Enum.at(game.tiles, index1)
      tile2 = Enum.at(game.tiles, index2)
      if tile1 === tile2 do
        game = Map.put(game, :matched, [index1, index2] ++ game.matched)
        game = Map.put(game, :flipped, [])
        game
      else
        game = Map.put(game, :flipped, [])
        game
      end
    else
      game
    end
  end

  # Get the values of the flipped tiles
  def get_values(game) do
    flipped_tiles = Enum.sort(game.flipped)
    Enum.map(flipped_tiles, fn(x) -> Enum.at(game.tiles, x)  end)
  end
    
  def new_tiles do
    values = ["A", "B", "C", "D", "E", "F", "G", "H"]
    values = values ++ values
    Enum.shuffle(values)
  end

end
