// Turns the design system export in design-system/tokens.json into
// src/shared/theme/tokens.gen.ts. Run it with `yarn tokens`.
//
// The export is the source of truth and this script never edits it. Everything below is
// mechanical: key casing, unit stripping and the two renames the repo's English-identifier
// rule forces. If a value looks wrong, it is wrong upstream.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const app = join(here, '..')
const SOURCE = join(app, 'design-system', 'tokens.json')
const TARGET = join(app, 'src', 'shared', 'theme', 'tokens.gen.ts')

/** Token names the design system writes in Spanish. Identifiers in this repo are English. */
const RENAMES = { 'ventana-h': 'hero-window-h' }

/** `radius-circle` is `50%` upstream; React Native draws a circle from an oversized radius. */
const OVERRIDES = { 'radius-circle': 9999 }

const camel = (name) => name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())

function keyOf(name, prefix) {
  const renamed = RENAMES[name] ?? name
  const stripped = prefix && renamed.startsWith(prefix) ? renamed.slice(prefix.length) : renamed
  const safe = /^[0-9]/.test(stripped) ? `s${stripped}` : stripped
  return camel(safe)
}

function numberOf(name, value) {
  if (name in OVERRIDES) return OVERRIDES[name]
  if (typeof value === 'number') return value
  const parsed = Number(String(value).replace(/px$/, ''))
  if (Number.isNaN(parsed))
    throw new Error(`${name}: "${value}" is not a length this script can read`)
  return parsed
}

const quote = (value) => `'${String(value).replace(/'/g, "\\'")}'`
const doc = (usage) => (usage ? `  /** ${usage.replace(/\s+/g, ' ').trim()} */\n` : '')

function familyBlock({ constName, type, tokens, prefix, render }) {
  const entries = tokens
    .map((token) => `${doc(token.usage)}  ${keyOf(token.name, prefix)}: ${render(token)},`)
    .join('\n')
  return `export const ${constName}: ${type} = {\n${entries}\n} as const\n`
}

function colorBlock(tokens) {
  return familyBlock({
    constName: 'color',
    type: 'Readonly<Record<ColorToken, string>>',
    tokens,
    prefix: '',
    render: (token) => quote(token.value),
  })
}

function scaleBlock(constName, tokens, prefix) {
  return familyBlock({
    constName,
    type: `Readonly<Record<${constName[0].toUpperCase()}${constName.slice(1)}Token, number>>`,
    tokens,
    prefix,
    render: (token) => numberOf(token.name, token.value),
  })
}

function unionType(typeName, tokens, prefix) {
  const names = tokens.map((token) => quote(keyOf(token.name, prefix))).join(' | ')
  return `export type ${typeName} = ${names}\n`
}

function textStyleBlock(type) {
  const rows = type.groups.flatMap((group) =>
    group.styles.map((style) => {
      const parts = [
        `family: ${quote(group.family)}`,
        `fontSize: ${numberOf(style.name, style.fontSize)}`,
        `lineHeight: ${numberOf(style.name, style.lineHeight)}`,
        `fontWeight: ${quote(style.fontWeight)}`,
      ]
      if (style.letterSpacing !== undefined) {
        parts.push(`letterSpacing: ${numberOf(style.name, style.letterSpacing)}`)
      }
      return `${doc(style.usage)}  ${camel(style.name)}: { ${parts.join(', ')} },`
    }),
  )
  const names = type.groups
    .flatMap((group) => group.styles.map((style) => quote(camel(style.name))))
    .join(' | ')
  const weights = [
    ...new Set(
      type.groups.flatMap((group) => group.styles.map((style) => quote(style.fontWeight))),
    ),
  ].join(' | ')
  return [
    `export type TextVariant = ${names}\n`,
    `export type FontRole = ${[...new Set(type.groups.map((g) => quote(g.family)))].join(' | ')}\n`,
    `export type FontWeight = ${weights}\n`,
    'export type TextToken = {\n' +
      '  readonly family: FontRole\n' +
      '  readonly fontSize: number\n' +
      '  readonly lineHeight: number\n' +
      '  readonly fontWeight: FontWeight\n' +
      '  readonly letterSpacing?: number\n' +
      '}\n',
    `export const textToken: Readonly<Record<TextVariant, TextToken>> = {\n${rows.join('\n')}\n} as const\n`,
  ].join('\n')
}

const source = JSON.parse(readFileSync(SOURCE, 'utf8'))

const families = [
  { constName: 'space', typeName: 'SpaceToken', tokens: source.spacing.tokens, prefix: 'space-' },
  { constName: 'radius', typeName: 'RadiusToken', tokens: source.radius.tokens, prefix: 'radius-' },
  { constName: 'size', typeName: 'SizeToken', tokens: source.size.tokens, prefix: '' },
  { constName: 'border', typeName: 'BorderToken', tokens: source.border.tokens, prefix: 'border-' },
  {
    constName: 'opacity',
    typeName: 'OpacityToken',
    tokens: source.opacity.tokens,
    prefix: 'opacity-',
  },
  { constName: 'z', typeName: 'ZToken', tokens: source.zIndex.tokens, prefix: 'z-' },
]

const header = `/**
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by \`yarn tokens\` from design-system/tokens.json, which is the design system's own
 * export. Change a value there and regenerate; a value edited here is lost on the next run.
 *
 * Every literal the interface is allowed to use lives in this file. A colour, a length or a
 * text size written anywhere else in src/ is a bug, not a decision.
 */
`

const body = [
  unionType('ColorToken', source.color.tokens, ''),
  colorBlock(source.color.tokens),
  ...families.flatMap(({ constName, typeName, tokens, prefix }) => [
    unionType(typeName, tokens, prefix),
    scaleBlock(constName, tokens, prefix),
  ]),
  textStyleBlock(source.type),
].join('\n')

mkdirSync(dirname(TARGET), { recursive: true })
writeFileSync(TARGET, `${header}\n${body}`)

const counts = [
  `${source.color.tokens.length} colours`,
  ...families.map(({ constName, tokens }) => `${tokens.length} ${constName}`),
  `${source.type.groups.flatMap((g) => g.styles).length} text styles`,
]
console.log(`tokens.gen.ts written — ${counts.join(', ')}`)
