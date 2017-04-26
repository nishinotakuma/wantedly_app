class Skill < ApplicationRecord
  has_many :user_slill, dependent: :destroy
  has_many :users, through: :user_skill
end
