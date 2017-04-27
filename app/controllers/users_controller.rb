class UsersController < ApplicationController

  before_action :set_user

  def show
    @user = User.first
    @skills = @user.skills
  end

  def add_skill

  end

  private

    def set_user
      
    end
end
