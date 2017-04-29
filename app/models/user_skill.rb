class UserSkill < ApplicationRecord

  enum status: {published: 0, hidden: 1}

  belongs_to :user, class_name: "User"
  belongs_to :skill, class_name: "Skill"
  has_many :add_skill_counts, dependent: :destroy

  validates :user_id, presence: true
  validates :skill_id, presence: true
end
