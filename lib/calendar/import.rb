require 'soda/client'
require 'fileutils'
require 'yaml'
require 'httparty'

module Calendar
  class Import

    class << self
      def import(config)
        results = HTTParty.get(ENV["CALENDAR_DATA_SOURCE"])
        path = File.join(config["source"], config["data_dir"], "socrata", "events", "events.yaml")

        FileUtils.mkdir_p(File.dirname(path))

        File.open(path, "w") do |file|
          file.write(YAML.dump(JSON.parse(results).map(&:to_hash)))
        end
      end

    end

  end
end
