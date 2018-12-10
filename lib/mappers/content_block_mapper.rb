module Mappers
  class ContentBlockMapper < Jekyll::Contentful::Mappers::Base

    def map
      result = super
      result["type"] = self.entry.content_type.id
      puts "~~~~ ~~~~ Type: #{result["type"]}"
#       puts "#{result}" if result["id"] == "3ovThXrlCMqioGU8qQiMAq"
      result
    end

  end
end
