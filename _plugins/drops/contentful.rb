module Jekyll
  module Drops
    class SiteDrop

      # Exposes Contentful data (parsed from YAML) as site.contentful
      def contentful
        data["contentful"]["spaces"]["acc"]
      end

    end
  end
end
