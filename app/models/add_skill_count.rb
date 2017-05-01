class AddSkillCount < ApplicationRecord
  belongs_to :user, class_name: "User"
  belongs_to :user_skill

  validates :user_id, presence: true
  validates :user_skill_id, presence: true
end
