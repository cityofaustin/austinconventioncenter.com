module Jekyll
  module Drops
    class SiteDrop

      # Exposes Contentful data (parsed from YAML) as site.contentful
      def contentful
        data["contentful"]["spaces"][@obj.config["id"]]
      end

    end
  end
end
