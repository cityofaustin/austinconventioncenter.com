require_relative "content_block_mapper"

module Mappers
  class GalleryBlockMapper < ContentBlockMapper

    # Add ID and image dimensions to gallery block images
    def map_asset(asset)
      result = super
      result["sys"] = { "id" => asset.sys[:id] }

      if asset.file.details.key?("image")
        result.merge!(asset.file.details["image"])
      end

      result
    end

  end
end
