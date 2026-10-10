# Repository guidance

## Build, test, and lint

- There is no build script or compile step; the project runs directly on Node.js.
- Run the full Jest suite once with `npx jest --runInBand`. `npm test` starts Jest in watch mode.
- Run one test file with `npx jest --runInBand src/Polycube.test.js`, or one named test with `npx jest --runInBand src/generate/simple_flat.test.js -t "n=4 => 8"`.
- Run coverage with `npm run coverage`.
- Run lint with `npx eslint .`. The `npm run lint` script invokes ESLint but ends with `|| exit 0`, so its exit status does not reliably report lint failures.
- To enumerate a size, run `node index.js enumerate <n>` from the repository root. `n` is limited to 1–9; generated levels are saved under `precomputed/`.

## Architecture

The CLI in `index.js` selects `src/generate/simple_flat.js` and passes it to `src/dynamic.js`. The dynamic controller loads the previous level from `precomputed/<n-1>.json`, wraps each stored shape as a `Polycube`, calls the generator, and saves the new level. Level 1 is checked in as the seed; file paths are relative to the working directory.

The active generator builds each next shape by adding one cube at every unoccupied face-adjacent position (`listLocationsToGrow` and `grow` in `simple_layers.js`). It normalizes candidate orientations, groups candidates by dimensions and corner occupancy, then removes rotational duplicates. `simple_layers.js` also contains simpler reference implementations of the same generation approach.

`Polycube` provides dimension/count helpers, a cached serialization for exact-grid equality, and rotations. Geometric equivalence is handled by generating rotations, not by `equals()` itself. The `src/utils/` modules implement shape operations, rotation/orientation normalization, and JSON file I/O; `utils/index.js` is their shared export point.

## Conventions and invariants

- A shape is a rectangular numeric 3D array indexed as `shape[x][y][z]`; `1` marks an occupied cube and `0` an empty cell. Keep all rows and planes dimensionally consistent, including padding added during growth.
- `utils.shape.normalizeOrientation(shape)` returns `{ shape, orientation }`, not just an array. Preserve the orientation metadata when constructing a `Polycube` if you need the reduced 8-rotation path; normalized dimension grouping relies on candidates being normalized first.
- Source modules use CommonJS (`require`/`module.exports`). ESLint configuration uses tabs for indentation and single-quoted strings; Jest tests live beside source files as `*.test.js` under `src/`.
- Generation tests assert known counts through size 8; higher-count cases are marked todo. Prefer focused tests at small sizes when changing generation, normalization, or rotation behavior.
