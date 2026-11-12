/**
 * GENERATED FILE — do not edit by hand.
 *
 * Produced by `yarn tokens` from design-system/tokens.json, which is the design system's own
 * export. Change a value there and regenerate; a value edited here is lost on the next run.
 *
 * Every literal the interface is allowed to use lives in this file. A colour, a length or a
 * text size written anywhere else in src/ is a bug, not a decision.
 */

export type ColorToken =
  | 'bg'
  | 'surface'
  | 'surfaceAlt'
  | 'line'
  | 'lineSoft'
  | 'ink'
  | 'inkSoft'
  | 'inkMuted'
  | 'inkDisabled'
  | 'accent'
  | 'accentInk'
  | 'accentSoft'
  | 'accentPress'
  | 'ok'
  | 'danger'
  | 'pillInk'
  | 'tabbarBg'
  | 'scrimTop'
  | 'scrimBottom'
  | 'glassFill'
  | 'glassLine'
  | 'ringTrack'
  | 'ringGap'
  | 'warning'
  | 'signalInk'
  | 'overlay'
  | 'sheetBg'
  | 'inputBg'
  | 'inputLine'
  | 'focus'
  | 'skeleton'

export const color: Readonly<Record<ColorToken, string>> = {
  /** Fondo de pantalla. Negro cálido, nunca negro puro: el gris del hierro, no el del software. */
  bg: '#0f0f0e',
  /** Superficie elevada: tarjetas, tiras, barra de pestañas interior. Contraste con ink 15.6:1. */
  surface: '#1a1a18',
  /** Segundo nivel dentro de una superficie: miniatura de catálogo, celda apagada. */
  surfaceAlt: '#222220',
  /** Filete decorativo y borde de tarjeta. NO vale como borde de control: solo 1.4:1 contra surface. */
  line: '#33332f',
  /** Separador entre filas de una misma lista. Más débil que line a propósito. */
  lineSoft: '#262623',
  /** Texto principal y títulos. 17.2:1 sobre bg. */
  ink: '#f4f2ee',
  /** Texto secundario y descripciones. 7:1 sobre surface. */
  inkSoft: '#a8a49c',
  /** Etiquetas, unidades y metadatos. 5.1:1 sobre surface: es el tono más claro que todavía pasa AA. */
  inkMuted: '#8f8b82',
  /** Solo controles deshabilitados e indicador de inicio. No pasa 4.5:1 y no debe llevar información. */
  inkDisabled: '#4a4a46',
  /** Naranja de óxido. Una sola acción primaria por pantalla, el día de hoy, el aro de la marca. 6.7:1 sobre bg. */
  accent: '#ff6a1f',
  /** Texto e iconos encima de accent. 6.8:1 contra accent. */
  accentInk: '#120d08',
  /** Fondo tenue de acento: franjas, celdas de énfasis bajo. Nunca lleva texto encima. */
  accentSoft: '#2b1a0e',
  /** Estado presionado de cualquier superficie accent. */
  accentPress: '#e85d17',
  /** Confirmación: serie registrada, día completado. 8.3:1 sobre surface. */
  ok: '#7cc46b',
  /** Destructivo y error. Se distingue de accent por claridad, no solo por tono. 5.7:1 sobre surface. */
  danger: '#ff5c39',
  /** Relleno del pill blanco, la única pieza blanca del sistema: acción primaria cuando cae sobre fotografía. */
  pillInk: '#ffffff',
  /** Fondo de la barra de pestañas. Lo pinta el sistema operativo: es una aproximación, no un valor que controlemos. */
  tabbarBg: '#141412',
  /** Primera parada del degradado sobre fotografía: oscurece la zona del encabezado. */
  scrimTop: 'rgba(15, 15, 14, 0.55)',
  /** Última parada del degradado sobre fotografía: la zona donde SIEMPRE cae el texto. */
  scrimBottom: 'rgba(15, 15, 14, 0.96)',
  /** Relleno del chip de vidrio. Solo existe encima de una foto. */
  glassFill: 'rgba(255, 255, 255, 0.14)',
  /** Borde del chip de vidrio: lo que lo hace legible sobre cualquier imagen. */
  glassLine: 'rgba(255, 255, 255, 0.28)',
  /** Carril apagado del anillo de progreso del disco y de los badges. */
  ringTrack: '#33332f',
  /** Aro de separación entre el disco y la foto que tiene debajo. Mismo valor que bg, otro trabajo. */
  ringGap: '#0f0f0e',
  /** Ámbar de aviso: algo que conviene saber pero no bloquea. 7.7:1 sobre surface. */
  warning: '#e0a040',
  /** Texto e iconos sobre un relleno de ok, warning o danger. Verificado contra los tres. */
  signalInk: '#1b1206',
  /** Velo bajo una hoja inferior o un diálogo. Toca para cerrar solo si la acción no es destructiva. */
  overlay: 'rgba(9, 9, 8, 0.72)',
  /** Fondo de hoja inferior y de diálogo: un paso por encima de surface para que se lea como capa. */
  sheetBg: '#1f1f1d',
  /** Fondo de campo de texto y de celda numérica. */
  inputBg: '#232320',
  /** Borde en reposo de un campo. 3.5:1 contra input-bg: es un borde de control y tiene que llegar a 3:1, no un filete decorativo. */
  inputLine: '#7a766d',
  /** Aro de foco y de campo activo. Mismo valor que accent, otro trabajo: por eso tiene su propio nombre. */
  focus: '#ff6a1f',
  /** Bloque de carga. Nunca lleva texto encima. */
  skeleton: '#262623',
} as const

export type SpaceToken = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's8' | 's10'

export const space: Readonly<Record<SpaceToken, number>> = {
  /** Separación entre una cifra y su unidad, o entre icono y texto pegados. */
  s1: 4,
  /** Hueco entre elementos de un mismo grupo: chips, días de la semana. */
  s2: 8,
  /** Hueco entre icono y texto dentro de una fila; relleno vertical de fila. */
  s3: 12,
  /** Relleno interior de tarjeta y separación entre filas de distinta naturaleza. */
  s4: 16,
  /** Margen lateral de pantalla (gutter) y relleno de la ventana. */
  s5: 20,
  /** Separación entre bloques de contenido dentro de una pantalla. */
  s6: 24,
  /** Separación entre secciones mayores. */
  s8: 32,
  /** Respiro antes de un cierre de pantalla o sobre la barra de pestañas. */
  s10: 40,
} as const

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'sheet'

export const radius: Readonly<Record<RadiusToken, number>> = {
  /** Celdas pequeñas y franjas: días de la semana en formato cuadro. */
  sm: 6,
  /** Tarjetas internas y contenedores de lista. */
  md: 12,
  /** Tiras y tarjetas de contenido: la tira de marcas, el bloque de lo que viene. */
  lg: 18,
  /** La ventana de fotografía. El radio más grande del sistema. */
  xl: 20,
  /** Botones pill y chips de vidrio. */
  pill: 999,
  /** Disco, badges y miniaturas de catálogo. */
  circle: 9999,
  /** Esquinas superiores de una hoja inferior. Solo arriba: abajo la hoja llega al borde. */
  sheet: 24,
} as const

export type SizeToken =
  | 'touchMin'
  | 'iconSm'
  | 'iconMd'
  | 'iconLg'
  | 'thumb'
  | 'badge'
  | 'disc'
  | 'discCore'
  | 'buttonH'
  | 'buttonHLg'
  | 'heroWindowH'
  | 'tabbarH'
  | 'inputH'
  | 'rowH'
  | 'sheetHandle'
  | 'chartH'
  | 'stepperKey'

export const size: Readonly<Record<SizeToken, number>> = {
  /** Área tocable mínima (NF-3). Vale aunque el elemento visible sea más chico. */
  touchMin: 44,
  /** Icono en línea con texto. */
  iconSm: 16,
  /** Icono de barra de pestañas y de fila. */
  iconMd: 22,
  /** Icono dentro de una miniatura de catálogo. */
  iconLg: 24,
  /** Miniatura circular del ejercicio en una fila. */
  thumb: 40,
  /** Alto mínimo y ancho mínimo de la cifra marcada al final de una fila. La marca es un filete bajo el número, no un aro alrededor: un aro obliga a un círculo, y donde los dígitos son más anchos un círculo es más estrecho. */
  badge: 44,
  /** Diámetro exterior del disco de acción, aro incluido. */
  disc: 112,
  /** Zona tocable naranja del disco. 96 para que la palabra del botón quepa sin tocar el borde: en un círculo, el ancho útil a la altura del texto es menor que el diámetro. */
  discCore: 96,
  /** Alto de botón pill primario y secundario. */
  buttonH: 52,
  /** Alto de botón cuando es la única acción de la pantalla. */
  buttonHLg: 56,
  /** Alto de la ventana de fotografía en la pantalla Hoy. */
  heroWindowH: 212,
  /** Alto de la barra de pestañas nativa, indicador incluido. Ninguna composición puede usar este espacio. */
  tabbarH: 83,
  /** Alto de campo de texto, desplegable y celda numérica. */
  inputH: 52,
  /** Alto de fila de lista y de opción. Área tocable completa. */
  rowH: 48,
  /** Ancho del tirador de la hoja inferior; su alto es border-ring-disc. */
  sheetHandle: 36,
  /** Alto del área de trazado de la gráfica de progreso. */
  chartH: 160,
  /** Lado de una tecla del stepper de peso: la tecla más grande de la app, porque se usa con la mano sudada. */
  stepperKey: 64,
} as const

export type BorderToken = 'hairline' | 'ring' | 'ringDisc' | 'gapDisc' | 'focus'

export const border: Readonly<Record<BorderToken, number>> = {
  /** Filete entre filas y borde de tarjeta. */
  hairline: 1,
  /** Aro de badge y de día de hoy. */
  ring: 2,
  /** Anillo de progreso del disco de acción. Va por fuera del aro de separación, sobre bg, para que el arco de accent no caiga sobre el núcleo de accent. */
  ringDisc: 4,
  /** Aro en color bg que separa el disco del anillo de progreso que lo rodea. */
  gapDisc: 4,
  /** Grosor del aro de foco y del borde de campo activo. */
  focus: 2,
} as const

export type OpacityToken = 'press' | 'disabled' | 'photoDim'

export const opacity: Readonly<Record<OpacityToken, number>> = {
  /** Realimentación táctil al presionar cualquier superficie. */
  press: 0.88,
  /** Control deshabilitado. Va acompañado SIEMPRE de un texto que explique por qué. */
  disabled: 0.4,
  /** Fotografía atenuada detrás de contenido, solo en estados vacíos. */
  photoDim: 0.45,
} as const

export type ZToken = 'base' | 'overlap' | 'tabbar'

export const z: Readonly<Record<ZToken, number>> = {
  /** Contenido en flujo. */
  base: 0,
  /** Cualquier pieza que se monte sobre otra: el disco sobre la ventana, el botón sobre la foto. */
  overlap: 1,
  /** Barra de pestañas. Nada se dibuja por encima. */
  tabbar: 10,
} as const

export type TextVariant =
  | 'displayXl'
  | 'displayLg'
  | 'displayMd'
  | 'displaySm'
  | 'body'
  | 'bodyStrong'
  | 'caption'
  | 'label'
  | 'link'
  | 'numericXl'
  | 'numericLg'
  | 'numericMd'
  | 'numericSm'
  | 'numericUnit'

export type FontRole = 'display' | 'body' | 'numeric'

export type FontWeight = '900' | '400' | '600' | '800'

export type TextToken = {
  readonly family: FontRole
  readonly fontSize: number
  readonly lineHeight: number
  readonly fontWeight: FontWeight
  readonly letterSpacing?: number
}

export const textToken: Readonly<Record<TextVariant, TextToken>> = {
  /** Nombre de la rutina del día. Una sola vez por pantalla, siempre en mayúsculas. */
  displayXl: {
    family: 'display',
    fontSize: 42,
    lineHeight: 40,
    fontWeight: '900',
    letterSpacing: 0,
  },
  /** Título de pantalla secundaria y rutinas en listado destacado. */
  displayLg: { family: 'display', fontSize: 34, lineHeight: 33, fontWeight: '900' },
  /** Encabezado de sección y título de la barra superior. */
  displayMd: { family: 'display', fontSize: 26, lineHeight: 26, fontWeight: '900' },
  /** Texto dentro del disco y de botones condensados. */
  displaySm: {
    family: 'display',
    fontSize: 21,
    lineHeight: 22,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  /** Cuerpo por defecto. Todo lo que no sea título, cifra o etiqueta. */
  body: { family: 'body', fontSize: 15, lineHeight: 21, fontWeight: '400' },
  /** Nombre de ejercicio, de sesión y de rutina dentro de una fila. */
  bodyStrong: { family: 'body', fontSize: 15, lineHeight: 21, fontWeight: '600' },
  /** Metadato bajo un nombre: fecha, duración, series objetivo. */
  caption: { family: 'body', fontSize: 12, lineHeight: 17, fontWeight: '400' },
  /** Etiqueta de sección, SIEMPRE en mayúsculas y con 2px de interletrado. Nunca más de tres palabras. */
  label: { family: 'body', fontSize: 10, lineHeight: 12, fontWeight: '800', letterSpacing: 2 },
  /** Enlace de sección, alineado a la derecha del encabezado. En accent. */
  link: { family: 'body', fontSize: 12, lineHeight: 16, fontWeight: '600' },
  /** La cifra protagonista de una pantalla: tu marca, el peso del día. */
  numericXl: { family: 'numeric', fontSize: 40, lineHeight: 40, fontWeight: '900' },
  /** Cifra de tarjeta o de fila destacada. */
  numericLg: { family: 'numeric', fontSize: 30, lineHeight: 30, fontWeight: '900' },
  /** Cifra dentro de un badge de 44px. */
  numericMd: { family: 'numeric', fontSize: 22, lineHeight: 22, fontWeight: '900' },
  /** Cifra en línea con texto: contadores de semana, índices de ejercicio. */
  numericSm: { family: 'numeric', fontSize: 16, lineHeight: 16, fontWeight: '900' },
  /** La unidad que acompaña a una cifra. Siempre en ink-muted y siempre más chica que su número. */
  numericUnit: {
    family: 'numeric',
    fontSize: 8,
    lineHeight: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
} as const
