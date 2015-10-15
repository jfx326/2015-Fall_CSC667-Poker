class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception


  private
   
  def confirm_logged_in
    unless session[:user_id]
      redirect_to(:controller => 'authentication', :action => 'login')
      flash[:notice] = "Please log in."
      return false #halts before_action
    else
      return true
    end
  end 

end
