# contributors-table

> [!WARNING]
> **Unstable**. Breaking changes are possible at the moment, use at your own risk

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
- `roundness` (optional, default: 5): Border radius of avatars (use 'yes' for full circle)
- `borderWidth` (optional, default: 0): Width of avatar borders
- `ssr` (optional, default: true): Enable/disable server-side rendering
- `type` (optional, default: 'svg'): Output format ('svg' or 'png')

### Examples

Custom styling:

```markdown
![Contributors](https://contributors-table.vercel.app/image?repo=OWNER/REPO&width=50&gap=10&columns=10&roundness=yes)
```

![Contributors](https://contributors-table.vercel.app/image?repo=material-extensions/vscode-material-icon-theme&width=50&gap=10&columns=10&roundness=yes)

PNG format with limited contributors:

```markdown
![Contributors](https://contributors-table.vercel.app/image?repo=OWNER/REPO&max=50&type=png)
```

![Contributors](https://contributors-table.vercel.app/image?repo=material-extensions/vscode-material-icon-theme&max=50&type=png)
