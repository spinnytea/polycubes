# polycubes

Enumerating polycubes

# general approach

1. start with `n=1` polycube
1. use that to generate `n=2` polycube
1. use that to generate all `n=3` polycubes
1. …
1. Profit

# version scheme

`major.minor.patch`
 - **major**: highest `n` we can "reasonably" solve (e.g. are we willing to wait for it yet)
 - **minir**: number of different implementations (e.g. so far, only a super simple dynamic algorithm, so 1)
 - **patch**: undecided - whenever there's a milestone, probably just based on the feature or something

## `major`
- **6** could be computed immediately
- **7** was possibly when we added grouping by size
- **8** use a `Map` to dedup the final list + rotations, and a VERY big oversight
- **9** dont store all the intermediates; rotate/aggregate in one go

## `minor`

### **#1:** `simple_layers.generateNextSimple`

Original implementation, possibly the "example" implementation. This is was meant to be so simple you could prove it by inspection.

### **#2:** `simple_layers.generateNextGroupBySize`

I'm not 100% sure this counts as a different way of solving, but it is a completely different impl. Instead of putting everything in one giant list, normalize the arrays and group them by size. No there's a bunch of small lists, but otherwise its the same thing. as `generateNextSimple`.

### **#3:** `simple_flat.generateNextFlat`

Doing things in layers was a nice tutorial, but now it's time to get started. Break the problem down, solve each independently, recombine as necessary at the end.

(this name is awful "flat", but I picked it when I was looking forward; now it's out of date, and by the time I finish with it, it will be even more so - no wonder people give things codenames before finalizing)

# TODOs

\b((F)IXME|BUG|HACK|TODO|XXX|REVIEW|IDEA)\b
\b((F)IXME|BUG|HACK|TODO|XXX|REVIEW|IDEA)\b(\s+\([\w\d\-]+\))+
\b(BUG|HACK|TODO|XXX|REVIEW|IDEA)\b(\S|\s[^(])

- TODO (benchmark) Add progress reporting, elapsed-time estimates, and checkpoint/resume for long enumeration runs.
- TODO (optimize) Reduce memory use by streaming or aggregating candidates instead of retaining large intermediate collections.
- TODO (benchmark) Profile and optimize duplicate detection, especially rotation and canonicalization.
- TODO (validation) Add correctness checks for known counts, rotational equivalence, and shape invariants.
- TODO (benchmark) Add benchmarks to track runtime and memory by `n` and implementation.
- TODO (documentation) Improve the CLI with clear input validation, run status, and easier result inspection/comparison.
- TODO (documentation) Document the algorithms, including normalization, grouping, rotation-based deduplication, and when to use each implementation.
- TODO (optimize) Skip symmetric growth positions by grouping available sites into equivalence classes under each parent shape's rotational symmetries.
- TODO (optimize) Track each shape's empty face-neighbors incrementally instead of rescanning the full array to find growth locations.
- TODO (optimize) Evaluate alternate shape representations - compact bitset or coordinate-based shape encodings to reduce array-copying, rotation, serialization, and hashing costs.
- TODO (optimize) Define a canonical shape key from the smallest encoding among valid rotations and reuse it for deduplication.
- TODO (optimize) Process oversized size groups in sorted chunks and merge their deduplicated outputs to reduce peak memory use.
- TODO (optimize) Parallelize independent size groups, measuring worker coordination and serialization overhead against the speedup.

# References
- [Polycube - Wikipedia](https://en.wikipedia.org/wiki/Polycube)
- [This repository](https://github.com/mikepound/cubes/) nerd sniped me
- [Enumeration up to 16](http://kevingong.com/Polyominoes/Enumeration.html)
