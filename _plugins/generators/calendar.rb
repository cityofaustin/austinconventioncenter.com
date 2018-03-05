require "active_support/core_ext/date/calculations"
require_relative "helpers"

module Jekyll
  class CalendarGenerator < Generator
    include Helpers

    safe true

    DATE_KEYS = %w(arrive depart).freeze

    def generate(site)
      section = site.collections["events"]
      events = site.data.dig("socrata", "events", "events")

      return if section.nil? || events.nil?

      events = filter_events_by_venue(events, site.config["calendar_location"])
      months = group_events_by_month(events)
      latest = months.keys.max

      # Uses `while` instead of `each` to generate a page even for 'empty' months
      date = Date.today.beginning_of_month
      while date <= latest
        section.docs << generate_month_page(site, section, date, months[date])
        date = date.next_month
      end
    end

    private

    def filter_events_by_venue(events, location)
      events.select { |event| event["location"].strip == location }
    end

    def group_events_by_month(events)
      events.each do |event|
        DATE_KEYS.each do |key|
          event["#{key}_date"] = date = Date.parse(event["#{key}_date"])
          event["#{key}_month"] = date.beginning_of_month
        end
      end

      months = events.group_by { |event| event["arrive_month"] }

      # Add events spanning the end of a month to the next month
      events.each do |event|
        if event["depart_month"] != event["arrive_month"]
          months[event["depart_month"]] ||= []
          months[event["depart_month"]] << event
        end
      end

      months
    end

    def generate_month_page(site, section, date, events)
      path = section.collection_dir("#{date.strftime("%Y-%m")}.html")
      doc = Document.new(path, site: site, collection: section)

      doc.data["title"] = date.strftime("%B %Y")
      doc.data["date"] = date
      doc.data["year"] = date.year
      doc.data["events"] = events || []

      set_breadcrumbs(doc, section)

      doc
    end

  end
end
