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
end

desc "Build both ACC and PEC sites"
task :build do
  if ENV["CI"] || system("which parallel") # On macOS: `brew install parallel` (optional)
    exec("parallel bundle exec rake build:{} ::: acc pec")
  else
    %w(acc pec).each { |site| Rake::Task["build:#{site}"].invoke }
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

    Jekyll::Commands::Contentful.process([], {}, config)
  end

  desc "Import PEC Contentful data"
  task :pec do
    config = Jekyll.configuration["contentful"]
    config["spaces"].select! { |space| space.include?("pec") }

    config["spaces"][0]["pec"].merge!({
      "space" => ENV["CONTENTFUL_PEC_SPACE_ID"],
      "access_token" => ENV["CONTENTFUL_PEC_ACCESS_TOKEN"]
    })

    Jekyll::Commands::Contentful.process([], {}, config)
  end
end

desc "Import both ACC and PEC Contentful data"
multitask :contentful => ["contentful:acc", "contentful:pec"]

desc "Import ACC and PEC event listings from Socrata (data.austintexas.gov)"
task :calendar do
  Calendar::Import.import(Jekyll.configuration)
end

desc "Import all Contentful and Calendar data"
multitask :import => [:contentful, :calendar]

namespace :deploy do
  task :acc do
    exec "SITE=acc S3_BUCKET=www.austinconventioncenter.com s3_website push --site=_site/acc"
  end

  task :pec do
    exec "SITE=pec S3_BUCKET=www.palmereventscenter.com s3_website push --site=_site/pec"
  end
end

task :deploy do
  exec "parallel bundle exec rake deploy:{} ::: acc pec"
end

# CI-specific import, build, and deploy commands that toggle between ACC, PEC, or both, depending on
# a $SITE env var, which is set as a build parameter by the Contentful webhooks. We build and deploy
# only the relevant site when receiving a Contentful webhook, but new commits to master update both.
namespace :ci do
  task :import => [:calendar] do
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

  # Nightly task run by Heroku Scheduler to rebuild the site (rebuilding nightly ensures the
  # calendar is always up-to-date).
  task :scheduler do
    require 'faraday'

    connection = Faraday.new("https://circleci.com") do |faraday|
      faraday.request  :url_encoded
      faraday.response :logger
      faraday.adapter Faraday.default_adapter
    end

    connection.post("/api/v1/project/cityofaustin/austinconventioncenter.com/tree/master") do |request|
      request.params["circle-token"] = ENV["CIRCLE_TOKEN"]
    end
  end
end
