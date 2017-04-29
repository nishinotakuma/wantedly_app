class CreateAddSkillCounts < ActiveRecord::Migration[5.0]
  def change
    create_table :add_skill_counts do |t|
      t.references :user, foreign_key: true
      t.references :user_skill, foreign_key: true
      t.integer :status, default: 0

      t.timestamps
    end
    add_index :add_skill_counts, [:user_id, :user_skill_id], unique: true
  end
end
