class GameRoomController < ApplicationController
  before_action :authenticate_user!

  respond_to :json

  def index
    players = []
    rooms = GameRoom.all
    rooms.each do |g|
      players.push({gid: g.id.to_s, list: Player.active.where(game_room: g.id).only(:id, :owner)})
    end
    response = {:rooms => rooms, :players => players}
    respond_with response, :location => ''
  end

  def create
    gameroom = GameRoom.new_room(crud_params)
    respond_with gameroom, :location => ''
    Pusher.trigger('gamerooms', 'new', gameroom)
  end

  def join
    gameroom = GameRoom.find(params[:id])
    gameroom.add_player(user,params[:buyIn].to_i)

    respond_with gameroom, :location => ''
  end

  def leave
    game_room = GameRoom.find(params[:id])
    respond_with game_room.remove_player(user), :location => '/home/'
  end

  def start
    gameroom = GameRoom.find(params[:id])
    gameroom.start
    respond_with gameroom, :location => ''
  end

  def players
    gameroom = GameRoom.find(params[:id])
    respond_with gameroom.players.active
  end

  def round
    gameroom = GameRoom.find(params[:id])
    respond_with gameroom.access_round
  end

  def message
    message = params[:message].merge(user: user)
    Pusher.trigger("gameroom-#{params[:id]}", 'chat', message)
    head 200, content_type: "text/html"
  end

  private

  def crud_params
    params.require(:game_room).permit(:name, :min_bet)
  end

  def user
    u = {
        _id: current_user.id.to_s,
        first_name: current_user.first_name,
        last_name: current_user.last_name,
        username: current_user.username,
        image_url: current_user.image.to_s
    }

    return u
  end
end
