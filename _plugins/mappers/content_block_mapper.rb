class ContentBlockMapper < Jekyll::Contentful::Mappers::Base

  def map
    result = super
    result["type"] = self.entry.content_type.id
    result
  end

end
