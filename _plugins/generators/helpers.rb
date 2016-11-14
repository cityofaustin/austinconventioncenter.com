module Helpers

  # Set a Document's breadcrumbs attribute based on parent section(s)
  def set_breadcrumbs(doc, section)
    doc.data["breadcrumbs"] = Array.new(section.metadata["breadcrumbs"] || []).push({
      "title" => doc.data["title"],
      "slug" => doc.data["slug"],
      "url" => doc.url
    })
  end

end
