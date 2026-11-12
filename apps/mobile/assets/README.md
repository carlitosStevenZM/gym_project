# assets

Everything the app ships that is not code. All of it is under 230 KB, and the commands that
produced each file are here so the next person can reproduce them instead of guessing.

```
assets/
├── brand/          the mark, as vector source. Not loaded at runtime
├── fonts/          the display face, subset to Latin
└── images/         the launcher icons, and one filler photograph
```

## Rules

1. **Vector where it is a shape, raster where it is a photograph.** Icons in the interface are
   drawn with `react-native-svg` under `src/shared/ui/icons/`, not shipped as files.
2. **A raster asset ships in the format that is smallest at the same quality**: WebP for
   photographs, quantised PNG-8 for the flat-colour launcher icons. No JPEG, no full-depth PNG.
3. **Never upscale.** An asset is produced at the largest size it is actually drawn at, times
   three for the densest screen, and no larger.
4. **Every asset here is referenced from code or from `app.json`.** An unreferenced file is
   deleted, not kept "just in case" — Metro bundles what is imported, the repo keeps what is used.

## fonts/

`BarlowCondensed-Black.ttf` (900) and `BarlowCondensed-ExtraBold.ttf` (800), the two weights the
type scale uses. Body text takes the system font and ships no file (**D48**).

Both come from [google/fonts](https://github.com/google/fonts/tree/main/ofl/barlowcondensed),
SIL Open Font License 1.1, whose text is in `OFL.txt` beside them. They are subset to Latin, which
takes each from 110 KB to 50 KB and keeps 215 glyphs — the whole Spanish set, the punctuation the
interface uses and the `tnum` feature, which is what stops a weight from jittering as it steps.

```sh
pyftsubset BarlowCondensed-Black.ttf \
  --output-file=BarlowCondensed-Black.ttf \
  --unicodes='U+0000-00FF,U+2010-2027,U+2030-205E,U+20AC,U+2122,U+2212' \
  --layout-features='kern,liga,calt,tnum,lnum,frac,ccmp,locl,mark,mkmk' \
  --name-IDs='*' --drop-tables+=DSIG
```

They are loaded at runtime by `useFonts` in `src/app/_layout.tsx`, with the splash held until they
are in. Moving them to the `expo-font` config plugin, which embeds them at build time and removes
the wait entirely, is the right change the day this app leaves Expo Go.

## brand/

The mark is a loaded barbell seen head on: two plates and the bar. It works at 16 px and at
1024 px, and it is **not** used anywhere inside the interface — the design system has no brand
iconography on screen. These two files exist to generate the launcher icons.

| File | Where |
|---|---|
| `mark-tile.svg` | On an accent tile. The launcher icon |
| `mark-plain.svg` | No tile, ink plates and an accent bar. Over a dark background or a photograph |

Do not rotate it, stretch it, shadow it, enclose it in another shape or recolour it outside these
two pairs.

## images/

| File | What | Produced by |
|---|---|---|
| `icon.png` | 1024², full bleed. iOS and the universal icon; the OS applies its own mask | `mark-tile.svg` without the rounded corners |
| `android-icon-foreground.png` | 1024², transparent, the mark at 0.8 scale so it stays inside the adaptive icon's 66 % safe zone | `mark-tile.svg` without the tile |
| `android-icon-monochrome.png` | 1024², white on transparent, for Android's themed icons | the same geometry |
| `splash-icon.png` | 512², the plain mark over the splash's `bg` | `mark-plain.svg` |
| `favicon.png` | 48², web only | `mark-tile.svg` |
| `hero-sample.webp` | 1100 × 733, the Hoy window's photograph | see below |
| `auth-sample.webp` | 900 × 1000, the backdrop behind Login and Signup | see below |

The five icons are flat two-colour images, so they are quantised to a 64-entry palette and written
as PNG-8. That is what takes `icon.png` from 47 KB to 5 KB with a measured RMSE of 0.08 %.

```sh
magick -background none -density 600 mark-tile.svg -resize 1024x1024 icon.png
magick icon.png -strip -colors 64 -define png:compression-level=9 PNG8:icon.png
```

### hero-sample.webp is filler

It comes from Unsplash by way of the design system, and it is there to judge the composition, not
to publish. The real bank — ten to fifteen licensed or produced gym-atmosphere frames, dark and
low-contrast in the lower third, no faces, nothing that fights the orange — is the only recurring
cost of the system and has not been decided.

WebP at quality 75 is 107 KB against the source's 192 KB, at an RMSE of 1.7 % that nobody will see
on a dark photograph behind a gradient.

```sh
magick hero.jpg -strip -quality 75 -define webp:method=6 hero-sample.webp
```

If the photography never arrives the system still stands: `HeroWindow` without a `source` is a
`surface` block carrying the same title and the same disc.

### auth-sample.webp is filler too

Same bank, same problem, same reason it is here: to judge the composition. It is a portrait crop
because it backs a full-width screen rather than a 212 px window, and it was chosen against the
same three rules — dark, no faces, nothing that fights the orange. The orange wrist wrap in it is
close enough to `accent` to read as the system's colour rather than against it, which is luck, not
a requirement.

WebP at quality 72 is 82 KB against the source's 203 KB, at an RMSE of 1.7 %.

```sh
curl -o auth.jpg 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&h=1000&fit=crop&crop=entropy&q=85&fm=jpg'
magick auth.jpg -strip -quality 72 -define webp:method=6 auth-sample.webp
```

The gradient over it is not decoration: it is the one gradient the system allows, the guarantee
that the title reads over an arbitrary photograph.
