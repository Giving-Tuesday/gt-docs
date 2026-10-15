---
notion_page_id: 3b417e53b9778091bb4cfbac7ec349ca
---

# Using the Embed App

## What the embed app is

The embed app is a **drop-in runtime** (`gt-embed.js`) that renders GivingTuesday data visualizations directly on any web page — a CMS article, a report page, a static HTML file — with **no React, build step, or npm install required on the host page**.

You add one `script` tag and then mark up each visualization as a plain `<section data-embed>` element, passing all configuration through `data-*` attributes. When the page loads, the runtime finds every `<section data-embed>`, reads its attributes, and renders the matching component in place.

This page covers the two components you embed this way:

- **`EChart`** — a charting component (line, bar, horizontal bar, scatter, and small multiples).
- **`MetricsBarWithSegments`** — a segmented gradient bar with a row of metric cards.

> This page is about **embedding** components on a page. It is not about consuming the package as a React library.

---

## Jump to

<table_of_contents/>

---

## Getting started

Add the runtime once, anywhere on the page (the `defer` attribute lets the page render first):

```html
script defer src="https://cdn.jsdelivr.net/npm/gt-embed@1.1.1/gt-embed.js"
```

### The runtime is versioned

The runtime (`gt-embed.js`) is published as an npm package, `gt-embed`, and served from the [jsDelivr](https://www.jsdelivr.com/) CDN. The version you load is set by the number in the URL:

```
https://cdn.jsdelivr.net/npm/gt-embed@<version>/gt-embed.js
                                      ^^^^^^^^^
```

Replace `<version>` with the version you want — for example `1.1.1` in the snippet above.

**Always pin to a specific version** by putting the actual version number in the URL. Pinning guarantees the embed keeps rendering exactly as it does today: because the version is fixed, later updates to `gt-embed` can never change or break a page that is already live. When you want to adopt a newer release, bump the number in the URL yourself and re-test.

Then add one `<section data-embed>` per visualization. `data-type` selects which component to render; every other attribute configures it:

```html
<section
  data-embed
  data-uid="monthly-donations"
  data-type="EChart"
  data-title="Monthly donations"
  data-option='{"xAxis":{"type":"category","data":["Jan","Feb","Mar"]},"yAxis":{"type":"value"},"series":[{"type":"line","name":"Donations","data":[12,19,7]}]}'
></section>
```

You can place as many `<section data-embed>` elements on a page as you like — each is rendered independently.

## How data attributes work

Configuration is passed entirely through `data-*` attributes on the `<section>`.

**`data-uid` is required, and must be unique on the page.** It names the embed: it becomes the id of the rendered element and the handle you pass to [`window.htmlToImage`](#capturing-a-chart-from-javascript). Give two embeds the same uid and they clash — the second overwrites the first's registration, and whichever unmounts first takes the other's download with it. Any short slug works (`donations-bar`, `fig-3`).

A few rules govern how the remaining attribute strings become component props:

- **Kebab-case → camelCase.** The browser maps attribute names to camelCase prop names automatically: `data-sub-title` → `subTitle`, `data-show-bar` → `showBar`, `data-watermark-logo` → `watermarkLogo`.
- **JSON values.** Any value that starts with `{` or `[` is parsed with `JSON.parse`. Use this for objects and arrays (`data-option='{"colors":["#2EA8DF","#9891B6"]}'`). The JSON must be valid: **double-quoted keys and strings, no trailing commas.**
- **Booleans.** The exact strings `"true"` and `"false"` are converted to real booleans.
- **Everything else stays a string.** A plain value like `data-title="Donations"` stays a string. Note that a bare numeric string is **not** converted to a number — so props that expect a number should be given a JSON number when passed on their own (`maxWidth`/`height` are the exception — they also accept `"1080"` or `"1080px"`), and numbers nested inside a JSON object/array (like values inside `data-option`) parse correctly because the whole attribute is JSON.
- **Empty values are ignored.** An attribute set to `""` is skipped.

---

## EChart

Renders an [ECharts](https://echarts.apache.org/) chart. There is **no separate `LineChart` or `BarChart`** — you always use `data-type="EChart"` and choose the chart kind inside the `data-option` object via each series' `type` (`line`, `bar`, or `scatter`).

### Props

All props are set via `data-*` attributes on the `<section>`.

| Prop            | Attribute             | Type                         | Default      | Description                                                                                                                                       |
| --------------- | --------------------- | ---------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `uid`           | `data-uid`            | string                       | **Required** | Unique id for this embed on the page. See [How data attributes work](#how-data-attributes-work).                                                  |
| `option`        | `data-option`         | ECharts option (JSON object) | `{}`         | The chart spec: `series`, `xAxis`, `yAxis`, `tooltip`, `legend`, `grid`, etc. Deep-merged over sensible defaults, so your values win.             |
| `title`         | `data-title`          | string                       | —            | Heading shown above the chart.                                                                                                                    |
| `subTitle`      | `data-sub-title`      | string                       | —            | Subheading below the title.                                                                                                                       |
| `description`   | `data-description`    | string                       | —            | Description below the subtitle.                                                                                                                   |
| `theme`         | `data-theme`          | string                       | `gt-light`   | Theme name — sets the chart's colors *and* the fonts of the title, subtitle and description.                                                      |
| `maxWidth`      | `data-max-width`      | number \| string             | `640`        | Max render width in pixels. A bare string (`"1080"`) or a `px` string (`"1080px"`) works as well as a JSON number.                                |
| `height`        | `data-height`         | number \| string             | `320`        | Chart height in pixels. Same string handling as `maxWidth`.                                                                                       |
| `tooltipSpec`   | `data-tooltip-spec`   | JSON object                  | —            | Formats the tooltip values: `round` (decimal places), `prefix`, `suffix`, `thousands_separator` (boolean). Omit to keep ECharts' default tooltip. |
| `showDownload`  | `data-show-download`  | boolean                      | `true`       | Show the "Download" (PNG) button.                                                                                                                 |
| `showWatermark` | `data-show-watermark` | boolean                      | `true`       | Add a logo watermark to the downloaded PNG.                                                                                                       |
| `watermarkLogo` | `data-watermark-logo` | `"GTDCLogo"` \| `"FEPLogo"`  | `"GTDCLogo"` | Which logo the watermark uses.                                                                                                                    |
| `autoCols`      | `data-auto-cols`      | boolean                      | —            | Small-multiples layout: `true` renders one panel per series, side by side and stacked on mobile.                                                  |
| `className`     | `data-class-name`     | string                       | —            | Extra CSS class on the chart element.                                                                                                             |
| `style`         | `data-style`          | CSS object (JSON)            | —            | Inline styles merged onto the chart element.                                                                                                      |

> **Tooltip.** `tooltipSpec` is a shorthand: it builds a `formatter` for you, including the error-bar bounds. Anything ECharts supports can still be set directly under `option.tooltip` — those keys merge in alongside, so restyling the tooltip keeps the `tooltipSpec` formatting. Supplying your own `option.tooltip.formatter` replaces it entirely.

```json
{ "tooltip": { "formatter": "{b}: {c}%" } } // a suffix, set directly on `option.tooltip`
```

### `data-theme` values

The default is `gt-light`. Available themes:

- **Base:** `gt-light`, `fep-light`
- **Single-color (GivingTuesday):** `gt-navy`, `gt-red`, `gt-cyan`, `gt-lavender`, `gt-blue`, `gt-pink`, `gt-teal`, `gt-purple`
- **Single-color (FEP):** `fep-navy`, `fep-blue`, `fep-green`, `fep-red`, `fep-orange`, `fep-teal`, `fep-magenta`

> A single-color theme automatically expands to its full palette when a chart has multiple series sharing one panel, so the series stay visually distinct.

> **The theme also sets the fonts.** The family — the part of the name before the first `-` — picks the typeface used for the title, subtitle and description: `gt-*` renders in Montserrat with a Georgia body, `fep-*` in Open Sans throughout. Both are bundled in the runtime, so there is nothing to load on the host page.

### Building the `option`

Series and axis labels all live inside `data-option`:

- **Chart kind** is the series `type`: `"line"`, `"bar"`, or `"scatter"`.
- **Category labels** go in `xAxis.data` (vertical bar / line) or `yAxis.data` (horizontal bar).
- **Axis titles** go in `xAxis.name` / `yAxis.name`.
- **Series values** go in each series' `data` array (numbers for line/bar; `[x, y]` pairs for scatter). `null` is allowed in line data — lines connect across nulls by default.

### Examples

**Line chart** — multiple series, with one series overriding color and connecting across nulls:

```html
<section
  data-embed
  data-uid="dollars-yoy"
  data-type="EChart"
  data-title="Dollars YoY % change by year"
  data-sub-title="Change in dollars each year"
  data-tooltip-spec='{"suffix":"%","round":1}'
  data-theme="gt-light"
  data-option='{"xAxis":{"type":"category","data":["Jan","Feb","Mar","Apr","May","Jun"],"name":"Month"},"yAxis":{"type":"value","name":"Dollars % YoY Change"},"series":[{"type":"line","name":"2024","data":[0.54,4.67,6.14,9.0,6.67,2.91]},{"type":"line","name":"2025","data":[1.25,1.46,null,0.64,-1.72,null],"connectNulls":true}]}'
  data-max-width="1080"
  data-height="600"
></section>
```

**Vertical bar chart:**

```html
<section
  data-embed
  data-uid="grants-and-donations"
  data-type="EChart"
  data-title="Grants and donations"
  data-sub-title="Grants compared to donations each month"
  data-theme="fep-blue"
  data-option='{"series":[{"type":"bar","name":"Donations","data":[12,19,7,15,9,14]},{"type":"bar","name":"Grants","data":[5,8,11,6,10,7]}],"xAxis":{"type":"category","data":["Jan","Feb","Mar","Apr","May","Jun"],"name":"Month"},"yAxis":{"type":"value","name":"Count"}}'
></section>
```

**Horizontal bar chart** — swap the axis types so the category axis is the y-axis:

```html
<section
  data-embed
  data-uid="donations-by-sector"
  data-type="EChart"
  data-title="Donations by sector"
  data-sub-title="Total donations raised by cause area this year"
  data-theme="fep-light"
  data-option='{"series":[{"type":"bar","name":"Donations","data":[820,932,901,934,1290,1330]}],"xAxis":{"type":"value","name":"Total ($K)"},"yAxis":{"type":"category","data":["Animals","Arts","Environment","Education","Human Services","Health"],"name":"Sector"}}'
></section>
```

**Scatter chart** — both axes are value axes; data is `[x, y]` pairs:

```html
<section
  data-embed
  data-uid="gift-size-vs-retention"
  data-type="EChart"
  data-title="Gift size vs. retention"
  data-sub-title="Average gift size against donor retention rate by cohort"
  data-theme="fep-light"
  data-option='{"series":[{"type":"scatter","name":"Donor cohorts","data":[[10,8.04],[8,6.95],[13,7.58],[9,8.81],[11,8.33],[14,9.96]]}],"tooltip":{"trigger":"item"},"xAxis":{"type":"value","name":"Avg gift ($)"},"yAxis":{"type":"value","name":"Retention (%)"}}'
></section>
```

**Small multiples** — one panel per series, with `data-auto-cols` generating the layout automatically (no `grid`/`gridIndex`/`xAxisIndex`/`yAxisIndex` wiring needed):

```html
<section
  data-embed
  data-uid="donor-mix-by-sector"
  data-type="EChart"
  data-title="Donor mix by sector"
  data-sub-title="Share of donors, share of dollars, and YoY change by cause area"
  data-theme="fep-green"
  data-watermark-logo="FEPLogo"
  data-auto-cols="true"
  data-option='{"xAxis":[{"type":"value","name":"% of donors","nameLocation":"middle","nameGap":30},{"type":"value","name":"% of dollars","nameLocation":"middle","nameGap":30},{"type":"value","name":"YoY % change","nameLocation":"middle","nameGap":30}],"yAxis":[{"type":"category","data":["Animals","Arts","Environment","Education","Human Services","Health"],"inverse":true},{"type":"category","data":["Animals","Arts","Environment","Education","Human Services","Health"],"inverse":true},{"type":"category","data":["Animals","Arts","Environment","Education","Human Services","Health"],"inverse":true}],"series":[{"type":"bar","name":"% of donors","data":[12,8,5,22,34,19]},{"type":"bar","name":"% of dollars","data":[9,6,3,18,28,36]},{"type":"bar","name":"YoY % change","data":[-4,6,12,3,-2,8]}]}'
></section>
```

Hovering (or tapping) a panel shows one tooltip for the whole grid: the hovered category as its heading, then one row per panel with that panel's value, the hovered panel's row in bold. Panels are matched by category **name**, so their axes may list categories in a different order; a panel without the category shows `-`. The tooltip may extend over the neighbouring panels.

- `tooltipSpec` formats every row's value.
- A string `option.tooltip.formatter` is applied to each row on its own, so `"{b}: {c}%"` shows `Animals: 12%` beside each panel's name.
- A `formatter` function, a scatter chart (`"trigger": "item"`), or panels without a category axis keep one tooltip per panel instead, shown for the hovered panel only.

### Error bars

A bar chart can carry error bars, drawn from a second series with `type: "custom"` sitting alongside the bar series they annotate. Each of its data points is `[categoryIndex, min, max]` — the position of the category on the x-axis (`0` is the first), then the low and high bounds of the whisker. The embed app draws the whisker itself, so there is nothing else to configure.

- The error-bar series takes no color from the theme's palette and no legend entry, so the bars it sits over keep their own colors.
- The bounds appear in the tooltip on the annotated series' own row, in parentheses after its value (`Grants: 11 (9 – 14)`). Any `tooltipSpec` formatting applies to the bounds as well as the value, so a `prefix` of `$` gives `$11 ($9 – $14)`.
- Error bars annotate **exactly one** other series. A chart pairing them with two or more series renders an error notice instead, since there is no way to say which series the bars belong to.

```html
<section
  data-embed
  data-uid="grants-expected-range"
  data-type="EChart"
  data-title="Grants with expected range"
  data-sub-title="Monthly grants against their expected minimum and maximum"
  data-theme="fep-blue"
  data-option='{"series":[{"type":"bar","name":"Grants","data":[5,8,11,6,10,7]},{"type":"custom","name":"Error Margin","data":[[0,4,6],[1,7,10],[2,9,14],[3,4,8],[4,8,11],[5,3,7.5]]}],"xAxis":{"type":"category","data":["Jan","Feb","Mar","Apr","May","Jun"],"name":"Month"},"yAxis":{"type":"value","name":"Count"}}'
></section>
```

### Download

Every chart renders a **Download** button that exports the chart — including its title and subtitle — as a PNG, optionally with a logo watermark (`showWatermark` / `watermarkLogo`).

---

## MetricsBarWithSegments

Renders a horizontal gradient bar split into segments, plus a row of metric cards below it (each with an icon, labels, and a headline percentage change). Use `data-type="MetricsBarWithSegments"`.

Like `EChart`, this component takes a single `data-option` object that holds the metric data and the bar layout; a handful of presentation props (title, theme, download) are separate top-level attributes.

### Props

Top-level attributes on the `<section>`:

| Prop            | Attribute             | Type                        | Default      | Description                                                      |
| --------------- | --------------------- | --------------------------- | ------------ | ---------------------------------------------------------------- |
| `uid`           | `data-uid`            | string                      | **Required** | Unique id for this embed on the page.                            |
| `option`        | `data-option`         | JSON object                 | **Required** | Metric data and bar layout (see fields below).                   |
| `title`         | `data-title`          | string                      | —            | Heading above the visualization.                                 |
| `subTitle`      | `data-sub-title`      | string                      | —            | Subheading below the title.                                      |
| `description`   | `data-description`    | string                      | —            | Description below the subtitle.                                  |
| `theme`         | `data-theme`          | string                      | `gt-light`   | Seeds the gradient when `colors` is omitted; sets the fonts too. |
| `showDownload`  | `data-show-download`  | boolean                     | `true`       | Show the "Download" (PNG) button.                                |
| `showWatermark` | `data-show-watermark` | boolean                     | `true`       | Add a logo watermark to the downloaded PNG.                      |
| `watermarkLogo` | `data-watermark-logo` | `"GTDCLogo"` \| `"FEPLogo"` | `"GTDCLogo"` | Which logo the watermark uses.                                   |

Fields inside `data-option`:

| Field             | Type              | Default      | Description                                                                                   |
| ----------------- | ----------------- | ------------ | --------------------------------------------------------------------------------------------- |
| `series`          | `Metric[]` (JSON) | **Required** | Array of metric objects (see below). One card + bar segment per entry.                        |
| `colors`          | `string[]` (JSON) | from `theme` | Two-color gradient `[startHex, endHex]`, interpolated across the segments. Overrides `theme`. |
| `barHeight`       | number            | `32`         | Height of the segmented bar, in pixels.                                                       |
| `connectorHeight` | number            | `75`         | Height of the connector lines between the bar and the cards, in pixels.                       |
| `showBar`         | boolean           | `true`       | Show the gradient bar. Set `false` to show only the cards.                                    |

> **Gradient colors.** Supply your own two endpoints via `colors` inside `data-option`, or omit it and the gradient is seeded from the `theme` palette (the default `gt-light` gives the GivingTuesday brand colors). The two endpoints are interpolated across however many segments the data produces.

> Width is derived automatically from the number of metrics (up to 3 → 640px, 4 → 830px, 5+ → 1080px), so there is no `maxWidth` prop here.

### The `Metric` type

Each object in `option.series` can have these fields (all optional; a card omits any field you leave out):

| Field          | Type   | Description                                                               |
| -------------- | ------ | ------------------------------------------------------------------------- |
| `label`        | string | Bold card title (e.g. `"1 DONATION"`).                                    |
| `subLabel`     | string | Secondary caption under the label.                                        |
| `icon`         | string | A built-in icon name **or** an `http(s)` image URL (see [Icons](#icons)). |
| `currentValue` | number | Rendered as `"{value} %"` on the card.                                    |
| `currentLabel` | string | Caption under `currentValue` (e.g. `"of total donors"`).                  |
| `changeValue`  | number | Rendered prominently with `changeSuffix` appended (e.g. YOY change).      |
| `changeSuffix` | string | Unit appended to `changeValue`. Defaults to `"%"`; use e.g. `"p.p."`.     |
| `changeLabel`  | string | Caption under `changeValue` (e.g. `"YOY Change"`).                        |

> **Total of current values.** The cumulative total must add up to 100 or less for the segmented bar to display. If the total of `currentValue` values adds up to a number greater than 100 the segmented bar will not be rendered.

### Example

Mixing built-in icon names with image-URL icons. The metric array lives inside `data-option` at `series`; `colors` (optional) sits alongside it, while `title`, `sub-title`, `theme`, and `watermark-logo` stay top-level:

```html
<section
  data-embed
  data-uid="donations-bar"
  data-type="MetricsBarWithSegments"
  data-title="Donations"
  data-sub-title="Total donations and YoY change this quarter"
  data-theme="fep-light"
  data-watermark-logo="FEPLogo"
  data-option='{
    "colors": ["#2EA8DF", "#9891B6"],
    "showBar": true,
    "series": [
      {
        "icon": "OneDonation",
        "label": "1 DONATION",
        "currentValue": 68.5,
        "currentLabel": "of total donors",
        "changeValue": -7.6,
        "changeLabel": "YOY Change"
      },
      {
        "icon": "TwoDonations",
        "label": "2 DONATIONS",
        "currentValue": 11.8,
        "currentLabel": "of total donors",
        "changeValue": -9.1,
        "changeLabel": "YOY Change"
      },
      {
        "icon": "https://publications.fepreports.org/images/3_6_donations_blue.png",
        "label": "3-6 DONATIONS",
        "currentValue": 8.6,
        "currentLabel": "of total donors",
        "changeValue": -5.3,
        "changeLabel": "YOY Change"
      },
      {
        "icon": "https://publications.fepreports.org/images/7_donations_blue.png",
        "label": "7+ DONATIONS",
        "currentValue": 11.0,
        "currentLabel": "of total donors",
        "changeValue": -6.5,
        "changeLabel": "YOY Change"
      }
    ]
  }'
></section>
```

---

## Icons

Icons are set per-metric through the `icon` field of each object in `MetricsBarWithSegments`' `option.series` array — not a top-level component prop. The `icon` string is resolved in this order:

1. **Lucide icon name** — one of: `HelpingHand`, `HeartHandshake`, `HeartHand`, `Repeat`.
2. **GivingTuesday custom icon name** — one of: `Dollars`, `GivingTuesdayHeart`, `Retention`, `NewRetained`, `RepeatRetained`, `Recaptured`, `Donations`, `OneDonation`, `TwoDonations`, `ThreeDonations`, `FourDonations`, `Donor`, `DonorMicro`, `DonorSmall`, `DonorMidsize`, `DonorMajor`, `DonorSupersize`, `DonorRetention`, `NewDonor`, `Org`, `OrgCauseImpact`, `OrgHeart`, `OrgX`.
3. **Image URL** — any string starting with `http` is rendered as an `<img>`.
4. **Fallback** — if the string matches none of the above, the Lucide `HelpingHand` icon is shown.

Example values inside `option.series`:

```json
{ "icon": "OneDonation" }                                  // custom GivingTuesday icon
{ "icon": "Repeat" }                                       // Lucide icon
{ "icon": "https://publications.fepreports.org/img.png" }  // image URL
```

> **Image icons and download:** images used as icons must be served from a domain that sends CORS headers (e.g. `publications.fepreports.org`) for the PNG download feature to capture them.
