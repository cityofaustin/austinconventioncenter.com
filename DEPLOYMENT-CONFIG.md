This document contains details on environment-level configurations across the different services that are used to manage and deploy the sites.

---

# Amazon Web Services

ACCD maintains its own AWS organizational account. User and machine privileges are configured through IAM.

### ACM (AWS Certificate Manager)

A wildcard SSL certificate covers the apex domain and all first-level subdomains (`*.austinconventioncenter.com`, `*.palmereventscenter.com`). It was generated directly through ACM.

The certificate is aded to the CloudFront configurations via the CloudFront Distributions settings.

### CloudFront

CloudFront distributes the site files to edge servers to improve response and delivery times across the world. Each domain (apex, www, staging) must have its own CloudFront configuration as defined below:

| CloudFront Distribution Setting     | Value                                    |
| ----------------------------------- | ---------------------------------------- |
| Origin Domain Name                  | Select the corresponding S3 bucket       |
| Viewer Protocol Policy              | `Redirect HTTP to HTTPS`                 |
| Query String Forwarding and Caching | `Forward all, cache based on all`        |
| Default Root Object                 | `index.html`                             |
| SSL Certificate                     | Select the wildcard certificate for the appropriate domain (`*.austinconventioncenter.com` or `*.palmereventscenter.com`) |

### IAM (Identity & Access Management)

An IAM account contains credentials that allow the S3 buckets and CloudFront sessions to be updated via API. If that account is removed or if its credentials are invalidated then the AWS-specific environment variables in CircleCI will need to be re-established.

### Route 53

The DNS records for the ACC and PEC domains are managed through Route 53. See [Amazon's guide for routing traffic to an S3 bucket](http://docs.aws.amazon.com/Route53/latest/DeveloperGuide/RoutingToS3Bucket.html).

Each domain requires an `A` record configured as an Alias, targeting the corresponding CloudFront Distribution.

### S3 (Simple Storage Service)

The static site directories generated in the build process are stored in S3 buckets. There are 6 buckets all together.

| Buckets                                  | Description        | Configuration                            |
| ---------------------------------------- | ------------------ | ---------------------------------------- |
| www.austinconventioncenter.com; www.palmereventscenter.com | Production sites   | Set to host a static site with homepage set as `index.html`; Bucket policy set to Public |
| austinconventioncenter.com;  palmereventscenter.com | Production aliases | Set to host a static site as redirect to the corresponding `www.*` bucket |
| staging.austinconventioncenter.com; staging.palmereventscenter.com | Staging sites      | Set to host a static site with homepage set as `index.html`; Bucket policy set to Public |

---

# CircleCI

Use GitHub to sign into CircleCI to manage the CI pipeline. Users with the _Owner_ role in the repository will have full access to the CircleCI Project settings. Project privileges are determined based on the level of access granted in GitHub.

### Environment Variables

Developers should be able to access the necessary environment variables with their privilege levels in each of the services in the pipeline.

Note that the `JEKYLL_ENV` value is `production` for all sites (even the staging ones). The build-level environment awareness comes from the `environment` attribute defined in each site's config file.

### API Permissions

A token must be used in the webhook URL defined in the Contentful settings.

---

# Contentful

The ACC and PEC spaces belong to the ACCD Organization. Users can have different privileges at the Organization and Space levels. The current subscription ($250/mo as of Dec 2017) allows up to 15 users in the Organization.

### Webhooks

Each Contentful Space (_ACC_ and _PEC_) has 2 webhooks, one for production and one for staging.

URL Template:  

```
https://circleci.com/api/v1.1/project/github/cityofaustin/austinconventioncenter.com/tree/<BRANCH>?build_parameters[SITE]=<SITE ID>&circle-token=<CIRCLE TOKEN>
```

| Parameter        | Possible Values                          |
| ---------------- | ---------------------------------------- |
| `<BRANCH>`       | `master`; `staging`                      |
| `<SITE ID>`      | `acc`; `pec`; `acc_staging`; `pec_staging` |
| `<CIRCLE TOKEN>` | The token generated in the CircleCI project settings |

The production webhook is triggered by _Publish_, _Unpublish_ actions on Entry items.

The staging webhook is triggered by _Create_, _Save_, _Autosave_, _Publish_, and _Unpublish_ on Entry items.

---

# GitHub

The repository belongs to the official _CityOfAustin_ organization. Access privileges can be granted at the Organization, Team, or Repository level.

### Protected Branches

`master` is protected - Any changes to the branch must come via Pull Request, and the Pull Request must be reviewed in order to be merged. In addition, CircleCI build tests must pass before the PR can be merged.

### Webhooks

- `https://kolkrabbi.heroku.com/hooks/github`  
  Added by Heroku when auto-deployments were enabled in the Heroku Dashboard
- `https://circleci.com/hooks/github`  
  Notify CircleCI of any new Pull Requests or Pushes so it can trigger a test build and, when appropriate, a deployment.  
  _Note that this webhook was previously activated on all repo events, and there's a chance that was causing an overload of CircleCI requests resulting in several temporary suspension of the CircleCI project due to suspected abuse._

------

# Heroku

The Heroku application belongs to the _ACCD_ team on Heroku, which manages its own billing and access settings.

### Nightly rake task

Heroku runs a nightly task to import the latest calendar data from Socrata, parse it, and trigger a build using the refreshed _yml_.

The code is re-deployed to Heroku whenever `master` is updated. The `kolkarri.heroku.com` webhook in the GitHub repo settings manages that update, and the settings are configurable in the Heroku web dashboard.

