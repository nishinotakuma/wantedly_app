class User < ApplicationRecord
  has_many :user_skills, dependent: :destroy
  has_many :skills, through: :user_skills
end
