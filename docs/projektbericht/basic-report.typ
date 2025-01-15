
#import "@preview/hydra:0.5.1": hydra
#import "titlepage.typ": *

#let basic-report(
  doc-category: none,
  doc-title: none,
  author: none,
  abstract: none,
  affiliation: none,
  logo: none,
  language: "de",
  body,
) = {
  set document(title: doc-title, author: author)
  set text(lang: language)

  counter(page).update(0) // so TOC after titlepage begins with page no 1 (roman)

  let body-font = "Liberation Sans"
  let body-size = 11pt
  let heading-font = "Liberation Sans"
  let info-size = 10pt // heading font is used in this size for kind of "information blocks"
  let label-size = 9pt // heading font is used in this size for different sorts of labels
  let in-outline = state("in-outline", true) // are we inside or outside of the outline (for roman/arabic page numbers)?

  titlepage(
    doc-category,
    doc-title,
    author,
    abstract,
    affiliation,
    logo,
    heading-font,
    info-size,
  )

  set text(
    font: body-font,
    size: body-size,
    fill: luma(50),
  )

  set par(
    justify: true,
    leading: 0.65em,
    spacing: 1.65em,
    first-line-indent: 0em,
  )

  set page(
    paper: "a4",
    // horizontal 1.5cm-grid = 14u: 3u left margin, 9u text, 2u right margin
    //     Idea: one-sided document; if printed on paper, the pages are often bound or stapled
    //     on the left side; so more space needed on the left. On-screen it doesn't matter.
    // vertical 1.5cm-grid ≈ 20u: 2u top margin, 14u text, 2u botttom margin
    //     header with height ≈ 0.6cm is visually part of text block --> top margin = 3cm + 0.6cm
    margin: (top: 3.6cm, left: 4.5cm, right: 3cm, bottom: 3cm),
    // the header shows the main chapter heading  on the left and the page number on the right
    header: grid(
      columns: (1fr, 1fr),
      align: (left, right),
      row-gutter: 0.5em,
      text(font: heading-font, size: label-size, context { hydra(1, use-last: true, skip-starting: false) }),
      text(
        font: heading-font,
        size: label-size,
        number-type: "lining",
        context {
          if in-outline.get() {
            counter(page).display("i") // roman page numbers for the TOC
          } else {
            counter(page).display("1") // arabic page numbers for the rest of the document
          }
        },
      ),
      grid.cell(colspan: 2, line(length: 100%, stroke: 0.5pt)),
    ),
    header-ascent: 1.5em,
  )

  set heading(numbering: "1.")
  show heading: it => {
    set text(font: heading-font, fill: blue, weight: "regular")
    block(
      it,
      height: 1 * body-size,
      above: 2 * body-size,
      below: 1 * body-size,
      sticky: true,
    )
  }

  set figure(numbering: "1")
  show figure.caption: it => {
    set text(font: heading-font, size: label-size)
    block(it)
  }

  // to detect, if inside or outside the outline (for different page numbers)
  show outline: it => {
    in-outline.update(true)
    it
    in-outline.update(false)
  }

  // top-level TOC entries in bold without filling
  show outline.entry.where(level: 1): it => {
    v(2 * body-size, weak: true)
    set text(font: heading-font, weight: "bold", size: info-size)
    show repeat: none
    it
  }

  outline(
    title: "Inhalt",
    indent: auto,
  )

  counter(page).update(0) // so the first chapter starts at page 1 (now in arabic numbers)
  pagebreak()

  body
}
