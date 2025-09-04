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
- name: UI PR preview
  uses: sayjeyhi/ui.pr.new@v0.1.0
  with:
    pkg_manager: bun
    build_command: bun build
    serve_command: bun start
    base_path: ./test
    static_path: ./test/dist
    port: 3000
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

| Option               | Description                                  | Required                                                                       | Example                                                           |
|----------------------|----------------------------------------------|--------------------------------------------------------------------------------|-------------------------------------------------------------------|
| `pkg_manager`        | Package manager to use                       | Yes                                                                            | `npm`, `yarn`, `pnpm`, `bun`                                      |
| `build_command`      | Command to build the project                 | Yes                                                                            | `npm run build`, `yarn build`, `pnpm build`, `bun build`          |
| `serve_command`      | Command to serve the project                 | Yes                                                                            | `npm run start`, `yarn start`, `pnpm start`, `bun start`          |
| `base_path`          | Base path of the project                     | No (default: `./`)                                                             | `./test`, `./frontend`, `./app`                                   |
| `static_path`        | Path to the built static files               | Yes                                                                            | `./dist`, `./test/dist`, `./frontend/dist`, `./build`, `./public` |
| `port`               | Port to run the preview server               | No (default: `3000`)                                                           | `3000`, `8080`                                                    |

### Set up required secrets

Add the following secrets to your repository:

- `GITHUB_TOKEN`: GitHub token with write access to the repository

## License

MIT
