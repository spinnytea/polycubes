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

# References
- [Polycube - Wikipedia](https://en.wikipedia.org/wiki/Polycube)
- [This repository](https://github.com/mikepound/cubes/) nerd sniped me
