module Jekyll
  class ContentfulGenerator < Generator
    safe true

    # Generates Jekyll::Collections and Documents from the YAML file written by Contentful's Jekyll
    # plugin. Documents are similar to Pages in Jekyll, but work better for data-driven use case,
    # e.g. by automatically parsing Collection-level frontmatter defaults from _config.yml.
    def generate(site)
      # TODO Select space based on environment or build flag
      data = site.data["contentful"]["spaces"]["acc"]

      @sections = {}

      data["section"].each do |attributes|
        find_or_generate_section(site, attributes)
      end

      data["page"].each do |attributes|
        # Pages within a section render within that section, like /:section/:page/
        section = @sections[attributes["section"]["sys"]["id"]] if attributes.key?("section")

        # Pages without a section go in "orphans" and render at the root level, like /:page/. The
        # orphans collection is defined by _config.yml.
        section ||= site.collections["orphans"]

        generate_page(site, section, attributes)
      end

      data["room"].each do |attributes|
        generate_page(site, site.collections["rooms"], attributes)
      end
    end

    private

    def find_or_generate_section(site, attributes)
      return @sections[attributes["sys"]["id"]] if @sections.key?(attributes["sys"]["id"])

      label = Utils.slugify(attributes["slug"])
      section = Collection.new(site, label)
      section.metadata["output"] = true
      section.metadata["permalink"] = "/#{label}/:slug/" # Child page URL template

      site.collections[label] = section

      if attributes.key?("parentSection")
        parent = find_or_generate_section(site, attributes["parentSection"])

        # Prepend parent path to this section's child page URL template
        section.metadata["permalink"] = "/#{parent.label}" + section.metadata["permalink"]
      else
        # Add root-level section pages to default collection (defined in _config.yml)
        parent = site.collections["sections"]
      end

      page = generate_page(site, parent, attributes)
      page.data["docs"] = section.docs

      # Always inherit layout from default for root-level sections (defined in _config.yml)
      page.data["layout"] = site.frontmatter_defaults.find(page.relative_path, "sections", "layout")

      # Breadcrumbs inherited by child pages (includes parents of this section, if any)
      section.metadata["breadcrumbs"] = page.data["breadcrumbs"]

      @sections[attributes["sys"]["id"]] = section
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
      doc.data["contentful"] = attributes

      # Pass redirects from Contentful to jekyll-redirect-from
      doc.data["redirect_from"] = attributes["redirectFrom"] if attributes["redirectFrom"]

      # Inherit breadcrumbs from parent section(s)
      doc.data["breadcrumbs"] = Array.new(section.metadata["breadcrumbs"] || []).push({
        "title" => attributes["title"],
        "slug" => slug,
        "url" => doc.url
      })

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
