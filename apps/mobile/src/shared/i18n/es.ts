export const es = {
  tabs: {
    today: 'Hoy',
    routines: 'Rutinas',
    history: 'Historial',
    progress: 'Progreso',
    settings: 'Ajustes',
  },
  placeholder: {
    note: 'Pantalla de prueba. Todavía no hay nada aquí.',
  },
  unit: {
    kg: 'kg',
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
} as const
