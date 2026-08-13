# Media manifest

`media-manifest.json` is the machine-readable authority. This document is its
human-readable summary. All permission states are `pending-external`: repository
provenance is not proof of ownership, publication permission, trademark approval,
or a required person/customer release.

No deployed asset currently contains GPS metadata. The fallback
`img/storefront.jpg` still contains a capture date and a Picasa software tag; its
generated AVIF/WebP derivatives contain neither EXIF nor GPS. Generated files never
upscale a source and the generator refuses such a request.

| Path | Subject | Documented origin / owner | Original or derivative | Dimensions | EXIF / GPS | Alt text | Replacement need |
|---|---|---|---|---:|---|---|---|
| `apple-touch-icon.png` | Studio-logo touch icon | Derived from `img/logo.png`; rights holder not recorded | Derivative | 179×180 | removed / removed | n/a | Regenerate at 180×180 from approved master |
| `favicon.ico` | Studio-logo browser icon | Derived from `img/logo.png`; rights holder not recorded | Derivative | 16–64 px embedded | removed / removed | n/a | Regenerate all sizes from approved master |
| `favicon.svg` | Stylized skull browser icon | Created in repository history; brand approval not recorded | Original vector | 44×44 viewBox | n/a / n/a | n/a | Confirm brand approval |
| `img/logo.png` | Studio logo | Google Business photo crop per README; photographer/trademark owner not recorded | Derivative | 448×450 | removed / removed | Decorative beside visible studio name | Obtain approved vector/high-resolution master |
| `img/phil.jpg` | Phil tattooing | Derivative from existing local original per README; photographer/person release not recorded | Derivative | 560×817 | removed / removed | Phil beim Tätowieren im Studio Die Hautmaler | Document ownership and person release |
| `img/storefront.jpg` | Studio entrance | Google Business photo per README; photographer/source URL not recorded | Derivative | 680×382 | capture date + Picasa remain / removed | Eingang des Studios Die Hautmaler, Ottostraße 86a, Ottobrunn | Obtain approved original and replace fallback |
| `img/work-dagger-panther.jpg` | Dagger and panther tattoo | Derivative from existing local original per README; photographer/customer release not recorded | Derivative | 640×1479 | removed / removed | Dolch mit Panthermotiv, Unterschenkel, Color Realism | Document ownership and customer release |
| `img/work-om.jpg` | Om-symbol tattoo | Derivative from existing local original per README; photographer/customer release not recorded | Derivative | 640×725 | removed / removed | Om-Symbol, Knöchel, Calligraphy | Document ownership and customer release |
| `img/work-leopard.jpg` | Leopard tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 308×411 | removed / removed | Realistisches Leopardenmotiv, Unterarm, Color Realism | High: approved original; never upscale |
| `img/work-portrait.jpg` | Portrait and roses tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 304×373 | removed / removed | Portrait-Tattoo mit Rosen, Oberarm | High: approved original; never upscale |
| `img/work-scorpion.jpg` | Scorpion tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 304×411 | removed / removed | Skorpion mit Schriftzug und Datum, Brust | High: approved original; never upscale |
| `img/work-wolf-eagle.jpg` | Wolf and eagle tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 304×378 | removed / removed | Wolf- und Adlermotiv mit Schriftzug, Oberarm-Sleeve | High: approved original; never upscale |
| `img/work-eye.jpg` | Eye and clock tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 312×411 | removed / removed | Auge mit Uhr-Motiv, Unterarm, Realistic | High: approved original; never upscale |
| `img/work-forearm.jpg` | Double portrait tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 308×373 | removed / removed | Doppelportrait, Unterarm, Realistic | High: approved original; never upscale |
| `img/work-floral.jpg` | Floral-vine tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 312×373 | removed / removed | Blumenranke, Unterarm, Fine Line | High: approved original; never upscale |
| `img/work-wolf-blackwork.jpg` | Blackwork wolf tattoo | Low-resolution public Instagram screen crop; photographer/customer release not recorded | Derivative | 308×378 | removed / removed | Wolfskopf, Oberarm, Blackwork | High: approved original; never upscale |

## Responsive derivatives

The reproducible generator creates AVIF and WebP alongside the compatible PNG/JPEG
fallbacks. Every output is represented in `media-manifest.json`.

| Source | Generated widths | Formats | Notes |
|---|---:|---|---|
| `img/logo.png` | 96, 224, 448 | AVIF, WebP | Small header/footer variants avoid downloading the 259 kB fallback where supported. |
| `img/phil.jpg` | 280, 560 | AVIF, WebP | Covers the current displayed size through DPR 2. |
| `img/storefront.jpg` | 340, 680 | AVIF, WebP | No upscaling; an approved larger original is still needed for wide high-density screens. |
| `img/work-dagger-panther.jpg` | 320, 640 | AVIF, WebP | No upscaling. |
| `img/work-om.jpg` | 320, 640 | AVIF, WebP | No upscaling. |

The eight 304–312 px social crops intentionally have no generated responsive
variants. Creating larger files would only disguise upscaling and would not solve
their rights or source-quality problem.
