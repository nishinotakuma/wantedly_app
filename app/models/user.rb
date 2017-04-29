class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :user_skills, dependent: :destroy
  has_many :skills, through: :user_skills
  has_many :add_skill_counts, dependent: :destroy
end
