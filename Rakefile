require 'bundler/setup'
require 'jekyll'
require 'jekyll-contentful-data-import'
Dir.glob('./_plugins/mappers/*.rb', &method(:require))
require './lib/accd/calendar'

desc "Import Contentful data with custom mappers"
task :contentful do
  Jekyll::Commands::Contentful.process([], {}, Jekyll.configuration['contentful'])
end

desc "Import event listing data from Socrata (data.austintexas.gov)"
task :calendar do
  ACCD::Calendar.import(Jekyll.configuration)
end

desc "Import all data"
task :import => [:contentful, :calendar] do
end
