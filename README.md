## About

This is the new website of the Austin Convention Center Department, currently under active development. The project is being led by a team in the City's [Design, Technology, and Innovation Fellows program][dti].

We're using [sprints], and you're welcome to check out [our Trello board][trello].

[dti]: http://cityofaustin.github.io/innovation-fellows/
[sprints]: https://en.wikipedia.org/wiki/Scrum_(software_development)
[trello]: https://trello.com/b/6c52YDzi/acc-pec

## Architecture

This project implements a decoupled CMS, which you can read about in [our Medium post][medium]. It uses [Contentful][] as the content editor and [Jekyll][] as the static site generator.

The same source builds both austinconventioncenter.com and palmereventscenter.com using content from separate Contentful spaces. Site-specific files in [_config/](_config) extend the base configuration found in [_config.yml](_config.yml).

We continuously deploy the static sites to Amazon S3 by using [s3_website][] on CircleCI. The [Rakefile](Rakefile) includes CI-specific build and deploy commands.

[medium]: https://medium.com/city-of-austin-design-technology-innovation/how-were-thinking-about-content-management-for-city-government-88f563497096
[contentful]: https://www.contentful.com
[jekyll]: https://jekyllrb.com
[s3_website]: https://github.com/laurilehmijoki/s3_website

## Getting Started

1. Clone the repo:

        $ git clone https://github.com/cityofaustin/austinconventioncenter.com.git

2. Install deps (repeat when the Gemfile or package.json changes):

        $ bundle install
        $ npm install

3. Import Contentful data:

    Using the values found in Contentful's APIs tab, set these variables in your local checkout using a tool like [direnv][] (add `.envrc` to your **global** gitignore):

            export CONTENTFUL_ACC_SPACE_ID='TBD'
            export CONTENTFUL_ACC_ACCESS_TOKEN='TBD'
            export CONTENTFUL_PEC_SPACE_ID='TBD'
            export CONTENTFUL_PEC_ACCESS_TOKEN='TBD'

    Then run `rake contentful` (or `rake contentful:acc` and `rake contentful:pec`).

4. Import calendar data (from data.austintexas.gov's Socrata API):

        $ rake calendar

5. Serve the Jekyll site(s):

    `$ foreman run acc`, `$ foreman run pec`, or just `$ foreman run` for both.

[direnv]: http://direnv.net

## Contributing

Refer to the [Developer Guide][], particularly the Git workflow.

[Developer Guide]: http://pages.austintexas.io/guides/developer-guide/

## Working with Contentful

Start with understanding the concepts outlined in [Contentful's developer docs](https://www.contentful.com/developers/docs/).

### Importing content

Contentful entries are made available to Jekyll using the official [jekyll-contentful-data-import][] gem, which is used by `$ rake contentful` commands to download entries into [_data/](_data).

[jekyll-contentful-data-import]: https://github.com/contentful/jekyll-contentful-data-import

### Rendering content

A Jekyll generator in [_plugins/](_plugins/generators/contentful.rb) creates [Collections and Documents][collections] from the Section and Page content types.

Templates and layouts render Contentful attributes using `page.contentful` in [Liquid][]. The [front matter defaults][] in [_config.yml](_config.yml) define the layouts used to render pages in a given collection and by default.

For each page, the generator also looks in [_templates](_templates) for a file with the same URL (i.e. path, by default), and renders that file, if found, instead of the default layout. A custom template for a page with the URL /example/ would be _templates/example.html.

To render specific content outside of a page (such as a particular menu), `site.contentful` exposes the contents of the entire data file, and plays nicely with [Jekyll's `where` filters][where]. See an example in [_includes/header.html](_includes/header.html).

[collections]: https://jekyllrb.com/docs/collections/
[liquid]: http://liquidmarkup.org
[front matter defaults]: https://jekyllrb.com/docs/configuration/#front-matter-defaults
[where]: https://jekyllrb.com/docs/templates/

### Syncing the content model from ACC to PEC

Edit the content model in the ACC space **only**, and then use Contentful's [Space Sync tool][space-sync] to sync it to the Palmer space. Example command (requires `CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` to be set in your local env):

```
contentful-space-sync --content-model-only \
  --source-space=$CONTENTFUL_ACC_SPACE_ID \
  --destination-space=$CONTENTFUL_PEC_SPACE_ID \
  --source-delivery-token=$CONTENTFUL_ACC_ACCESS_TOKEN \
  --destination-delivery-token=$CONTENTFUL_PEC_ACCESS_TOKEN \
  --management-token=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
```

[space-sync]: https://github.com/contentful/contentful-space-sync

## Deploying

Each site deploys automatically when new commits are added to master or when data in their respective Contentful spaces is updated. Deploy progress and output can be viewed in CircleCI.

## Credits

* Our prototyping wouldn't be nearly as solid without the [U.S. Web Design Standards][uswds] developed by [18F][] :heart:

[uswds]: https://standards.usa.gov
[18f]: https://github.com/18f/web-design-standards

