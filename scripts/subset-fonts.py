"""
Builds the self-hosted, Latin-only font files used by the site.

  python scripts/subset-fonts.py

Requires: pip install fonttools brotli

Sources are the variable fonts from github.com/google/fonts (SIL Open Font
License). They are cached in .cache/fonts and never committed.

Output:
  src/assets/fonts/cormorant-garamond-300.woff2         (headings, wordmark)
  src/assets/fonts/cormorant-garamond-400.woff2         (headings, prices)
  src/assets/fonts/cormorant-garamond-300-italic.woff2  (one or two accent words)
  src/assets/fonts/jost-300.woff2                       (body text)
  src/assets/fonts/jost-400.woff2                       (body text, labels, buttons, nav)
  src/assets/og/cormorant-og.ttf                        (static instance for OG images)
  src/assets/og/jost-og.ttf                             (static instance for OG images)
"""

from pathlib import Path
from urllib.request import urlretrieve

from fontTools.subset import Options, Subsetter
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".cache" / "fonts"
FONTS_OUT = ROOT / "src" / "assets" / "fonts"
OG_OUT = ROOT / "src" / "assets" / "og"

SOURCES = {
    "cormorant": "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "cormorant-italic": "https://github.com/google/fonts/raw/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf",
    "jost": "https://github.com/google/fonts/raw/main/ofl/jost/Jost%5Bwght%5D.ttf",
}

# Google Fonts "latin" subset, plus a few typographic extras we use
# (en/em dashes, curly quotes, ellipsis, middle dot, arrows, minus).
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,"
    "U+2000-206F,U+2074,U+20AC,U+2122,U+2190-2193,U+2212,U+2215,U+FEFF,U+FFFD"
)


def unicodes(spec: str) -> list[int]:
    out: list[int] = []
    for part in spec.split(","):
        part = part.replace("U+", "")
        if "-" in part:
            a, b = part.split("-")
            out.extend(range(int(a, 16), int(b, 16) + 1))
        else:
            out.append(int(part, 16))
    return out


def source(name: str) -> TTFont:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / f"{name}.ttf"
    if not path.exists():
        print(f"downloading {name}")
        urlretrieve(SOURCES[name], path)
    return TTFont(path)


def subset(font: TTFont, flavor: str | None) -> TTFont:
    opts = Options()
    # Only the OpenType features the site uses: kerning, ligatures and the
    # tabular/lining figures for prices. Everything else is dead weight.
    opts.layout_features = ["kern", "liga", "tnum", "lnum"]
    opts.flavor = flavor
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.drop_tables += ["STAT"] if flavor is None else []
    sub = Subsetter(options=opts)
    sub.populate(unicodes=unicodes(LATIN))
    sub.subset(font)
    if flavor:
        font.flavor = flavor
    return font


def save(font: TTFont, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    font.save(path)
    print(f"{path.relative_to(ROOT)}  {path.stat().st_size / 1024:.1f} KB")


def static(name: str, weight: int) -> TTFont:
    return instantiateVariableFont(source(name), {"wght": weight})


def main() -> None:
    # Static cuts rather than one variable file: each page only needs the
    # weights it shows, and only the above-the-fold ones are preloaded.
    save(subset(static("cormorant", 300), "woff2"), FONTS_OUT / "cormorant-garamond-300.woff2")
    save(subset(static("cormorant", 400), "woff2"), FONTS_OUT / "cormorant-garamond-400.woff2")
    save(subset(static("cormorant-italic", 300), "woff2"), FONTS_OUT / "cormorant-garamond-300-italic.woff2")
    save(subset(static("jost", 300), "woff2"), FONTS_OUT / "jost-300.woff2")
    save(subset(static("jost", 400), "woff2"), FONTS_OUT / "jost-400.woff2")

    # Static instances for build-time OG images (satori needs TTF/OTF).
    save(subset(static("cormorant", 300), None), OG_OUT / "cormorant-og.ttf")
    save(subset(static("jost", 400), None), OG_OUT / "jost-og.ttf")


if __name__ == "__main__":
    main()
