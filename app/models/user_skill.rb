class UserSkill < ApplicationRecord

  enum status: {published: 0, private: 1}

  belongs_to :user, class_name: "User"
  belongs_to :skill, class_name: "Skill"

  validates :user_id, presence: true
  validates :skill_id, presence: true
end
