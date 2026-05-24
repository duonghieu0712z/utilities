# Tauri Vue Template

A compact Tauri 2 + Vue 3 template for desktop apps. It includes TypeScript, Vite, Tailwind CSS 4, shadcn-vue conventions, typed Rust-to-TypeScript bindings through Specta, and GitHub Actions for code quality and release builds.

## Stack

This template keeps the stack focused on the pieces that usually need project-level wiring:

- [Tauri 2](https://tauri.app/) with [Rust](https://www.rust-lang.org/) for the desktop shell and backend commands
- [Vue 3](https://vuejs.org/), [TypeScript](https://www.typescriptlang.org/), and [Vite](https://vite.dev/) for the frontend
- [shadcn-vue](https://www.shadcn-vue.com/) conventions with [Tailwind CSS 4](https://tailwindcss.com/) and [Lucide Vue](https://lucide.dev/) for UI
- [Specta](https://github.com/specta-rs/specta) and [tauri-specta](https://github.com/oscartbeaumont/tauri-specta) for generated Rust-to-TypeScript bindings
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html), [ESLint](https://eslint.org/), and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) for linting and formatting

## Prerequisites

Install Node.js, pnpm, Rust, and the Tauri system dependencies for your operating system. The package is configured for Node.js `^20.19.0 || >=22.12.0`; GitHub Actions currently use Node.js 24 and pnpm 11.

On Ubuntu/Debian, install the Tauri Linux dependencies:

```bash
sudo apt-get update
sudo apt-get install -y libwebkit2gtk-4.1-dev libappindicator3-dev librsvg2-dev patchelf
```

## Create a New Project

After publishing the create package, scaffold a new project with:

```bash
pnpm create @duonghieu0712z/tauri-vue-template@latest
```

Pass values directly when needed:

```bash
pnpm create @duonghieu0712z/tauri-vue-template@latest my-app --name "My App" --id "com.example.my-app" --author "Your Name"
```

The create package copies this template into the target directory, updates the package name, Tauri product name, application identifier, Rust crate names, release workflow metadata, and then leaves dependency installation to the new project.

## Development

Install dependencies:

```bash
pnpm install
```

Run the desktop app in development mode:

```bash
pnpm start
```

## Local Build

Build the full Tauri desktop app locally:

```bash
pnpm make
```

The generated installers and bundles are written under `src-tauri/target/release/bundle/`.

## Quality Checks

Check formatting and linting:

```bash
pnpm format
pnpm lint
```

Apply automatic fixes:

```bash
pnpm format:fix
pnpm lint:fix
```

## Rust and TypeScript Bridge

Backend commands live in `src-tauri/src/command/` and are registered through `tauri-specta`. During debug builds, Specta exports TypeScript bindings to `src/generated/bindings.ts`, so frontend calls can use generated types instead of manually duplicated contracts.

## Rename the App

After creating a new project from this template, update the application name and Tauri identifier:

```bash
pnpm rename --name "My App" --id "com.example.my-app" --author "Your Name"
```

Set the package name explicitly when needed:

```bash
pnpm rename --name "My App" --id "com.example.my-app" --author "Your Name" --package "my-app"
```

After renaming, review the updated project identity in:

- `package.json`
- `index.html`
- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `src-tauri/src/main.rs`
- `.github/workflows/release.yml`

Regenerate lockfiles after renaming:

```bash
pnpm install
cargo check --manifest-path src-tauri/Cargo.toml
```

## Versioning and Releases

Bump the app version:

```bash
pnpm bump 0.1.0
```

The version script updates `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml`.

The release workflow builds macOS, Linux, and Windows bundles with `tauri-apps/tauri-action`, then creates a GitHub Release with the generated installers attached.
