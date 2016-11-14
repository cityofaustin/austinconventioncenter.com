## About

This is the new website of the Austin Convention Center Department, currently under active development. The project is being led by a team in the City's [Design, Technology, and Innovation Fellows program][dti].

We're using [sprints], and you're welcome to check out [our Trello board][trello].

[dti]: http://cityofaustin.github.io/innovation-fellows/
[sprints]: https://en.wikipedia.org/wiki/Scrum_(software_development)
[trello]: https://trello.com/b/6c52YDzi/acc-pec

## Architecture

This project implements a decoupled CMS, which you can read about in [our Medium post][medium]. It uses [Contentful][], "a developer-friendly, API-first CMS," as the content editor, and [Jekyll][] as the static site generator.

The same source will produce the static sites for both austinconventioncenter.com and palmereventscenter.com, using a separate Contentful space for each.

<!-- TODO: Detail Continuous Deployment and AWS -->

[medium]: https://medium.com/city-of-austin-design-technology-innovation/how-were-thinking-about-content-management-for-city-government-88f563497096
[contentful]: https://www.contentful.com
[jekyll]: https://jekyllrb.com

## Quick Start

`$ git clone`, `$ bundle install`, `$ npm install`, `$ rake contentful`, `$ rake calendar`, `$ jekyll serve`

## Contributing

Refer to the [Developer Guide][], particularly the Git workflow.

[Developer Guide]: https://github.com/cityofaustin/developer-guide

## Working with Contentful

Start with understanding the concepts outlined in [Contentful's developer docs](https://www.contentful.com/developers/docs/).

<!-- TODO: Commit content model/type JSON to repo for bootstrap. -->

### Importing content

Contentful entries are made available to Jekyll using the official [jekyll-contentful-data-import][] gem, which provides the `$ jekyll contentful` command to download entries into [_data/](_data).

<!-- TODO: Add option to download the latest data from GitHub w/o Contentful keys. -->

To run `$ jekyll contentful`, you'll need to set the `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` environment variables from the API keys found in the Contentful editor. Do not commit those keys; we recommend using an environment switcher like [direnv][] and adding the dotfile (e.g. `.envrc`) to your **global** gitignore.

Git ignores the imported YAML files by default; avoid committing them to topic branches and master.

[jekyll-contentful-data-import]: https://github.com/contentful/jekyll-contentful-data-import
[direnv]: http://direnv.net

### Rendering content

A Jekyll generator in [_plugins/](_plugins/generators/contentful.rb) creates [Collections and Documents][collections] from the Section and Page content types.

Templates and layouts render Contentful attributes using `page.contentful` in [Liquid][]. The [front matter defaults][] in [_config.yml](_config.yml) define the layouts used to render pages in a given collection and by default.

For each page, the generator also looks in [_custom](_custom) for a template with a matching `contentful_id` in its front matter. If a match is found, the generator renders the page with template instead of the default layout.

To render specific content outside of a page (such as a particular menu), `site.contentful` exposes the contents of the entire data file, and plays nicely with [Jekyll's `where` filters][where]. See an example in [_includes/header.html](_includes/header.html).

Use the `$ jekyll build` and `$ jekyll serve` commands as you would normally.

[collections]: https://jekyllrb.com/docs/collections/
[liquid]: http://liquidmarkup.org
[front matter defaults]: https://jekyllrb.com/docs/configuration/#front-matter-defaults
[where]: https://jekyllrb.com/docs/templates/

<!-- ## Deploying (TODO) -->

## Credits

* Our prototyping wouldn't be nearly as solid without the [U.S. Web Design Standards][uswds] developed by [18F][] :heart:

[uswds]: https://standards.usa.gov
[18f]: https://github.com/18f/web-design-standards

