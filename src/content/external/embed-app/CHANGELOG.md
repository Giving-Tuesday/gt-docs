---
notion_page_id: 3b517e53b97780429f51d0e27faab27a
---
# Embed App Changelog
---

## Jump to

<table_of_contents/>

---

## [1.2.2]

### 🚀 Features

- Show one combined tooltip in an `EChart` small-multiples grid (`autoCols`). Hovering a panel used to open a tooltip in every panel at once, each squeezed into its own narrow panel, so on small screens they overlapped each other and covered the data. Now only the hovered panel shows a tooltip, listing the hovered category's value from every panel (matched by category name, the hovered panel's row in bold), and it may extend over neighbouring panels instead of wrapping. `tooltipSpec` formats every row, and a string `option.tooltip.formatter` is applied to each row; a formatter function keeps one tooltip per panel, shown for the hovered panel only.
- Open the tapped panel's tooltip on the first tap in an `EChart` small-multiples grid (`autoCols`) on a touch screen. Tapping a second panel used to close every tooltip instead, because the browser's emulated `mouseout` on the previously tapped panel hid the tooltips of all connected panels.

### 🐛 Bug Fixes

- MetricsBarWithSegments: when the bar is hidden (`showBar: false` or totals over 100), change values use the base colour instead of the bar gradient
- MetricsBarWithSegments: set the title and the change/current values in Montserrat under the `fep` theme (labels stay Open Sans)
- MetricCard: increase `subLabel`, `changeLabel` and `currentLabel` font sizes so they are readable, keeping label > subLabel > changeLabel = currentLabel
- Keep the chart title, subtitle and description styled by the embed when the host page restyles `h5`/`h6`/`p` with `!important` (e.g. WordPress block CSS). They now render as `div`s, so those host selectors no longer match; the title keeps `role="heading"`.
- When `MetricCard` is passed `changeValue` and `currentValue` use `toFixed` to ensure the number is always shown with 1 decimal place.
- Keep `MetricsBarWithSegments` cards aligned when a label wraps. Each card now fills the same rows of a shared CSS grid (`subgrid`), so a long `label` or `subLabel`, or a missing `subLabel`, no longer pushes that card's values below its neighbours'. Labels sit on a shared baseline directly above their `subLabel`.

### ⚙️ Miscellaneous Tasks

- Clear every `npm audit` finding. The library and the embed now bundle axios 1.20 (patched; the dependency floor moves to `^1.20.0`), and the type build moves to `vite-plugin-dts` 5, which drops the vulnerable `@microsoft/api-extractor` chain. The published types are unchanged apart from quote style.

---

## [1.2.1] - 2026-09-15

### 🚀 Features

- Add an optional `changeSuffix` to a `MetricsBarWithSegments` metric, controlling the unit drawn after `changeValue` on the card and in the segment tooltip. The unit was hardcoded to `%`, which misreported a change measured in percentage points; it now defaults to `%` and accepts e.g. `"p.p."`. The card also renders the unit smaller than the figure instead of at full size.

---

## [1.1.3] - 2026-09-14

### 🚀 Features

- Show a `MetricsBarWithSegments` tooltip row whose `changeValue` or `currentValue` is exactly `0`. Both rows were gated on truthiness — and the current-value row was gated on `changeValue` rather than its own field — so a genuine zero dropped the row from the tooltip, and a metric with no `changeValue` hid its current value too.

---

## [1.1.2] - 2026-09-14

### 🚀 Features

- Render a `MetricsBarWithSegments` metric whose `currentValue` or `changeValue` is exactly `0`. Both were tested for truthiness, so a genuine zero was indistinguishable from an omitted field and the figure vanished from the card while its label, icon and segment stayed.
- Fan `MetricsBarWithSegments`' connectors from the correct end when the bar's smallest segment is on the left. The spread was keyed to segment index alone, so a bar ordered small-to-large crossed its connector lines instead of splaying them.

---

## [1.1.1] - 2026-09-02

### 🚀 Features

- Namespace `MetricsBarWithSegments`' connector arrowheads per component instance. SVG marker ids are document-global and a `url(#id)` reference resolves to the first match in the document, so two metrics bars on one page both drew the first bar's arrow tips: a red bar following a green one got green arrowheads while its segments, connector lines and tooltips stayed red.

---

## [1.1.0] - 2026-09-02

### ⚠️ Removed

- Remove the chart.js-based components `CompositionBar`, `HorizontalBar` and `RadarChart` — use `EChart`, which covers bar, horizontal bar, line, scatter and small multiples from one option object.
- Remove the router-dependent `FilterPanel`, `DateRangePicker`, `ParameterForms` and `useQueryFilterParams`, along with their shared types. These are no longer exported from `@giving-tuesday/embed-app`.

### 🚀 Features

- Move development to React 19 (`react`/`react-dom` 19.x, types included). The library's peer range stays open to both majors — `react`/`react-dom` `^18 || ^19` — so React 18 consumers install unchanged; no React-19-only API is used in the source.
- Bump the `@visx` packages to v4 for React 19 compatibility.
- Render PNG exports from an off-screen copy of the chart at a pinned pixel ratio, so a download is identical whatever the browser window size or display density, and the live chart on the page is never touched.
- Add a global function `window.htmlToImage` used by `gt-charts` Python library. Uses the `capture` function of an element to get the `dataUrl` for a chart. This `dataUrl` can then be used to display the Image.
- Add an optional `tooltipSpec` prop to `EChart` (`data-tooltip-spec`) that formats tooltip values with `round`, `prefix`, `suffix` and `thousands_separator`
- Accept `maxWidth`/`height` as bare numeric strings or `px` strings as well as plain numbers.
- Rebuild `EChart`'s small multiples on one ECharts instance per series, laid out by MUI's `Grid` and stitched back together with `echarts.connect` so the panels share a tooltip and axis pointer, stack into a single column on mobile, and always export side by side. `data-auto-cols` is now a plain boolean — the author supplies only the series and their axes, with no `grid`/`gridIndex`/`xAxisIndex`/`yAxisIndex` wiring and no column count. Each panel's x-axis labels thin themselves out to fit the narrower box, so a scale the author tuned for a full-width chart no longer collides when it is split across panels. Every panel gets the same plot width whatever the panel count: each one is measured for what its axis labels, axis names and padding actually take, that furniture comes off the row, and what is left is divided evenly — so the panel carrying the shared value-axis labels does not pay for them out of its own plot, and the panels' x-axes line up.
- Derive `MetricsBarWithSegments`' gradient from any theme: a single-color theme (`gt-navy`, `fep-blue`, …) gradients between its color and a darkened copy, and a lone entry in `option.colors` gets the same treatment, so only the far end is ever invented.
- Measure `MetricsBarWithSegments`' bar in a component of its own, so the on-screen bar and the off-screen export copy each own their measurement. Previously they shared one ref: downloading an image retargeted the on-screen bar at the copy's width and then left it unmeasured, so it overflowed its container for the rest of the page's life. The export copy is also pinned to `content-box`, so a host page's global `border-box` cannot shrink it.
- Draw error bars on an `EChart` from a `type: 'custom'` series whose data is `[categoryIndex, min, max]` per point: `EChart` supplies the whole whisker spec, so the author adds only the series alongside the one it annotates. The error-bar series takes no palette slot and no legend entry, so the bars it sits over keep their colors and the legend strip is reserved only when there is more than one real series. A chart pairing error bars with more than one other series renders an error notice instead, since there is no way to tell which series the bars belong to. Hovering a category shows the bounds on the annotated series' own tooltip row — `Grants: 11 (9 – 14)` — formatted with the same `tooltipSpec` as the value beside them, rather than as a row of their own.
- Lay out `EChart`'s `tooltipSpec` tooltip the way ECharts lays out its own — a category heading, then one row per series with the name on the left and the bolded value on the right, the error-bar bounds trailing the value they annotate — and escape series names and values as HTML. The custom formatter is now installed only when `tooltipSpec` is set or the chart carries error bars, so a `formatter` of the author's own under `option.tooltip` is honoured again; every other `option.tooltip` key still merges in alongside `tooltipSpec`.
- Give an embed the MUI theme that matches the ECharts theme it asks for: `data-theme` now also picks the fonts used by the title, description and metric cards, so an `fep-*` chart renders in Open Sans instead of Giving Tuesday's Montserrat. The family is the part of the theme name before the first `-`, and anything unrecognised falls back to `gt`. Library consumers can pass the same name to `GTThemeProvider`'s new optional `theme` prop; omitting it keeps the Giving Tuesday look.

### ⚙️ Miscellaneous Tasks

- Prune the dependencies the removed components were the sole consumers of: the chart.js stack, `react-router-dom`, `@mui/x-date-pickers`, `date-fns`, `fast-deep-equal`, `svgo`, the jest toolchain, `cross-env`, `rollup-plugin-svg` and `tsc-alias`. `react-router-dom` is no longer externalised in the library build.
- Declare `@testing-library/jest-dom` explicitly rather than relying on a transitive install.

### 🧪 Testing

- `react-chartjs-2` no longer needs mocking in `src/setupTests.ts`, which now only loads `@testing-library/jest-dom/vitest`. Suite baseline is 11 test files / 45 tests, after the `gridLayout` helpers and their tests went with the old small-multiples layout.
- One `PureSelect` test is commented out with a TODO after MUI's Select API change; nothing consumes `PureSelect` today.

---

## [1.0.0] - 2026-08-06

### 🚀 Features

- Add Echarts component and register as embeddable, renders ECharts from Apache Echarts library. Line, Var and Scatter charts are available but other Apache Echarts types can be added with additional configuration;
  - Add and register gt and fep Echarts themes, uses Apache Echarts json object to configure colours;
  - Add single-color echarts theme variants i.e. fep-blue;
  - Auto-distribute small-multiples grids via autoCols prop, allows multiple charts to be stacked in a column layout with an automatic layout, without additional configuration.
- Extract ChartWrapper with title and reliable image download, this component can now wrap any visualization and render configurable title/description plus an image download button;
  - Add GivingTuesday and FEP SVG logos then use these in the image download function to have a watermark by default on all exported chart images;
- Vite builds single-file bundle (`gt-embed.js`) and publishes this to public npm using GitHub workflow;
- Add an svg icon component library, these icons can be used in custom visualizations, for example the segmented bar visualization;
- Add segmented bar visualization with connector lines, used by MetricsBarWithSegments component;
- Add component switcher to index.html;
- Versioned html test page is pushed to GitHub pages within versioned subdirectory, allows you to preview and test in browser the embeddable components, using the published public NPM package as the script source.

### 🚜 Refactor

- Rename header/subHeader props to title/subTitle;
- Consolidate MetricsBarWithSegments props into a single `option` object (mirroring EChart) and drive its segment gradient colors from the theme, with `showDownload`/`showWatermark`/`watermarkLogo` support;
- Relocate stories to top-level dir and fix eslint config;
- Migrate from CRA/Rollup to Vite;
- Replace MetricsBar with MetricsBarWithSegments;
- Modify Mode component, removing all logic that displays a dashboard, showing a message stating that the dashboard doesn't exist. Implemented because Mode is being deprecated at GivingTuesday to be replaced by Databricks Dashboards.

### 📚 Documentation

- Document charts, theming, and library usage in single markdown guide.

### 🧪 Testing

- Migrate from Jest to Vitest, many tests in the repo are irrelevant at this point.

### ⚙️ Miscellaneous Tasks

- *(dev)* Refresh index.html demo examples;
- *(build)* Convert vite configs to esm and modernize publish workflow;
- *(Icon)* Remove unused icomoon Icon component.
