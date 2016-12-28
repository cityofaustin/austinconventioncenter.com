module Jekyll
  module FindDocument

    # Given input containing Contentful attributes ["sys"]["id"], finds matching Jekyll pages.
    def find_document(input)
      site = @context.registers[:site]

      if input.respond_to?(:key) && input.key?("sys")
        id = input["sys"]["id"]

        doc = site.docs_to_write.find do |doc|
          doc.data["contentful_ids"] && doc.data["contentful_ids"].include?(id)
        end

        doc.to_liquid
      end
    end

  end
end

Liquid::Template.register_filter(Jekyll::FindDocument)
