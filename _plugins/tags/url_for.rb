class UrlFor < Liquid::Tag
  Syntax = /(#{Liquid::VariableSignature}+)/o

  def initialize(tag_name, markup, tokens)
    super
    if markup =~ Syntax
      @var = markup
    else
      raise SyntaxError.new("Syntax Error in 'url_for' - Valid syntax: url_for [var]")
    end
  end

  def render(context)
    site = context.registers[:site]
    object = Liquid::Variable.new(@var).render(context)

    if object.respond_to?(:key?) && object.key?("sys")
      id = object["sys"]["id"]

      site.docs_to_write.each do |doc|
        return doc.url if doc.data["contentful"] && doc.data["contentful"]["sys"]["id"] == id
      end
    end
  end

end

Liquid::Template.register_tag("url_for", UrlFor)
