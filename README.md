# UI preview Github Action

Automatically build and preview your UI in a GitHub Action using WebContainers and Github action.

## Features

- No setup required - Just add a workflow file
- Supports any frontend framework (React, Vue, Svelte, Angular, etc.)
- Supports static sites (HTML, CSS, JS)
- Build per commit or per pull request
- Preview in a browser with a unique URL

## Setup

Create a `pr.preview.yml` file in .github/workflows and use the following template:

```yaml
name: Deploy WebContainer Using pr.catshoulder.dev

on:
  pull_request:
    types: [opened, synchronize]
jobs:
  preview-webcontainer:
    runs-on: ubuntu-latest
    steps:
      - name: UI PR preview
        uses: sayjeyhi/pr.catshoulder.dev@v0.1.0
        with:
          pkg_manager: pnpm
          root_dir: ./example
          serve_command: pnpm start
          domain: pr.catshoulder.dev
          github_user: sayjeyhi
          github_pat: ${{ secrets.GHCR_PAT }}
          kube_config: ${{ secrets.KUBE_CONFIG }}
```

### Inputs Options:

| Option          | Description                                                      | Required                           | Example                                                  |
|-----------------|------------------------------------------------------------------|------------------------------------|----------------------------------------------------------|
| `pkg_manager`   | Package manager to use                                           | Yes                                | `npm`, `yarn`, `pnpm`, `bun`                             |
| `root_dir`      | Base path of the project                                         | No (default: `./`)                 | `./test`, `./frontend`, `./app`                          |
| `serve_command` | Command to serve the project                                     | Yes                                | `npm run start`, `yarn start`, `pnpm start`, `bun start` |
| `domain`        | Domain for preview URLs                                          | No (default: `pr.catshoulder.dev`) | `your.domain.com`                                        |
| `github_user`   | Github user for actions                                          | No (default: `pr.catshoulder.dev`) | `your.domain.com`                                        |
| `github_pat`    | GitHub personal access token with write access to the repository | Yes                                | `${{ secrets.GHCR_PAT }}`                                |
| `kube_config`   | Kubernetes config for deploying the preview                      | Yes                                | `${{ secrets.KUBE_CONFIG }}`                             |


## License

MIT
