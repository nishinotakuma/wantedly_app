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

  def get_other_skills
    return_skills = []
    @user.user_skills.includes(:skill).find_each do |user_skill|
      current_user_add =
        AddSkillCount.find_by(user_id: current_user.id, user_skill_id: user_skill.id) ? true : false
      return_skills << {
        id: user_skill.skill.id,
        name: user_skill.skill.name,
        count: user_skill.count,
        status: user_skill.status,
        current_user_add: current_user_add
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

  def update_other_skill
    if skill = Skill.find_by(name: params[:value])
      UserSkill.create(user_id: @user.id ,skill_id: skill.id)
    else
      skill = @user.skills.create(name: params[:value])
    end
    return_skill = {
      id: skill.id,
      name: skill.name,
      count: 0,
      status: "published",
      current_user_add: false
    }
    render json: return_skill
  end



  def update_count_skills
    skill_info = params["skill"]
    user_skill = @user.user_skills.find_by(skill_id: skill_info["id"].to_i)
    case skill_info["current_user_add"]
    when "true"
      add_skill_count = AddSkillCount.find_by(user_id: current_user.id ,user_skill_id: user_skill.id)
      add_skill_count.destroy
      current_user_add = false
    when "false"
      AddSkillCount.create(user_id: current_user.id ,user_skill_id: user_skill.id)
      current_user_add = true
    end
    count = user_skill.add_skill_counts.size
    user_skill.update(count: count)
    return_skill = {
      id: skill_info["id"].to_i,
      name: skill_info["name"],
      count: count,
      status: "published",
      current_user_add: current_user_add
    }
    render json: return_skill
  end

  private

    def set_user
      @user = User.find(params[:id])
    end

end
