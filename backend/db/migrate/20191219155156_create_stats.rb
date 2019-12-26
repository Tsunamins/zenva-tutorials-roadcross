class CreateStats < ActiveRecord::Migration[5.2]
  def change
    create_table :stats do |t|
      t.integer :score
      t.integer :hit

      t.timestamps
    end
  end
end
