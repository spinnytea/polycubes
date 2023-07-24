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

## `minor`

### **#1:** `simple_layers.generateNextSimple`

Original implementation, possibly the "example" implementation. This is was meant to be so simple you could prove it by inspection.

### **#2:** `simple_layers.generateNextGroupBySize`

I'm not 100% sure this counts as a different way of solving, but it is a completely different impl. Instead of putting everything in one giant list, normalize the arrays and group them by size. No there's a bunch of small lists, but otherwise its the same thing. as `generateNextSimple`.

# References
- [Polycube - Wikipedia](https://en.wikipedia.org/wiki/Polycube)
- [This repository](https://github.com/mikepound/cubes/) nerd sniped me
