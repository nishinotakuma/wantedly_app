class SkillsController < ApplicationController
  before_action :set_skill

  def show
    @users = @skill.users
  end

  private
    def set_skill
      @skill = Skill.find(params[:id])
    end
end
