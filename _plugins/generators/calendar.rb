require "active_support/core_ext/date/calculations"
require_relative "helpers"

module Jekyll
  class CalendarGenerator < Generator
    include Helpers

    safe true

    DATE_KEYS = %w(start end).freeze

    def generate(site)
      section = site.collections["events"]
      filename = "#{site.config["id"]}"
      events = site.data.dig("events", filename)

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
        start_date = (event["startDate"]).strftime('%Y-%m-%dT00:00:00.000')
        DATE_KEYS.each do |key|
          event["#{key}_date"] = date = (event["#{key}Date"]).strftime('%Y-%m-%dT00:00:00.000')
          event["#{key}_month"] = Date.parse((event["#{key}Date"]).strftime('%Y-%m-%d')).beginning_of_month
        end
      end

      months = events.group_by { |event| event["start_month"] }

      # Add events spanning the end of a month to the next month
      events.each do |event|
        if event["end_month"] != event["start_month"]
          months[event["end_month"]] ||= []
          months[event["end_month"]] << event
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
