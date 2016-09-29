class CreateBathrooms < ActiveRecord::Migration
  def change
    create_table :bathrooms do |t|
      t.integer  :user_id
      t.string   :name
      t.string   :address, null: false
      t.float    :latitude, null: false
      t.float    :longitude, null: false
      t.integer  :ranking

      t.timestamps(null: false)
    end
  end
end
