# Project Architecture

## Project Structure

```plaintext
👥 contributors-table/
├─ 📂 api/
   ├─ 📄 _github.ts       # GitHub API utilities
   ├─ 📄 _utils.ts        # Utility functions for API layer
   └─ 📄 index.ts         # Vercel serverless API endpoint
```

## Components Overview

- `api/index.ts`: Vercel serverless API endpoint
- `api/_github.ts`: GitHub API utilities
- `api/_utils.ts`: Utility functions for generating contributors table
