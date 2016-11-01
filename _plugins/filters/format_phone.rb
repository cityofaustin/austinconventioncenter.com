require 'active_support'

module Jekyll
  module FormatPhone
    def format_phone(input)
      ActiveSupport::NumberHelper.number_to_phone(input.gsub(/[^\d]/, ""), area_code: true)
    end
  end
end

Liquid::Template.register_filter(Jekyll::FormatPhone)
