class User < ApplicationRecord
  has_many :user_slill, dependent: :destroy
  has_many :skills, through: :user_skill
end
