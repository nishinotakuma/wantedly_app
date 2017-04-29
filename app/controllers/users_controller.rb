class UsersController < ApplicationController

  before_action :set_user, except: :index

  def index
    @users = User.all
  end

  def show
    @skills = @user.skills
    @name = "テスト"
  end

  def add_skill

  end

  def get_skills
    return_skills = []
    @user.user_skills.includes(:skill).each do |user_skill|
      return_skills << {
        id: user_skill.skill.id,
        name: user_skill.skill.name,
        count: user_skill.count,
        status: user_skill.status
      }
    end
    render json: return_skills
  end

  private

    def set_user
      @user = User.find(params[:id])
    end
end
