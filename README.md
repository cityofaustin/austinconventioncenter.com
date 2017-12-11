## About

This is the website of the Austin Convention Center Department, which was created by a team in the City's [Design, Technology, and Innovation Fellows program][dti].

[dti]: http://cityofaustin.github.io/innovation-fellows/

## Architecture

This project implements a decoupled CMS, which you can read about in [our Medium post][medium]. It uses [Contentful][] as the content editor and [Jekyll][] as the static site generator.

The same source builds both austinconventioncenter.com and palmereventscenter.com using content from separate Contentful spaces. Site-specific files in [_config/](_config) extend the base configuration found in [_config.yml](_config.yml).

We continuously deploy the static sites to Amazon S3 by using [s3_website][] on CircleCI. The [Rakefile](Rakefile) includes CI-specific build and deploy commands. We also use Heroku Scheduler to trigger nightly CI builds that ensure imported calendar events are kept current.

[medium]: https://medium.com/city-of-austin-design-technology-innovation/how-were-thinking-about-content-management-for-city-government-88f563497096
[contentful]: https://www.contentful.com
[jekyll]: https://jekyllrb.com
[s3_website]: https://github.com/laurilehmijoki/s3_website

## Getting Started

1. Clone the repo:

        $ git clone https://github.com/cityofaustin/austinconventioncenter.com.git

2. Install deps (requires npm version 3.x; repeat when the Gemfile or package.json changes):

        $ bundle install
        $ npm install

3. Add the following line to your `.bash_profile`:  

    ```
    eval "$(direnv hook $0)"
    ```

4. Import Contentful data:

    Using the values found in Contentful's APIs tab, set these variables in your local checkout using a tool like [direnv][] (add `.envrc` to your **global** gitignore):

            export CONTENTFUL_ACC_SPACE_ID='TBD'
            export CONTENTFUL_ACC_ACCESS_TOKEN='TBD'
            export CONTENTFUL_ACC_STAGING_ACCESS_TOKEN='TBD'
            export CONTENTFUL_PEC_SPACE_ID='TBD'
            export CONTENTFUL_PEC_ACCESS_TOKEN='TBD'
            export CONTENTFUL_PEC_STAGING_ACCESS_TOKEN='TBD'

    Then run `rake contentful` (or `rake contentful:acc`, `rake contentful:pec`, `rake contentful:acc_staging`, or `rake contentful:pec_staging`).

5. Import calendar data (from data.austintexas.gov's Socrata API):

        $ rake calendar

6. Serve the Jekyll site(s):

    `$ foreman start acc`, `$ foreman start pec`, `$ foreman start acc_staging`, `$ foreman start pec_staging`, or just `$ foreman start` for all.

[direnv]: http://direnv.net

## Contributing

Refer to the _Application Development_ section of the [Developer Guide][], particularly the Git workflow.

[Developer Guide]: http://developer-guides.austintexas.io

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

### Making changes to the content model

It will sometimes be necessary to add, remove, or change content types and fields in Contentful. Rather than make changes in the production spaces, the recommended workflow is to use Contentful's [export][] and [import][] tools to spin up temporary staging spaces, and then to sync content model changes back to the production spaces.

1. Get a [personal access token][token] and set it as `$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` in your local env.

[token]: https://www.contentful.com/developers/docs/references/authentication/#getting-a-personal-access-token

2. Create a new, empty space in Contentful (e.g. "ACC Dev").

3. Export the ACC Production space:

    ```
    $ contentful-export --skip-webhooks \
      --space-id $CONTENTFUL_ACC_SPACE_ID \
      --management-token $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
      --skip-webhooks
    ```

4. Change your local `$CONTENTFUL_ACC_SPACE_ID` to the dev space ID.

5. Import the production space data to the dev space:

    ```
    $ contentful-import --content-model-only \
      --space-id=<ACC_DEV_SPACE_ID> \
      --management-token=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
      --content-file=<ACC_PRODUCTION_EXPORT_FILE>.json
    ```

6. Change the content model in the new space, and then test your changes locally by running `$ rake contentful:acc` and running `$ foreman start acc`.

7. When the changes are complete, repeat steps 2 through 5 for PEC, creating "PEC Dev" and exporting/importing the PEC Production data.

8. Export the updated content model from the new ACC Dev space:

    ```
    $ contentful-export --space-id $CONTENTFUL_ACC_SPACE_ID \
      --management-token $CONTENTFUL_MANAGEMENT_ACCESS_TOKEN
    ```

9. Test importing the updated content model from the ACC Dev to the PEC Dev space:

    ```
    $ contentful-import --content-model-only \
      --space-id=<PEC_DEV_SPACE_ID> \
      --management-token=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
      --content-file=<ACC_DEV_EXPORT_FILE>.json
    ```

10. If step 9 succeeds, you can proceed to change your env vars back to the production values and then run `contentful-import` to update both the ACC and PEC production spaces using the dev export and the **`--content-model-only`** option:

  ```
  $ contentful-import --content-model-only \
    --space-id=$CONTENTFUL_ACC_SPACE_ID \
    --management-token=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
    --content-file=<ACC_DEV_EXPORT_FILE>.json

  $ contentful-import --content-model-only \
    --space-id=$CONTENTFUL_PEC_SPACE_ID \
    --management-token=$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN \
    --content-file=<ACC_DEV_EXPORT_FILE>.json
  ```

11. Once you've confirmed everything is working, you can delete the ACC Dev and PEC Dev spaces.

In some cases, it may also be necessary to update existing entries en masse, using Rake and the [contentful-management][] gem or a similar migration script workflow. You can use the above procedure to test such migrations. When you're ready to run your script on the production spaces, you should temporarily disable the production space webhooks to avoid triggering unnecessary deploys. Reenable them after the updates are published.

[export]: https://github.com/contentful/contentful-export
[import]: https://github.com/contentful/contentful-import
[contentful-management]: https://github.com/contentful/contentful-management.rb

## Deploying

Each site deploys automatically when new commits are added to master or when data in their respective Contentful spaces is updated. Deploy progress and output can be viewed in [the publicly-accessible CircleCI project](https://circleci.com/gh/cityofaustin/austinconventioncenter.com).

| Environment                              | Status                                   |
| ---------------------------------------- | ---------------------------------------- |
| Production<br />[ACC](https://austinconventioncenter.com) \| [PEC](https://palmereventscenter.com) \| [CircleCI](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/master) | [![CircleCI](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/master.svg?style=svg)](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/master) |
| Staging<br />[ACC](http://staging.austinconventioncenter.com) \| [PEC](http://staging.palmereventscenter.com) \| [CircleCI](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/staging) | [![CircleCI](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/staging.svg?style=svg)](https://circleci.com/gh/cityofaustin/austinconventioncenter.com/tree/staging) |

## Credits

* Our prototyping wouldn't be nearly as solid without the [U.S. Web Design Standards][uswds] developed by [18F][] :heart:

[uswds]: https://standards.usa.gov
[18f]: https://github.com/18f/web-design-standards

