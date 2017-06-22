require_relative "content_block_mapper"

module Mappers
  class GalleryImageMapper < ContentBlockMapper

    # Add ID and image dimensions to gallery block images
    def map_asset(asset)
      result = super
      result["sys"] = { "id" => asset.sys[:id] }
      result["description"] = asset.description

      if asset.file.details.key?("image")
        result.merge!(asset.file.details["image"])
      end

      result
    end

  end
end
