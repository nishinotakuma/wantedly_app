class UsersController < ApplicationController

  before_action :set_user

  def show
    @skills = Skill.all
  end

  private

    def set_user
      @user = User.find(1)
    end
end
