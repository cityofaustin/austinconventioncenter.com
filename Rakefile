require 'bundler/setup'
require 'jekyll'
require 'jekyll-contentful-data-import'

Dir[File.expand_path("lib/**/*.rb")].each { |file| require file }

namespace :build do
  desc "Run `jekyll build` with ACC configuration (use `foreman start acc` for `jekyll serve`)"
  task :acc do
    Jekyll::Commands::Build.process(config: ["_config.yml", "_config/acc.yml"])
  end

  desc "Run `jekyll build` with PEC configuration (use `foreman start pec` for `jekyll serve`)"
  task :pec do
    Jekyll::Commands::Build.process(config: ["_config.yml", "_config/pec.yml"])
  end

  desc "Run `jekyll build` with ACC Staging configuration (use `foreman start acc_staging` for `jekyll serve`)"
  task :acc_staging do
    Jekyll::Commands::Build.process(config: ["_config.yml", "_config/acc_staging.yml"])
  end

  desc "Run `jekyll build` with PEC Staging configuration (use `foreman start pec_staging` for `jekyll serve`)"
  task :pec_staging do
    Jekyll::Commands::Build.process(config: ["_config.yml", "_config/pec_staging.yml"])
  end
end

desc "Build the sites"
task :build do
  if ENV["CI"] || system("which parallel") # On macOS: `brew install parallel` (optional)
    if ENV["CIRCLE_BRANCH"] == "master"
      exec("parallel bundle exec rake build:{} ::: acc pec")
    else
      exec("parallel bundle exec rake build:{} ::: acc_staging pec_staging")
    end
  else
    %w(acc pec acc_staging pec_staging).each { |site| Rake::Task["build:#{site}"].invoke }
  end
end

namespace :contentful do
  desc "Import ACC Contentful data"
  task :acc do
    config = Jekyll.configuration["contentful"]
    config["spaces"].select! { |space| space.include?("acc") }

    config["spaces"][0]["acc"].merge!({
      "space" => ENV["CONTENTFUL_ACC_SPACE_ID"],
      "access_token" => ENV["CONTENTFUL_ACC_ACCESS_TOKEN"]
    })
    puts "Import ACC Contentful data"
    Jekyll::Commands::Contentful.process([], {}, config)
    Rake::Task["generate_events"].invoke('acc')
    Rake::Task["generate_events"].reenable
  end

  desc "Import PEC Contentful data"
  task :pec do
    config = Jekyll.configuration["contentful"]
    config["spaces"].select! { |space| space.include?("pec") }

    config["spaces"][0]["pec"].merge!({
      "space" => ENV["CONTENTFUL_PEC_SPACE_ID"],
      "access_token" => ENV["CONTENTFUL_PEC_ACCESS_TOKEN"]
    })
    puts "Import PEC Contentful data"
    Jekyll::Commands::Contentful.process([], {}, config)
    Rake::Task["generate_events"].invoke('pec')
    Rake::Task["generate_events"].reenable
  end

  desc "Import ACC Staging Contentful data"
  task :acc_staging do
    config = Jekyll.configuration["contentful"]
    config["spaces"].select! { |space| space.include?("acc_staging") }

    config["spaces"][0]["acc_staging"].merge!({
      "space" => ENV["CONTENTFUL_ACC_SPACE_ID"],
      "access_token" => ENV["CONTENTFUL_ACC_STAGING_ACCESS_TOKEN"]
    })
    puts "Import ACC Staging Contentful data"
    Jekyll::Commands::Contentful.process([], {}, config)
    Rake::Task["generate_events"].invoke('acc_staging')
    Rake::Task["generate_events"].reenable
  end

  desc "Import PEC Staging Contentful data"
  task :pec_staging do
    config = Jekyll.configuration["contentful"]
    config["spaces"].select! { |space| space.include?("pec_staging") }

    config["spaces"][0]["pec_staging"].merge!({
      "space" => ENV["CONTENTFUL_PEC_SPACE_ID"],
      "access_token" => ENV["CONTENTFUL_PEC_STAGING_ACCESS_TOKEN"]
    })
    puts "Import PEC Staging Contentful data"
    Jekyll::Commands::Contentful.process([], {}, config)
    Rake::Task["generate_events"].invoke('pec_staging')
    Rake::Task["generate_events"].reenable
  end
end

desc "Generate calendar YAML from Event entries"
task :generate_events, [:site] do |task, args|
  case args.site
    when "acc"
      contentful_params = {
        :space => ENV["CONTENTFUL_ACC_SPACE_ID"],
        :access_token => ENV["CONTENTFUL_ACC_ACCESS_TOKEN"]
      }
    when "acc_staging"
      contentful_params = {
        :space => ENV["CONTENTFUL_ACC_SPACE_ID"],
        :access_token => ENV["CONTENTFUL_ACC_STAGING_ACCESS_TOKEN"],
        :api_url => 'preview.contentful.com'
      }
    when "pec"
      contentful_params = {
        :space => ENV["CONTENTFUL_PEC_SPACE_ID"],
        :access_token => ENV["CONTENTFUL_PEC_ACCESS_TOKEN"]
      }
    when "pec_staging"
      contentful_params = {
        :space => ENV["CONTENTFUL_PEC_SPACE_ID"],
        :access_token => ENV["CONTENTFUL_PEC_STAGING_ACCESS_TOKEN"],
        :api_url => 'preview.contentful.com'
      }
  end
  client = Contentful::Client.new(contentful_params)
  events = client.entries(content_type: 'event')
  events_array = []
  events.each do |e|
    fields = e.fields
    parsed = {
      "name" => e.fields[:name],
      "startDate" => Date.parse(e.fields[:startDate]),
      "endDate" => Date.parse(e.fields[:endDate]),
      "attendance" => e.fields[:attendance],
      "website" => e.fields[:website],
      "location" => e.fields[:location]
    }
    events_array << parsed
  end
  path = File.join("_data", "events", "#{args.site}.yaml")
  FileUtils.mkdir_p(File.dirname(path))
  File.open(path, "w") do |file|
    file.write(YAML.dump(events_array))
  end
end

desc "Import all Contentful data"
if ENV["CI"]
  if ENV["CIRCLE_BRANCH"] == "master"
    multitask :contentful => ["contentful:acc", "contentful:pec"]
  else
    multitask :contentful => ["contentful:acc_staging", "contentful:pec_staging"]
  end
end

desc "Import all Contentful data"
multitask :import => [:contentful]

namespace :deploy do
  task :acc do
    exec "SITE=acc S3_BUCKET=www.austinconventioncenter.com s3_website push --site=_site/acc"
  end

  task :pec do
    exec "SITE=pec S3_BUCKET=www.palmereventscenter.com s3_website push --site=_site/pec"
  end

  task :acc_staging do
    exec "SITE=acc_staging S3_BUCKET=staging.austinconventioncenter.com s3_website push --site=_site/acc_staging"
  end

  task :pec_staging do
    exec "SITE=pec_staging S3_BUCKET=staging.palmereventscenter.com s3_website push --site=_site/pec_staging"
  end
end

task :deploy do
  if ENV["CIRCLE_BRANCH"] == "master"
    exec "parallel bundle exec rake deploy:{} ::: acc pec"
  elsif ENV["CIRCLE_BRANCH"] == "staging"
    exec "parallel bundle exec rake deploy:{} ::: acc_staging pec_staging"
  end
end

# CI-specific import, build, and deploy commands that toggle between ACC, PEC, or both, depending on
# a $SITE env var, which is set as a build parameter by the Contentful webhooks. We build and deploy
# only the relevant site when receiving a Contentful webhook, but new commits to master update both.
namespace :ci do
  task :import do
    Rake::Task["contentful"].invoke(ENV["SITE"])
  end

  task :build do
    task = ENV["SITE"] ? "build:#{ENV["SITE"]}" : "build"
    Rake::Task[task].invoke
  end

  task :deploy do
    task = ENV["SITE"] ? "deploy:#{ENV["SITE"]}" : "deploy"
    Rake::Task[task].invoke
  end
end
