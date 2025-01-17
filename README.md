# contributors-table

> Powered by [▲ Vercel](https://vercel.com) and [contributors-table](https://www.npmjs.com/package/contributors-table) library 😎

## Features

- ⚙️ Flexible settings
- 🔗 Hyperlinks to contributors profiles
- 💡 Hints when hovering over an avatar
- 🎨 Customizable
- 🤝 Images supported by Markdown on GitHub and anywhere!

## Usage

Basic usage:

```markdown
![Contributors](https://contributors-table.vercel.app/image?repo=OWNER/REPO)
```

![Contributors](https://contributors-table.vercel.app/image?repo=material-extensions/vscode-material-icon-theme)

### Parameters

- `repo` (required): Repository in format `OWNER/REPO`
- `max` (optional, default: 100): Maximum number of contributors to display
- `gap` (optional, default: 6): Gap between avatars in pixels
- `width` (optional, default: 40): Width of each avatar in pixels
- `columns` (optional, default: 21): Number of columns in the table
- `rows` (optional, default: 7): Number of rows in the table
- `roundness` (optional, default: 5): Border radius of avatars (use 'yes' for full circle)
- `strokeWidth` (optional, default: 0): Width of avatar borders
- `ssr` (optional, default: true): Enable/disable server-side rendering
- `format` (optional, default: 'svg'): Output format ('svg' or 'png')

### Examples

Custom styling:

```markdown
![Contributors](https://contributors-table.vercel.app/image?repo=OWNER/REPO&width=50&gap=10&columns=10&roundness=yes)
```

![Contributors](https://contributors-table.vercel.app/image?repo=material-extensions/vscode-material-icon-theme&width=50&gap=10&columns=10&roundness=yes)

PNG format with limited contributors:

```markdown
![Contributors](https://contributors-table.vercel.app/image?repo=OWNER/REPO&max=50&format=png)
```

![Contributors](https://contributors-table.vercel.app/image?repo=material-extensions/vscode-material-icon-theme&max=50&format=png)

### 👇 Deploy your own instance in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjust-serverless%2Fcontributors-table%2F&env=GITHUB_APP_TOKEN&envDescription=GitHub%20Personal%20Access%20Token%20(PAT)%20from%20https%3A%2F%2Fgithub.com%2Fsettings%2Fpersonal-access-tokens)
