require 'bundler/setup'
require 'jekyll'
require 'jekyll-contentful-data-import'
require './_plugins/mappers/content_block_mapper'

desc "Import Contentful Data with Custom Mappers"
task :contentful do
  Jekyll::Commands::Contentful.process([], {}, Jekyll.configuration['contentful'])
end
