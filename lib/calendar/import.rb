require 'soda/client'
require 'fileutils'
require 'yaml'

module Calendar
  class Import

    class << self
      def import(config)
        results = socrata_client.get("e43u-d7ev", "$limit": 5000)
        path = File.join(config["source"], config["data_dir"], "socrata", "calendar", "events.yaml")

        FileUtils.mkdir_p(File.dirname(path))

        File.open(path, "w") do |file|
          file.write(YAML.dump(results.map(&:to_hash)))
        end
      end

      def socrata_client
        @socrata_client ||= SODA::Client.new({
          domain: "data.austintexas.gov",
          app_token: ENV["SOCRATA_APP_TOKEN"]
        })
      end
    end

  end
end
