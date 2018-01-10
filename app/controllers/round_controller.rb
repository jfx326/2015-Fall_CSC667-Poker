class RoundController < ApplicationController
  before_action :authenticate_user!

  respond_to :json

  def hand
    round = Round.find(params[:id])
    respond_with round.access_hand(user), :location => ''
  end

  def turn
    round = Round.find(params[:id])
    respond_with round.add_turn(user, params[:bet]), :location => ''
  end

  private
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

  def render_error(error)
    respond_with error, :status => error.status, :location => ''
  end
end
