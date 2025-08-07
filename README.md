# Motion Scroll Reveal

A CLI tool that scaffolds scroll reveal functionality.

This tool copies two template files to your project:
- `scroll-reveal.js`
- `scroll-reveal.css`

The files are copied to the `themes/app/src/` directory structure:
- `themes/app/src/scripts/components/scroll-reveal.js`
- `themes/app/src/styles/components/scroll-reveal.css`

The tool also:
- Installs the `motion` dependency if it is not installed already
- Updates your `themes/app/src/index.js` file to import and initialize the scroll reveal component

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Link the package globally:
   ```bash
   yarn link
   ```
4. The command `ss-scroll-reveal` will now be available. Run it from the root of a project.

To unlink, run:
```bash
yarn unlink ss-scroll-reveal
```