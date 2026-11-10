/**
 * Metro resolves these to an asset id. Expo's own types cover the common image formats but
 * not font files or WebP, so without this the imports in shared/theme/fonts.ts and in the
 * Hoy screen do not typecheck.
 */
declare module '*.ttf' {
  const asset: number
  export default asset
}

declare module '*.webp' {
  const asset: number
  export default asset
}
