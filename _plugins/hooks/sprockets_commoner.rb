require "sprockets/commoner"

Jekyll::Hooks.register :site, :pre_render do |site|
  Sprockets::Commoner::Processor.configure(site.sprockets, {
    include: [
      "_assets/javascripts",
      "node_modules/dom-delegate"
    ]
  })
end
