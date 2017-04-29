# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user = User.create!(name: "Wantedly", email: "wantedly@test.com", password: "wantedly")
5.times do |m|
  skill = "my_skill-#{m+1}"
  user.skills.create(name: skill)
end


30.times do |n|
  name  = Faker::Name.name
  email = "example-#{n+1}@example.com"
  password = "password-#{n+1}"
  User.create!(name: name, email: email, password: password)
end

30.times do |n|
  skill = "skill-#{n+1}"
  Skill.create!(name: skill)
end

30.times do |n|
  name  = Faker::Name.name
  email = "test#{n+1}@example.com"
  password = "test_password-#{n+1}"
  user = User.create!(name: name, email: email, password: password)
  5.times do |m|
    skill = "test_skill-#{m+1}"
    user.skills.create(name: skill)
  end
end
