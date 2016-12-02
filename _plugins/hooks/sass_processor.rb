# Note: It's useful to disable asset caching while editing or debugging this file.
module SassFunctions
  # Fetch a Jekyll config value in Sass, e.g. `$site = config_value("id");`
  def config_value(string)
    keys = string.value.split(".")
    Sass::Script::Value::String.new(sprockets_environment.jekyll.config.dig(*keys))
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  scss_engine = Sprockets::ScssProcessor.new(functions: SassFunctions)
  site.sprockets.register_engine '.scss', scss_engine, mime_type: 'text/css'
end
