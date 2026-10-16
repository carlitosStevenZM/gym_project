# El modelo de datos, explicado

**Para:** Carlos
**Acompaña a:** [`DATA-MODEL.md`](DATA-MODEL.md), que es la versión técnica
**En español a propósito**, igual que [`DISCOVERY.md`](DISCOVERY.md). Los otros documentos están en inglés porque el código va en inglés.

Este documento explica **por qué el modelo quedó como quedó**. No tiene SQL y no hace falta saber de bases de datos para leerlo. Si en algún punto algo no te cuadra, ese punto es justo el que hay que discutir.

---

## 1. La idea en una frase

El modelo está partido en **cuatro zonas**, y la zona te dice de quién son los datos:

| Zona | Qué guarda | De quién es |
|---|---|---|
| **Cuenta** | Quién eres y tus ajustes | Tuyo |
| **Plan** | Lo que *piensas* entrenar: tus rutinas y tu semana | Tuyo |
| **Realidad** | Lo que *de verdad* entrenaste: fechas, pesos, repeticiones | Tuyo |
| **Catálogo** | La lista de ejercicios que existen | **De todos.** Es uno solo para toda la app |

Y hay una regla que explica casi todo lo demás:

> **El Plan y la Realidad nunca se tocan directamente.** Lo único que comparten es el catálogo de ejercicios.

Por eso en el diagrama dibujado el catálogo está en medio: no es decoración, es que literalmente es el puente.

---

## 2. Cinco palabras, de una vez

Para que el resto se lea sin tropiezos. Todas con ejemplo de gimnasio.

**Tabla.** Una lista de cosas del mismo tipo. `routine` es la lista de todas las rutinas de todos los usuarios. Piénsalo como una hoja de Excel: la tabla es la hoja, y cada fila es una rutina.

**Renglón.** Una cosa concreta dentro de esa lista. Tu rutina "Pecho y tríceps" es *un* renglón de la tabla `routine`.

**Llave primaria (PK).** El número de identificación de ese renglón. Es único y no cambia nunca, ni aunque le cambies el nombre a la rutina. Es como el CURP de ese renglón.

**Llave foránea (FK).** Un renglón que apunta a otro. Tu rutina guarda el ID de tu usuario: así la app sabe de quién es. No guarda tu nombre ni tu correo, nada más el ID. Si mañana cambias tu nombre, la rutina sigue siendo tuya sin tener que tocar nada.

**Nullable (`?`).** Significa "este dato puede estar vacío, y eso está bien". El caso más importante del proyecto: el día miércoles de tu semana guarda qué rutina te toca, y si está **vacío**, eso *es* el día de descanso. No guardamos un descanso: guardamos nada, y nada quiere decir descanso.

---

## 3. Las tablas, una por una

Cada una con la pregunta que contesta y un renglón de ejemplo. Los IDs reales son códigos largos y feos; aquí los escribo cortitos (`u-1`, `rut-7`) nada más para que se lean.

### Zona Cuenta

**`app_user`** — *¿quién eres?*

| id | email | display_name |
|---|---|---|
| `u-1` | carlos@correo.com | Carlos |

**`auth_identity`** — *¿de qué formas puedes entrar?*

Esta es la tabla que quizá no esperabas. Un usuario, **varias formas de entrar**. Por eso existe:

| id | user_id | provider | password_hash |
|---|---|---|---|
| `ai-1` | `u-1` | google | *(vacío)* |
| `ai-2` | `u-1` | password | `$2b$...` |

Dos renglones, **un solo usuario**. Entraste con Google, después te creaste contraseña con el mismo correo, y la app no te hizo dos cuentas: te agregó una segunda forma de entrar a la misma.

Si la contraseña viviera dentro de `app_user`, el día que quisiéramos agregar "entrar con Apple" habría que meterle columnas nuevas al usuario. Así nada más se agrega un renglón.

**`password_reset_token`** — *¿este link de "olvidé mi contraseña" sigue siendo válido?* Un renglón por cada vez que alguien pide recuperar su contraseña, con su fecha de vencimiento.

**`user_settings`** — *¿cómo te gusta que se comporte la app?*

| user_id | default_rest_seconds | rest_timer_enabled |
|---|---|---|
| `u-1` | 90 | sí |

Un renglón por usuario, ni más ni menos. Aquí vive el descanso entre series, que acordamos que es **un solo valor para todos los ejercicios**.

### Zona Catálogo — la lista de ejercicios

**`muscle_group`** — *¿qué partes del cuerpo hay?* Seis renglones, y ya: pecho, espalda, pierna, hombro, brazo, abdomen. Esta tabla no crece.

**`muscle_subgroup`** — *¿qué músculo específico?* Unos 17: pectoral superior, deltoides posterior, cuádriceps. Cada uno apunta a su grupo grande.

**`equipment`** — *¿con qué se hace?* Barra, mancuerna, máquina, polea, peso corporal. Unos 12. Acordamos no usarlo en la v1, pero el dato viene gratis en la importación así que se guarda.

**`exercise`** — *¿qué ejercicios existen en el mundo?*

| id | name | muscle_group | primary_muscle_subgroup | equipment |
|---|---|---|---|---|
| `ej-14` | Press de banca con barra | pecho | pectoral medio | barra |
| `ej-31` | Press militar | hombro | deltoides anterior | barra |

**Este es el catálogo, y es compartido.** Hay *un* renglón de "Press de banca con barra" en toda la app. Tú, yo y cualquier usuario apuntamos al mismo.

Fíjate en lo que **no** está aquí: no hay series, no hay repeticiones, no hay peso. Ya volvemos a eso en el §4.

### Zona Plan — lo que piensas entrenar

**`routine`** — *¿qué rutinas armaste?*

| id | user_id | name |
|---|---|---|
| `rut-7` | `u-1` | Pecho y tríceps |
| `rut-8` | `u-1` | Espalda y bíceps |

Nada más el nombre y de quién es. Los ejercicios viven en la tabla de abajo.

**`routine_exercise`** — *¿qué ejercicios tiene esa rutina y con qué configuración?*

Esta es la que nació de nuestra discusión. Cada renglón es **un ejercicio dentro de una rutina**:

| id | routine_id | exercise_id | position | target_sets | reps_min | reps_max |
|---|---|---|---|---|---|---|
| `re-1` | `rut-7` | `ej-14` | 1 | 4 | 8 | 12 |
| `re-2` | `rut-7` | `ej-22` | 2 | 4 | 8 | 12 |
| `re-3` | `rut-7` | `ej-9` | 3 | 3 | 12 | 15 |

Léelo así: *"En la rutina `rut-7`, el primer ejercicio es el `ej-14` (press de banca), y le tocan 4 series de 8 a 12 repeticiones."*

El `position` es lo que permite arrastrarlos para cambiar el orden. Y **no hay columna de nombre**: el nombre sale del catálogo siguiendo el `exercise_id`.

**`weekly_training`** — *¿qué semanas armaste?*

| id | user_id | name | is_active |
|---|---|---|---|
| `sem-2` | `u-1` | Rutina de 4 días | **sí** |
| `sem-3` | `u-1` | Semana ligera | no |

Puedes tener las que quieras, pero **solo una está activa**. Esa es la que la app usa para decirte qué toca hoy.

**`weekly_training_day`** — *¿qué te toca cada día?*

Siete renglones por cada semana. Siempre siete, aunque entrenes tres días:

| weekly_training_id | day_of_week | routine_id |
|---|---|---|
| `sem-2` | 1 lunes | `rut-8` |
| `sem-2` | 2 martes | *(vacío)* |
| `sem-2` | 3 miércoles | `rut-7` |
| `sem-2` | 4 jueves | *(vacío)* |
| `sem-2` | 5 viernes | `rut-9` |
| `sem-2` | 6 sábado | `rut-10` |
| `sem-2` | 7 domingo | *(vacío)* |

Martes, jueves y domingo están vacíos. **Eso es el descanso**: ausencia de rutina, no un dato especial. Tal como lo acordamos.

### Zona Realidad — lo que sí entrenaste

**`routine_session`** — *¿qué entrenaste tal día y cuánto duró?*

| id | user_id | routine_id | routine_name | session_date | started_at | ended_at |
|---|---|---|---|---|---|---|
| `ses-55` | `u-1` | `rut-7` | Pecho y tríceps | 2026-10-14 | 19:05 | 19:53 |

Un renglón por día entrenado. La duración no se guarda: se resta `19:53 − 19:05`.

Lo del `routine_name` repetido lo explico en el §4, porque parece un error y no lo es.

**`exercise_record`** — *¿qué ejercicios hiciste en esa sesión?*

| id | routine_session_id | exercise_id | position |
|---|---|---|---|
| `reg-201` | `ses-55` | `ej-14` | 1 |
| `reg-202` | `ses-55` | `ej-22` | 2 |

Fíjate bien: apunta al **ejercicio del catálogo** (`ej-14`), **no** al `routine_exercise`. Esto es importantísimo y es el §4.3.

**`exercise_set`** — *¿cuánto levantaste en cada serie?*

| exercise_record_id | set_number | reps | weight_kg |
|---|---|---|---|
| `reg-201` | 1 | 10 | 60.00 |
| `reg-201` | 2 | 9 | 65.00 |
| `reg-201` | 3 | 8 | 65.00 |
| `reg-201` | 4 | 8 | 67.50 |

**Aquí es donde vive el dato que vale.** Todo lo demás del modelo existe para que estos cuatro renglones tengan sentido y se puedan encontrar después.

---

## 4. Las tres cosas que cuestan de ver

### 4.1 · Por qué las series salieron del catálogo

En tu diagrama, el `Ejercicio` traía `cantidad de series` y `repeticiones objetivo`. Suena lógico y por eso lo pusiste ahí. El problema aparece con este caso:

> Press de banca está en tu rutina "Pecho y tríceps" con **4 series de 8–12**.
> Y también en tu rutina "Full body" con **2 series de 12–15**.

Si esos números viven en `exercise`, solo hay **un** renglón de press de banca en toda la base de datos. No caben el 4 y el 2 al mismo tiempo: uno pisa al otro.

Y hay algo peor. El catálogo es compartido por **todos los usuarios**. Si tú cambias tus series de press de banca, se las cambias a toda la gente que use la app.

Por eso nació `routine_exercise`. Ahí sí cabe: un renglón para "press de banca en la rutina 7 con 4 series" y otro para "press de banca en la rutina 12 con 2 series". Mismo ejercicio del catálogo, dos configuraciones distintas.

La forma corta de recordarlo: **series y repeticiones no son una característica del ejercicio, son una decisión tuya.** El press de banca no "es" de 4 series — es de 4×6 si entrenas fuerza y de 3×12 si entrenas hipertrofia. El catálogo guarda qué *es* el ejercicio; tu rutina guarda cómo *lo vas a hacer*.

### 4.2 · Por qué apareció la sesión de rutina

En tu diagrama, la duración estaba en `Registro de ejercicio`. El problema:

> Un día haces 4 ejercicios → son 4 registros → ¿4 duraciones?

La duración que acordamos mostrar al terminar es la **del entrenamiento completo**, no la de cada ejercicio. Así que ese campo o guardaba cuatro números distintos que nadie pidió, o cuatro copias del mismo.

Que la duración hubiera acabado ahí fue la pista de que faltaba algo: **nada representaba "el día"**. Tampoco había dónde guardar con qué rutina entrenaste ese día, que es justo lo que el historial necesita para decir *"Espalda y bíceps · lunes 6 oct"*.

Por eso se agregó `routine_session`. Un renglón por día entrenado, y los registros de ejercicio cuelgan de él. La duración y la fecha subieron ahí, y el registro se quedó nada más con el ejercicio y sus series.

### 4.3 · Por qué el registro apunta al ejercicio y no a la rutina

Esta es sutil y es la más valiosa del modelo entero. Tú ya la tenías bien en tu diagrama, pero vale la pena decir por qué está bien.

`exercise_record` apunta al **ejercicio del catálogo**. No apunta a la rutina ni al `routine_exercise`.

La consecuencia es que **tu historial es intocable**:

- Renombras "Pecho y tríceps" → el historial sigue completo
- Borras esa rutina → el historial sigue completo
- Te cambias de semana a media semana → el historial sigue completo
- Le quitas press de banca a la rutina → tu gráfica de press de banca sigue completa

Porque nunca estuvo colgando de nada de eso. Lo que quedó guardado es: *"el 14 de octubre hiciste press de banca con estos pesos"*. Eso es cierto para siempre, sin importar qué pasó después con tus planes.

Y es la razón de que el progreso sea **por ejercicio** y no por rutina. No importa con qué plan lo hiciste: la gráfica junta todas las veces que levantaste en ese ejercicio.

---

## 5. Un miércoles completo, renglón por renglón

Vamos a seguir un día de principio a fin. Es miércoles 14 de octubre, son las 7 de la tarde y abres la app.

**1. La app pregunta qué te toca hoy.** Busca tu semana activa (`sem-2`, porque tiene `is_active` en sí), ve que hoy es día 3, y encuentra que el miércoles apunta a `rut-7`. Sigue ese ID y lee el nombre: **"Pecho y tríceps"**. Te lo muestra en la pantalla de inicio.

Hasta aquí **no se escribió nada**. Solo se leyó.

**2. Le picas a Empezar.** Ahora sí se crea el primer renglón:

```
routine_session
  id: ses-55 · user_id: u-1 · routine_id: rut-7
  routine_name: "Pecho y tríceps"     ← copiado ahora
  session_date: 2026-10-14 · started_at: 19:05 · ended_at: vacío
```

`ended_at` está vacío porque apenas empiezas. Así es como la app sabe que esta sesión sigue abierta.

**3. La app arma la pantalla.** Lee los `routine_exercise` de `rut-7` en orden de `position`, y por cada uno sigue el `exercise_id` al catálogo para sacar el nombre y la imagen. Del `target_sets` saca cuántos renglones vacíos pintarte: cuatro para el press de banca.

**4. Buscas lo de la vez pasada.** Antes de que anotes nada, la app busca tu registro más reciente de `ej-14` y te pone en gris `65 × 8`. No es un dato nuevo: es una consulta a lo que ya estaba guardado.

**5. Haces la primera serie y confirmas.** Se crea un renglón:

```
exercise_record · reg-201 → ses-55, ej-14, position 1
exercise_set    · reg-201, serie 1, 10 reps, 60.00 kg
```

El `exercise_record` se crea una sola vez, en la primera serie de ese ejercicio. Las siguientes tres series nada más agregan renglones a `exercise_set`.

**6. Se te hace tarde y te saltas el último ejercicio.** No pasa nada: simplemente no se crea su `exercise_record`. Lo que no se hizo, no existe. No hay "pendiente", no hay "incompleto".

**7. Le picas a Terminar.** Se actualiza un solo dato:

```
ses-55 · ended_at: 19:53
```

Y la pantalla de resumen calcula `19:53 − 19:05 = 48 minutos`. Ese número no se guarda en ningún lado.

**8. Dos semanas después abres el progreso.** La app toma todos tus `exercise_set` de `ej-14`, los agrupa por la fecha de su sesión, y de cada día se queda con el peso más alto. Eso son los puntitos de la gráfica.

Para el 14 de octubre: de 60, 65, 65 y 67.5 → el punto es **67.5 kg**.

---

## 6. Qué pasa si borras o cambias algo

La tabla que más tranquilidad da:

| Si haces esto | Pasa esto |
|---|---|
| Le cambias el nombre a una rutina | Todo sigue igual. El nombre vive en un solo lugar |
| **Borras una rutina** | Los días de tu semana que la usaban se quedan vacíos, o sea **pasan a ser descanso**. Tu historial no se toca |
| Le quitas un ejercicio a una rutina | Deja de aparecer al entrenar. Lo que ya habías registrado de ese ejercicio **se queda, y su gráfica también** |
| Borras una sesión de entrenamiento | Se va esa sesión con sus registros y sus series. Es el único borrado que sí se lleva datos, y por eso pide confirmación |
| Nosotros corregimos un nombre del catálogo | Se corrige en todas las rutinas de todos los usuarios de golpe. Para eso es un catálogo |
| Borras tu cuenta | Se va todo lo tuyo. El catálogo no, porque no era tuyo |

Hay un detalle que parece contradicción y vale la pena entender, porque es la única vez que un dato está repetido a propósito.

**`routine_session` guarda el nombre de la rutina copiado, pero `routine_exercise` no guarda el nombre del ejercicio.** ¿Por qué una sí y la otra no?

Porque son cosas distintas:

- Un **ejercicio de rutina** es parte de un plan **vivo**. Si mañana corregimos "Press de banca" en el catálogo, tu rutina debe mostrar el nombre corregido. Por eso solo apunta, no copia.
- Una **sesión terminada** es un **hecho del pasado**. "El lunes entrenaste Espalda y bíceps" sigue siendo verdad aunque después le cambies el nombre a esa rutina o la borres. Si no copiáramos el nombre, al borrar la rutina el historial se quedaría sin etiqueta.

La regla: **lo vivo apunta, lo histórico copia.**

---

## 7. Cuatro cosas que la app calcula, no guarda

Podrían ser columnas y a propósito no lo son. Si se guardaran, habría que acordarse de recalcularlas cada vez que algo cambia — y el día que se nos olvide, el dato miente.

| Qué | De dónde sale |
|---|---|
| **Cuánto duró el entrenamiento** | La hora de fin menos la de inicio |
| **El punto de la gráfica de un día** | El peso más alto de ese día en ese ejercicio |
| **Tu récord** | El peso más alto de toda tu historia en ese ejercicio |
| **Lo que hiciste la vez pasada** | Tu registro más reciente de ese ejercicio |

---

## 8. Si quieres ver más

- **El diagrama dibujado:** [`assets/data-model.html`](assets/data-model.html). Ábrelo en el navegador. Si pasas el mouse sobre una tabla, se iluminan nada más sus relaciones y las demás se desvanecen — es la forma más fácil de entender una tabla a la vez.
- **La versión técnica:** [`DATA-MODEL.md`](DATA-MODEL.md). Ahí están los tipos de dato, las reglas que la base de datos hace cumplir sola y por qué cada borrado se comporta como se comporta.
- **Qué se va a construir:** [`SRS.md`](SRS.md), en inglés. Las decisiones numeradas de la D1 a la D36 están en la sección 4.

---

## 9. Lo único que sigue sin decidir

Nada más una cosa del modelo, y es chica:

**¿Se puede entrenar dos veces el mismo día?** Hoy nada lo impide: podrías tener dos sesiones con la misma fecha. Nunca lo platicamos. Si la regla es una por día, se le pone un candado a la base de datos; si quieres permitir mañana y tarde, se queda como está.

Dinos cuál y queda cerrado.
