require "bundler/setup"
require "contentful/management"

task :default do
  client = Contentful::Management::Client.new(ENV["CONTENTFUL_MANAGEMENT_ACCESS_TOKEN"])
  space = client.spaces.find(ENV["CONTENTFUL_SPACE_ID"])

  gallery_blocks = space.entries.all(content_type: "galleryBlock")
  gallery_image_content_type = space.content_types.find("galleryImage")

  gallery_blocks.each do |gallery|
    if gallery.images
      gallery_images = gallery.images.map do |image|
        asset = space.assets.find(image["sys"]["id"])
        if asset.respond_to?(:id)
          puts "Creating gallery image for asset #{asset.id} #{asset.title}"
          gallery_image = gallery_image_content_type.entries.create({
            title: asset.title,
            caption: (asset.description.gsub("|", "-") if asset.description),
            image: asset
          })

          puts "Publishing gallery image #{gallery_image.id} #{gallery_image.title}"
          gallery_image.publish
          gallery_image
        end
      end

      puts "Updating gallery #{gallery.id} #{gallery.name}"
      gallery.update("galleryImages" => gallery_images.compact)

      sleep(5)

      puts "Publishing gallery #{gallery.id} #{gallery.name}"
      gallery.publish
    end
  end
end
