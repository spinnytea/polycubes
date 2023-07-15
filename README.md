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


# References
- [Polycube - Wikipedia](https://en.wikipedia.org/wiki/Polycube)
- [This repository](https://github.com/mikepound/cubes/) nerd sniped me
