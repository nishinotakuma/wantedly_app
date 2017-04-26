class CreateUserSkills < ActiveRecord::Migration[5.0]
  def change
    create_table :user_skills do |t|
      t.integer :user_id
      t.integer :skill_id
      t.integer :count, default: 0
      t.integer :status, default: 0, null: false, limit: 1

      t.timestamps
    end
    add_index :user_skills, :user_id
    add_index :user_skills, :skill_id
    add_index :user_skills, [:user_id, :skill_id], unique: true
  end
end
