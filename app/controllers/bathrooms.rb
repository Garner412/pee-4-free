get '/address' do
  latitude = params[:latitude]
  longitude = params[:longitude]
  env_key = ENV['GOOGLE_MAPS_KEY']
  url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{latitude},#{longitude}&key=#{env_key}"
  response = HTTParty.get(url)
  response.to_json
end
# "https://maps.googleapis.com/maps/api/js?key=<%=ENV["GOOGLE_MAPS_KEY"]%>&libraries=geometry,places&callback=initMap"

post '/bathroom' do
  # params[:name] = 'name'
  head = Bathroom.create!(params)
end

get '/bathrooms/data' do
  bathrooms = Bathroom.all
  bathrooms.to_json
end

put '/bathrooms' do
  bathroom = Bathroom.find_by(address: params[:address])
  bathroom.update(name: params[:name], ranking: params[:ranking].to_i)
  bathroom.save
  bathroom.to_json
end