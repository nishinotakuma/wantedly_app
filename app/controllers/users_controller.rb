class UsersController < ApplicationController

  before_action :set_user, except: :index

  def index
    @users = User.all
  end

  def show
  end

  def get_skills_suggestion
    suggestions = []
    Skill.where("name like '#{params[:value]}%'").each do |skill|
      suggestions << {
        id: skill.id,
        name: skill.name
      }
    end
    render json: suggestions
  end

  def get_skills
    return_skills = []
    @user.user_skills.includes(:skill).find_each do |user_skill|
      return_skills << {
        id: user_skill.skill.id,
        name: user_skill.skill.name,
        count: user_skill.count,
        status: user_skill.status
      }
    end
    render json: return_skills
  end

  def update_skills
    set_skills = []
    return_skills = []
    params["skills"].each do |skill|
      if skill["id"]
        return_skill = Skill.find_or_create_by(id: skill["id"])
      else
        return_skill = Skill.find_or_create_by(name: skill["name"])
      end
      set_skills << return_skill
    end
    @user.skills = set_skills
    @user.user_skills.includes(:skill).find_each do |user_skill|
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
