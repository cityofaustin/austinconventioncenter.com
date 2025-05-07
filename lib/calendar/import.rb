require 'soda/client'
require 'fileutils'
require 'yaml'
require 'httparty'

module Calendar
  class Import

    class << self
      def import(config)
        results = HTTParty.get('https://accdcalendar.blob.core.windows.net/webevents/calendarevents.json?sp=r&st=2025-04-25T13:03:04Z&se=2029-04-25T21:03:04Z&spr=https&sv=2024-11-04&sr=b&sig=Tag0DwvhSueuk1rzdJsYjLYyUcA1aC4CzP9OEU6ncP8%3D')
        path = File.join(config["source"], config["data_dir"], "socrata", "events", "events.yaml")

        FileUtils.mkdir_p(File.dirname(path))
        
        File.open(path, "w") do |file|
          file.write(YAML.dump(JSON.parse(results.body).map(&:to_hash)))
        end
      end

    end

  end
end
