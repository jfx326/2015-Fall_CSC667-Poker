class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session
  after_action :set_csrf_cookie_for_ng
  before_action :configure_permitted_parameters, if: :devise_controller?

  respond_to :json

  def angular
    render 'layouts/application'
  end

  protected

  def verified_request?
    super || valid_authenticity_token?(session, request.headers['X-XSRF-TOKEN'])
  end

  private

  def set_csrf_cookie_for_ng
    cookies['XSRF-TOKEN'] = form_authenticity_token if protect_against_forgery?
  end

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up) do |user|
      user.permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :remember_me)
    end
    
    devise_parameter_sanitizer.permit(:sign_in) do |user|
      user.permit(:login, :username, :email, :password, :remember_me)
    end
    
    devise_parameter_sanitizer.permit(:account_update) do |user|
      user.permit(:first_name, :last_name, :username, :email, :password, :password_confirmation, :current_password, :image)
    end
  end
end
