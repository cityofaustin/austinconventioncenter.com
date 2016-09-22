module Jekyll
  class ContentfulGenerator < Generator
    safe true

    # Generates Jekyll::Collections and Documents from the YAML file written by Contentful's Jekyll
    # plugin. Documents are similar to Pages in Jekyll, but work better for data-driven use case,
    # e.g. by automatically parsing Collection-level frontmatter defaults from _config.yml.
    def generate(site)
      # TODO Select space based on environment or build flag
      data = site.data["contentful"]["spaces"]["acc"]

      sections = {}

      data["section"].each do |attributes|
        sections[attributes["sys"]["id"]] = generate_section(site, attributes)
      end

      data["page"].each do |attributes|
        # Pages within a section render within that section, like /:section/:page/
        section = sections[attributes["section"]["sys"]["id"]] if attributes.key?("section")

        # Pages without a section go in "orphans" and render at the root level, like /:page/. The
        # orphans collection is defined by _config.yml.
        section ||= site.collections["orphans"]

        generate_page(site, section, attributes)
      end
    end

    private

    def generate_section(site, attributes)
      label = Utils.slugify(attributes["slug"])
      section = Collection.new(site, label)
      section.metadata["output"] = true

      site.collections[label] = section

      # Add a section "index" page to a collection defined by _config.yml
      page = generate_page(site, site.collections["sections"], attributes)
      page.data["docs"] = section.docs

      section
    end

    def generate_page(site, section, attributes)
      slug = Utils.slugify(attributes["slug"])
      path = section.collection_dir("#{slug}.markdown")

      if doc = find_custom_doc_by_id(site, attributes["sys"]["id"])
        doc.instance_variable_set(:@collection, section)
      else
        doc = Document.new(path, site: site, collection: section)
      end

      doc.data["slug"] = slug
      # Set permalink if it's not defined by the defaults in _config.yml
      doc.data["permalink"] ||= "/:collection/:slug/"

      doc.data["contentful"] = attributes

      section.docs << doc

      doc
    end

    # Checks the _custom folder for a Section- or Page-specific template that contains a matching
    # contentful_id in its frontmatter. If found, we render it instead of the standard layout.
    def find_custom_doc_by_id(site, id)
      docs = site.collections["custom"].docs
      docs.detect { |doc| doc.data["contentful_id"] == id }
    end

  end
end
