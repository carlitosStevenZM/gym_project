export const es = {
  tabs: {
    today: 'Hoy',
    routines: 'Rutinas',
    history: 'Historial',
    progress: 'Progreso',
    settings: 'Ajustes',
  },
  auth: {
    login: {
      title: 'Entrar',
      kicker: 'Tu entrenamiento, registrado',
      submit: 'Entrar',
      google: 'Continuar con Google',
      forgot: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes cuenta?',
      goSignup: 'Crear una',
    },
    signup: {
      title: 'Crear cuenta',
      kicker: 'Empieza a registrar lo que levantas',
      submit: 'Crear cuenta',
      google: 'Continuar con Google',
      hasAccount: '¿Ya tienes cuenta?',
      goLogin: 'Entrar',
    },
    field: {
      email: 'Correo',
      password: 'Contraseña',
      passwordHelp: 'Mínimo 8 caracteres',
      displayName: 'Nombre',
      displayNameHelp: 'Como quieres que te llamemos',
    },
    validation: {
      email: 'Escribe un correo válido',
      password: 'La contraseña necesita al menos 8 caracteres',
      displayName: 'Escribe tu nombre',
    },
    // Keyed by the API's error code. The server also sends Spanish, but a screen
    // that renders whatever the server says has no control over its own copy.
    error: {
      unauthenticated: 'Ese correo o esa contraseña no son correctos',
      email_taken: 'Ese correo ya tiene una cuenta',
      invalid_input: 'Revisa los datos e intenta de nuevo',
      network: 'No se pudo conectar. Revisa tu internet',
      unknown: 'Algo salió mal. Intenta de nuevo',
    },
  },
  placeholder: {
    note: 'Pantalla de prueba. Todavía no hay nada aquí.',
  },
  unit: {
    kg: 'kg',
  },
  // Monday first, and X for miércoles: `Intl` narrows both martes and miércoles to M.
  date: {
    dayAndMonth: '{{weekday}} {{day}} {{month}}',
    weekday: {
      long: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      initial: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
      short: ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'],
    },
    month: {
      short: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    },
  },
  // The wording the design system fixes for the shared components. A screen passes these in:
  // nothing under shared/ui/ reads a translation by itself.
  ui: {
    action: {
      start: 'Empezar',
      createWeek: 'Crear semana',
      cancel: 'Cancelar',
      close: 'Cerrar',
      clear: 'Limpiar',
      retry: 'Reintentar',
      undo: 'Deshacer',
      skip: 'Saltar',
      addRest: '+30 s',
      back: 'Volver',
      previousMonth: 'Mes anterior',
      nextMonth: 'Mes siguiente',
      searchExercise: 'Buscar ejercicio',
    },
    set: {
      weight: 'Peso',
      reps: 'Reps',
      confirm: 'Confirmar serie',
      confirmed: 'Serie registrada',
      less: 'Menos {{amount}}',
      more: 'Más {{amount}}',
    },
    feedback: {
      offline: 'Sin conexión. La app necesita internet para registrar series.',
      reconnecting: 'Reconectando…',
      unsentSets: '{{count}} series no llegaron al servidor.',
      saveFailed: 'No se pudo guardar la serie.',
      restOver: 'Descanso terminado',
      loading: 'Cargando',
    },
    restDay: {
      title: 'Descanso',
      note: 'Este día no tiene rutina asignada',
    },
    week: {
      label: 'Esta semana',
      counter: '{{done}} de {{planned}}',
    },
    upNext: {
      label: 'Lo que viene',
    },
  },
  today: {
    kicker: '{{weekly}} · hoy toca',
    exerciseCount_one: '{{count}} ejercicio',
    exerciseCount_other: '{{count}} ejercicios',
    setCount_one: '{{count}} serie',
    setCount_other: '{{count}} series',
    exerciseDetail: '{{sets}} · {{reps}} reps',
    repsRange: '{{min}}-{{max}}',
    noWeeklyTraining: {
      title: 'Todavía no tienes una semana',
      body: 'Arma tu semana una vez y la app te dice qué toca cada día, sin que tengas que acordarte.',
    },
    noRecords: {
      title: 'Todavía no hay marcas',
      body: 'Cuando registres tu primera sesión, aquí queda tu mejor peso por ejercicio.',
    },
    error: {
      title: 'No se pudo cargar tu día',
      body: 'Revisa tu conexión y vuelve a intentarlo.',
    },
    a11y: {
      start: 'Empezar, {{exercise}}',
      weekProgress: '{{done}} de {{planned}} entrenamientos de la semana',
      today: 'hoy',
      rest: 'descanso',
      trained: 'entrenado',
      repsRange: 'de {{min}} a {{max}} repeticiones',
      repsExact_one: '{{count}} repetición',
      repsExact_other: '{{count}} repeticiones',
      lastTime: 'la vez pasada {{weight}} kilos',
      noHistory: 'sin registro todavía',
      record: 'tu marca',
      loading: 'Cargando tu día',
    },
  },
} as const
