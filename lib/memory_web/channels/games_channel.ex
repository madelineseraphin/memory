defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  
  alias Memory.Game
  alias Memory.BackupAgent

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      BackupAgent.put(name, game)
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("flip", %{ "tileId" => ti, "flipped" => ff, "matched" => mm }, socket) do
    name = socket.assigns[:name]
    game = Game.flip(socket.assigns[:game], ti, ff, mm)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("check", nil, socket) do
    name = socket.assigns[:name]
    game = Game.check(socket.assigns[:game])
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("new", nil, socket) do
    name = socket.assigns[:name]
    game = Game.new()
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  #def handle_in("ping", payload, socket) do
  #  {:reply, {:ok, payload}, socket}
  #end

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  #def handle_in("shout", payload, socket) do
  #  broadcast socket, "shout", payload
  #  {:noreply, socket}
  #end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
