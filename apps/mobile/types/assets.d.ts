/**
 * Metro resolves a font file to an asset id. Expo's own types cover images but not font
 * files, so without this the imports in shared/theme/fonts.ts do not typecheck.
 */
declare module '*.ttf' {
  const asset: number
  export default asset
}
