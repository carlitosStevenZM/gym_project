# Product Discovery — App de gimnasio

Este documento es **de dónde salió todo**: la idea original, las dos rondas de preguntas, las respuestas y la investigación que las sustentó. Es un archivo histórico — se lee para entender *por qué* se decidió algo, no para saber *qué* hay que construir.

**Qué construir está en [`SRS.md`](SRS.md).** Si los dos documentos se contradicen, manda el SRS.

Nada de aquí se edita hacia atrás. Lo que cambia de opinión se registra en la tabla de decisiones del SRS.

## Cómo se llegó hasta aquí

| Cuándo | Qué pasó | Dónde quedó |
|---|---|---|
| — | Carlos escribe la idea del producto | §1 de este documento |
| — | Primera ronda de preguntas, contestada por él | §2 |
| 10 oct 2026 | Segunda ronda de preguntas, en lenguaje llano | §3 |
| 10 oct 2026 | Investigación de apps existentes y respuestas propuestas | §4 |
| 10 oct 2026 | Borrador de SRS v0 y prototipo navegable | `SRS.md`, `assets/prototype.html` |
| 15 oct 2026 | Reunión de revisión: se cierra el modelo de dominio | §5 y la tabla de decisiones del SRS |

---

## 1. La idea original

> Escrito por el dueño del producto, sin editar. Era el documento `contexto-v1.md`.

Es una app para que las personas que van al gimnasio puedan registrar sus rutinas sus rutinas de ejercicio de forma organizada
y detallada, esta app esta enfocada en la personalizacion completa de las rutinas, desde dias de la semana, grupos musculares,
ejercicios y series. Asi la persona podra llevar un registro detallado de su progreso en el gimnasio, asi como poder consultar
estadisticas del margen de mejora a lo largo del tiempo.

### Para quien es?

Esta app esta diseñada para personas que van al gym, y quieren tener siempre una rutina organizada, asi como para las personas que
quieran medir sus progresos en el gimnasio. No esta hecha para entrenadores ni para dueños de gimnasio(de momento).

### Que problema resuelve?

Resuelve el problema de que la gente principalmente nuevos, se les olvida la rutina y tienen que preguntar a entrenadores que
muchas veces estan ocupados, asi como tambien el problema de que mucha gente no lleva un control o una medicion de su progreso
y eso hace que se puedan sentir estancadas. Esta app lleva un control organizado y de facil acceso para cualquier persona.

### Funcionalidad de negocio

#### Armar rutinas

Quiero poder armar mis rutinas dia a dia, o crear una rutina semanal que se repetira a lo largo del tiempo hasta que se cambie
En esta rutina semanal se podran escoger los dias de la semana que se entrenaran, que grupos musculares se van a entrenar los dias
de entrenamiento, que ejercicios de cada grupo muscular y cuantas series de ese ejercicio especifico quieres realizar.

#### Consultar rutinas

Una vez armada una rutina, la persona puede simplemente puede meterse a consultar su rutina semanal, por lo que tendra un facil acceso
a ver como esta estructurada esa rutina que hizo en caso de que se le haya olvidado, podra ver que dia entrena, que grupo muscular entrena
y cuantas series le toca hacer por ejercicio.

#### Registrar progreso

La persona una vez en el gimnasio hara su rutina normal, y podra registrar su progreso de cada ejercicio conforme vaya acabando las series

#### Ver progreso

Esta funcion mostrara una serie de datos tomados directamente de los entrenamientos como el peso y el numero de repeticiones.
Por lo que se podra hacer diferentes graficas o mediciones de progreso en diferentes lapsos de tiempo(semana, mes, año).

### Funcionalidades Tecnicas

#### Autentificacion con servicios google

El usuario podra acceder con su cuenta de google.

#### Autentificaion con usuario y contraseña

El usuario tiene la opcion de poder crear una cuenta con usuario y contraseña (que no sean de google)

#### JWT

Uso de jason web token para el uso autorizar el inicio de sesion

#### Refresh Tokens

Para seguir estando autorizado

#### Manejo de excepciones

Para que los errores sean siempre claros

---

**Si quieres agregar mas cosas, agrega mas cosas a lo tecnico sobre todo jeje**

---

## 2. Primera ronda de preguntas

> Preguntas y respuestas tal como se escribieron. Sin editar.

Estas preguntas son para que puedas contestarlas y entender un poco mas el scope de la aplicacion y de donde tenemos que tomar la informacion para complementar las funcionalidades principales que anotaste.

1.- Una rutina es una serie de ejercicios con N repeticiones cada una (a nivel general), pero ya bajado mas a detalle de que se conforma? solo una lista de ejercicios donde te dice que ese lo tienes que hacer N veces? o son un grupo de ejercicios que se hacen N veces?

Respuesta:  La serie se conforma por el grupo muscular que se va a trabajar(pectoral, deltoide, cuadricep), para cada grupo muscular hay una serie de ejercicios(curl de bicep, press inclinado, extension de cuadricep), de esos ejercicios son el numero de series N que se van a trabajar: Rutina->GrupoMuscular->N series-> Repeticiones.

2.- Quien define las rutinas? es una recomendacion de la app? si si, como se hace esta recomendacion? bajo que conceptos o reglas?, y si no es la app quien recomienda, intenta bajar un poco mas a detalle como se crea una rutina, cual crees que pueda ser la mejor experiencia? con un paso a paso nos sirve, diagrama todavia no

Respuesta: De principio me gustaria que fuera manual, que el usuario tenga ejercicios de orden general (pecho, pierna, espalda) y que dentro de estos ya esten grupos musculares mas especificos, y que pueda seleccionar de esos los que quiera, talvez con una ayuda visual de que parte del musculo entrena (imagen o gifs). Pero si me gustaria implementar a futuro un subagente encargado de darle una rutina al usuario(pero eso seria despues)
El paso a paso es que el usuario selecciona crear rutina, primero selecciona los dias de la semana que va a entrenar, despues en otra pantalla, el usuario selecciona el numero de ejercicios que quiere hacer en forma de lista, boton(+) para agregar un slot de ejercicios y (-) para disminuir, si selecciona un slot, aparece otra lista a un lado de grupo muscular general(pecho, espalda, pierna, brazo), selecciona uno, y aparece un grid con los ejercicios especificos de ese grupo muscular. y ese ciclo se repite hasta que complete los n ejercicios que puso al principio, le da a boton confirmar y esa seria la rutina del lunes por ejemplo.

3.- Hablas de grupos musculares, esos grupos musculares siempre son los mismos? nosotros en la app tenemos que definir un catalogo de "grupos musculares"? o el usuario puede agregar mas "grupos musculares"?

Respueta: Nosotros tenemos que tener un catalogo de grupos musculares, el usuario no.

4.- Puedes crear una "rutina semanal" o algo por el estilo? es decir, yo puedo decirle a la app, que esta semana voy a utilizar esta X rutina que ya previamente cree para que me muestre la semana con esa rutina o dia con dia la voy seleccionando? y si si es configurable por dias/semana, como crees que debe ser esta experiencia/funcionalidad? debe haber algun recordatorio? que pasa cuando un usuario no hace la rutina que configuro para el martes? (suponiendo que si es configurable) 

Respuesat: Si es configurable, la configuracion por defecto es rutina semanal, no por dia, ni por mes. Tu puedes crear mas de una rutina semanal, y puedes cambiarla el dia que quieras, por ejemplo si tu rutina original era martes-pierna, y ese mismo martes quieres mejor usar la otra en la que es martes-pecho, se cambia sin problema. Lo importante es que registre sus progresos, si deberia haber un recordatorio pero nada invasivo, solo una noti, por que si no hace la rutina, pues se toma como que no hizo nada, se toma como que no entreno ese dia.

5.- Cuando hablamos de ver progreso? esto como se ve en la aplicacion? osea es progreso por rutina? por grupo muscular? por peso? para entender un poco mas como organizar esta info, y ademas esto lleva algunos calculos de algo? como se ven las graficas que mencionas? es decir, que se toma como base? el tiempo y que mas? calorias calculadas (que por cierto, esto tambien debe ir?), peso cargado? tiempo?

Respuesta: el progreso se deberia de ver por ejercicios, en una grafica. El progreso guarda las repeticiones y el peso, entonces puedes checar con tal peso hizo tal cantidad de repeticiones, o por puro peso, de que en el lapso de un 2 meses cargas un 15% mas de peso. entonces las 2 formas que se me ocurren ahorita seria relacion peso-repeticiones y peso-tiempo, no sin calorias, solo el peso que es el factor mas importante. Y con los graficos yo creo que el que mas le queda seria un grafico lineal.

---

## 3. Segunda ronda de preguntas

> Escrita el 10 de octubre en lenguaje llano, con opciones cerradas, para que fuera fácil de contestar.
>
> **No se contestó por escrito.** La reunión del 15 de octubre (§5) la cubrió casi completa. Se conserva porque las preguntas siguen siendo el mapa de lo que había que resolver, y porque las pocas que quedaron sin tocar fueron justo los huecos que hubo que cerrar después.

Con lo que contestaste la vez pasada quedó mucho más claro hacia dónde va la app. Ahora necesito afinar unos detalles antes de empezar a construirla, porque son cosas que si las decidimos mal al principio, luego cuesta mucho cambiarlas.

Casi todas son de opción: nada más dime cuál te late (A, B o C) y, si quieres, por qué. Si ninguna te convence, escribe la tuya. Si alguna no la tienes clara todavía, dímelo así tal cual: "no sé" también es una respuesta útil.

---

### Cómo le vamos a llamar a las cosas

En los documentos usamos la palabra **"serie"** para tres cosas distintas y me estoy haciendo bolas. Quiero que fijemos las palabras de una vez para que las dos le digamos igual.

Esta es mi propuesta:

- **Ejercicio** → press inclinado, curl de bíceps
- **Serie** → una tanda del ejercicio. Si haces 4 tandas de 10 repeticiones, son 4 series
- **Repetición** → cada movimiento dentro de una serie
- **Rutina** → el plan de toda la semana (lunes pecho, miércoles pierna...)
- **Día de entrenamiento** → lo que te toca un día concreto de esa rutina
- **Entrenamiento** → lo que de verdad hiciste ese día en el gym

**1. ¿Te parecen bien esas palabras o cambiarías alguna?**

> Te pregunto esto porque estas palabras van a terminar siendo los nombres de los botones y las pantallas de la app. Si no nos ponemos de acuerdo ahora, después cada quien va a entender cosas distintas.

---

### Cómo se organizan los ejercicios

**2. Cuando el usuario va a escoger un ejercicio, ¿cuántos "menús" pasa antes de llegar a él?**

- **A)** Dos pasos: escoge **Pecho** → y ahí le salen todos los ejercicios de pecho
- **B)** Tres pasos: escoge **Pecho** → luego **pectoral superior** → y ahí le salen los ejercicios de esa parte

> En tu respuesta anterior pusiste las dos cosas: primero dijiste que dentro de pecho hay grupos más específicos, pero en el paso a paso ibas de "pecho" directo a los ejercicios. Solo necesito saber cuál de las dos querías.

**3. ¿Como cuántos ejercicios distintos crees que debería tener la app desde el día uno? ¿30, 60, 150?**

> Es para saber qué tan grande es la lista que hay que armar.

**4. Esa lista de ejercicios (nombre, a qué músculo le pega, la imagen o gif), ¿quién la va a armar?**

- **A)** Tú, porque sabes del tema
- **B)** Entre los dos
- **C)** No habíamos pensado en eso

> Ojo con esto: armar esa lista con imágenes es bastante más trabajo de lo que parece, y la app no sirve de nada sin ella. Mejor saber desde ahora quién se la avienta.

---

### Qué dice exactamente una rutina

**5. Cuando armas tu rutina, ¿qué tanto detalle le pones de antemano?**

- **A)** Solo el ejercicio y cuántas series. El peso y las repeticiones los anotas en el gym, lo que te salga ese día
- **B)** También pones una meta: "press inclinado, 4 series de 10 repeticiones con 40 kg", y en el gym anotas si lo lograste o no

> Esto cambia por completo la pantalla que vas a ver en el gimnasio. En la A la app te pregunta "¿qué hiciste?"; en la B te dice "esto te toca" y tú dices si lo cumpliste.

**6. ¿Importa el orden de los ejercicios dentro del día, o da igual en qué orden los hagas?**

> Si importa, hay que dejar moverlos de posición.

---

### Cambiar de rutina

Dijiste que si el martes te tocaba pierna pero quieres hacer pecho, puedes cambiarte sin problema. Necesito entender qué esperas que pase **el martes siguiente**.

**7. Cambias el martes de pierna a pecho. ¿Qué pasa la próxima semana?**

- **A)** Vuelve a salir pierna. Lo de hoy fue solo por hoy
- **B)** Sigue saliendo pecho, porque me cambié de rutina y ahí me quedo
- **C)** Que la app me pregunte

**8. Si llevas dos meses usando una rutina y le quitas un ejercicio, ¿qué esperas que pase con lo que ya habías registrado de ese ejercicio?**

- **A)** Que se quede guardado y pueda seguir viendo esa gráfica, aunque ya no lo haga
- **B)** Que desaparezca junto con el ejercicio

> Es la pregunta más importante de todas. Si contestas B y luego cambias de opinión, recuperar ese historial ya no se puede.

---

### Qué cuenta como "sí entrené"

**9. Tenías 5 ejercicios programados y nada más hiciste 3 porque se te hizo tarde. ¿Qué debería hacer la app?**

- **A)** Guardar los 3 y marcar el día como entrenado
- **B)** Guardar los 3 pero marcar el día como incompleto
- **C)** No contarlo, porque no terminé

**10. ¿La app debe dejarte anotar un ejercicio que NO estaba en tu rutina de ese día?** (llegaste, la máquina estaba ocupada y te fuiste por otra)

- **A)** Sí, debe dejarme
- **B)** No, solo lo que estaba planeado

**11. ¿Cómo se "cierra" el entrenamiento del día?**

- **A)** Yo le pico un botón de "terminar entrenamiento"
- **B)** Solo, cuando se acaba el día
- **C)** Ni se cierra, simplemente voy anotando

---

### Las gráficas de progreso

Aquí necesito que me ayudes con algo muy concreto, porque para dibujar una gráfica necesito **un solo número por día**, y en un día haces varias series con pesos distintos.

**12. Digamos que el lunes hiciste press inclinado así:**

- Serie 1: 10 repeticiones con 40 kg
- Serie 2: 8 repeticiones con 45 kg
- Serie 3: 6 repeticiones con 50 kg

**En la gráfica de "cómo voy en press inclinado", ¿qué punto debería aparecer para ese lunes?**

- **A)** 50 kg, el más pesado que levanté
- **B)** 45 kg, el promedio
- **C)** El total movido ese día (las repeticiones por el peso de cada serie, todo sumado): 1.000 kg
- **D)** Que la gráfica muestre las 3 series por separado

> Cuando dices "en dos meses cargo 15% más", ese 15% sale de comparar este número. Por eso necesito que escojas cuál.

**13. ¿Los pesos en kilos o en libras? ¿Y qué hacemos con los ejercicios donde no hay kilos que anotar — dominadas, lagartijas, o máquinas que vienen marcadas por niveles (1, 2, 3) en vez de kilos?**

---

### Dónde y cómo se usa

**14. ¿Dónde te imaginas usando la app?**

- **A)** En el celular, nada más
- **B)** En el celular en el gym, y en la compu desde la casa para armar las rutinas
- **C)** En la página web, abierta desde donde sea

**15. En el gimnasio donde entrenas, ¿agarra bien el internet del celular?**

> No es pregunta ociosa: si la app necesita internet para anotar cada serie y en el gym no hay señal, no sirve. Si me dices que la señal es mala, hay que construirla de otra forma desde el principio.

**16. La notificación que mencionaste: ¿a qué hora llega y qué dice?** Algo como "hoy te toca pecho" en la mañana, o "no has registrado tu entrenamiento" en la noche.

---

### Lo último, y es la más importante

**17. Si tuviéramos que sacar una primera versión en unos pocos meses, y solo nos diera tiempo de hacer bien 2 o 3 cosas de todo lo que platicamos, ¿cuáles serían?**

Por ejemplo: ¿preferirías una app donde puedas armar tu rutina y consultarla, aunque todavía no tenga gráficas? ¿O las gráficas son justo lo que la hace valiosa?

> No es para recortar la idea, es para decidir qué construimos primero. Todo lo demás sigue en la lista.

---

### Y si tienes 15 minutos extra

Esto me sirve más que todas las preguntas juntas. Cuéntame tres historias, como si me las platicaras:

1. **"Es domingo en la noche y voy a armar mi rutina de la semana."** ¿Qué abres, qué picas, qué ves en cada pantalla, hasta que terminas?
2. **"Es martes, acabo de llegar al gym."** ¿Qué haces con el celular? ¿Lo sacas entre serie y serie? ¿Qué anotas y en qué momento?
3. **"Ya pasaron dos meses y quiero ver si estoy mejorando."** ¿Qué abres y qué esperas ver en la pantalla?

Cuéntalas como te salgan, sin cuidar la redacción. De esas tres historias sale casi todo lo demás.

---

## 4. Respuestas propuestas desde la investigación

> Elaboradas el 10 de octubre revisando cómo resuelven cada punto Hevy, Strong, FitNotes y JEFIT. **No son las respuestas del dueño del producto**: eran una propuesta para que no tuviera que contestar en el vacío.
>
> Varias se aceptaron, otras se rechazaron en la reunión. Lo que terminó valiendo está en el SRS; esto explica el razonamiento y trae las fuentes.

**Qué es esto:** no son las respuestas de Carlos. Son las respuestas que yo propondría después de revisar cómo resuelven cada punto las apps consolidadas de esta categoría (Hevy, Strong, FitNotes, JEFIT) y qué dicen los usuarios que funciona.

**Para qué sirve:** para que él no conteste en el vacío. Es más fácil decir "esto sí, esto no" sobre una propuesta concreta que inventar desde cero. Todo aquí es discutible.

---

### El hallazgo más importante

El documento original asume un modelo **centrado en el calendario**: existe una rutina semanal, esa rutina dice qué toca el martes, y la app te muestra el martes.

Las apps de esta categoría convergieron en un modelo distinto, **centrado en plantillas**:

> Una **rutina** es una plantilla reutilizable que vive en una lista, no en un calendario. Cuando llegas al gym, abres la app y eliges qué rutina vas a hacer hoy. El calendario, si existe, es solo una sugerencia encima de las plantillas.

En Hevy las rutinas se guardan en carpetas "para completarlas cuando quieras", y la asignación a días de la semana es un extra opcional (un widget de "rutina del día"), no la estructura base. En Strong empiezas una sesión vacía o reutilizas una plantilla.

**Por qué importa:** este cambio disuelve solo las preguntas 7, 9, 10 y 11. Si la rutina no está amarrada al calendario, "cambiarme de pierna a pecho el martes" deja de ser un caso especial que hay que programar: simplemente abriste otra plantilla. Y el historial nunca queda "incompleto" ni "saltado", porque nunca hubo una cita que incumplir.

**La recomendación es conservar la idea de la rutina semanal, pero degradarla de estructura obligatoria a capa de sugerencia.** Se gana flexibilidad sin perder lo que él quería (abrir la app y que te diga qué toca hoy).

---

### Las respuestas, una por una

#### 1. Vocabulario

**Se acepta tal cual**, con un agregado necesario:

| Palabra | Significado |
|---|---|
| Ejercicio | Press inclinado, curl de bíceps |
| Serie | Una tanda. 4 series de 10 reps = 4 tandas |
| Repetición | Cada movimiento dentro de una serie |
| **Rutina** | **Una plantilla reutilizable: "Día de Pecho"**. No es la semana |
| **Programa** | **El conjunto de rutinas + su asignación opcional a días de la semana** |
| Entrenamiento | Lo que de verdad hiciste un día. Es un registro histórico, inmutable |
| Registro de serie | Peso + repeticiones de una serie concreta que ya hiciste |

El agregado es separar **Rutina** (plantilla) de **Programa** (la semana). En el documento original los dos conceptos estaban fundidos en "rutina semanal" y ahí nacía la ambigüedad.

#### 2. ¿Dos o tres niveles para llegar al ejercicio?

**Dos niveles en la pantalla, tres en los datos.**

El usuario navega: **Pecho** → lista de ejercicios de pecho. Nadie quiere pasar por tres menús parado frente a una máquina.

Pero en la base de datos cada ejercicio guarda además su **músculo primario** (pectoral superior, pectoral medio) y sus **músculos secundarios**. Eso no se usa para navegar: se usa para filtrar, para buscar y para las estadísticas de "qué tanto he entrenado cada músculo".

Así se cumplen las dos cosas que él dijo en su respuesta contradictoria, sin que ninguna estorbe.

**Nivel 1 (navegación):** Pecho · Espalda · Hombro · Bíceps · Tríceps · Pierna · Glúteo · Core · Cardio
**Nivel 2 (metadato):** el músculo específico + el equipo (barra, mancuerna, máquina, polea, peso corporal)

El filtro por **equipo** no estaba en ningún documento y es de los más usados en la práctica: "está ocupada la banca, ¿qué hago de pecho con mancuernas?".

#### 3 y 4. El catálogo de ejercicios: cuántos y quién lo arma

**Nadie lo arma a mano. Se parte de una base de datos abierta.**

Esta fue la sorpresa agradable de la investigación. Existen catálogos libres y ya con imágenes:

- **free-exercise-db** — 317 ejercicios, con videos/imágenes de demostración, instrucciones y errores comunes. **Licencia MIT**, o sea que se puede usar sin problema.
- **wger** — catálogo con grupos musculares, equipo e imágenes, API sin API key. Datos bajo Creative Commons.
- **ExerciseDB** — 11.000+ ejercicios con gifs. AGPL-3.0, que es más restrictiva y hay que revisarla con cuidado.

**Propuesta:** importar **free-exercise-db**, quedarnos con ~120–150 ejercicios (los 317 incluyen mucha variante rara que solo estorba), traducir los nombres al español a mano y revisar la clasificación.

Eso convierte el trabajo de Carlos de "producir 150 fichas con gifs" (semanas) a "revisar una lista ya hecha y corregir lo que esté mal clasificado" (una tarde). **Y lo más importante: elimina el riesgo legal de bajar gifs de internet**, que era el plan implícito.

> **Esto sigue necesitando su validación**, pero de otra cosa: que la lista traducida tenga sentido para alguien que entrena en México, y que no falte nada obvio.

#### 5. ¿La rutina incluye repeticiones y peso objetivo?

**Opción B, pero suave.** Esta es la convención universal y la razón es concreta.

La rutina guarda, por ejercicio: **número de series** y un **rango de repeticiones objetivo** (ej. "4 series de 8–12"). El peso objetivo **no** se guarda en la plantilla.

En el gym, al momento de registrar, la app **precarga en gris lo que hiciste la vez pasada** en ese mismo ejercicio. Ves "40 kg × 10" tenue; si repites lo mismo, confirmas de un toque; si subiste, lo escribes encima.

> Esta precarga es el detalle de UX más importante de toda la app. Es lo que hace que registrar una serie tome **dos toques** en vez de teclear todo. Todas las apps de la categoría lo hacen, y es la diferencia entre que alguien use la app seis meses o la abandone a la segunda semana.

El rango de repeticiones sí va en la plantilla porque es lo que te dice si debes subir peso ("si ya llegué a 12, la próxima subo"). El peso no, porque cambia cada sesión y el historial ya lo sabe.

#### 6. ¿Importa el orden de los ejercicios?

**Sí.** La rutina guarda un orden explícito y se puede reordenar arrastrando. Además, en el gym debe poder saltarse un ejercicio y hacerlo después sin romper nada (la máquina ocupada es la norma, no la excepción).

#### 7. Cambiar la rutina del martes

**La pregunta se disuelve con el modelo de plantillas.**

No hay un "martes = pierna" que cambiar. El martes abres la app, te sugiere "Pierna" porque así está tu programa, y tú le das a otra rutina. El programa queda intacto; el próximo martes vuelve a sugerir pierna. Equivale a la **opción A**, pero sin necesidad de programar un caso especial.

#### 8. Editar una rutina y el historial

**Opción A, sin negociación posible.**

El entrenamiento es un registro histórico **inmutable**: guarda el nombre del ejercicio, el peso y las reps tal como fueron ese día. Editar o borrar una rutina **nunca** toca el pasado. Si quitas un ejercicio de tu plantilla, su gráfica histórica sigue ahí.

La investigación lo confirma como práctica estándar: el historial de ejercicios se mantiene independiente de las plantillas, justo para poder comparar sin mezclar lo planeado con lo real.

**Esta es una decisión técnica que no debe depender de la respuesta de él.** Aunque dijera B, yo construiría A, porque B destruye datos irrecuperables y nadie entiende las consecuencias hasta que ya pasó.

#### 9. Entrenamiento a medias (3 de 5 ejercicios)

**Opción A: se guarda y cuenta como entrenamiento.** Sin marcas de "incompleto".

La convención es que **cualquier serie registrada constituye un entrenamiento**. Marcar días como incompletos es castigar al usuario por entrenar, que es exactamente lo contrario de lo que quieres. Si hizo 3 ejercicios, hizo 3 ejercicios, y eso vale.

Esto además corrige algo del documento original: ahí decía *"si no hace la rutina, se toma como que no entrenó"*. Con el modelo de plantillas, "no entrenó" simplemente significa que no hay ningún entrenamiento registrado ese día. No hace falta ninguna regla.

#### 10. Registrar un ejercicio fuera de la rutina

**Opción A: siempre se puede.** Y también: empezar un entrenamiento vacío, sin ninguna rutina, e ir agregando sobre la marcha. Ambas cosas son estándar y las dos se usan muchísimo.

#### 11. Cómo se cierra el entrenamiento

**Opción A: botón explícito de "Terminar entrenamiento".**

Con dos salvaguardas que la práctica enseñó:
- Mientras está abierto, **todo se guarda al instante**. Si se cierra la app o se muere la batería, no se pierde nada.
- Si un entrenamiento lleva abierto mucho tiempo (se le olvidó cerrarlo y ya es otro día), la app pregunta al volver: "¿terminaste este entrenamiento?".

Al terminar se muestra un **resumen**: duración, series totales, kilos totales movidos y los récords personales que rompió. Ese resumen es el momento de recompensa de la app.

#### 12. Qué número va en la gráfica — **la respuesta técnica más relevante**

Recordando el ejemplo: 10×40, 8×45, 6×50.

**Ninguna de las opciones por separado. Se guardan tres métricas y la principal es una cuarta que no estaba en la lista: el 1RM estimado.**

| Métrica | En el ejemplo | Qué dice |
|---|---|---|
| Serie más pesada | 50 kg | Simple, pero ignora las reps |
| Volumen total | 1.030 kg | Cuánto trabajo hiciste |
| **1RM estimado** | **61,3 kg** | **Qué tan fuerte eres, en un solo número** |

El **1RM estimado** es cuánto levantarías una sola vez si fueras al máximo. Se calcula con la fórmula de Epley:

```
1RM = peso × (1 + repeticiones / 30)
```

Para cada serie del día se calcula y se toma el mayor:
- 40 × (1 + 10/30) = 53,3
- 45 × (1 + 8/30) = 57,0
- **50 × (1 + 6/30) = 60,0** ← este

**Por qué es la métrica correcta** (y no solo mi preferencia): es la única que detecta progreso cuando el peso no sube. Si la semana pasada hiciste 50 kg × 6 y hoy haces 50 kg × 8, "el peso más pesado" dice que no avanzaste. El 1RM estimado dice que pasaste de 60 a 63,3. **Avanzaste y la app debe notarlo**, porque si no, el usuario siente que está estancado cuando no lo está — que es literalmente el problema que Carlos quería resolver.

Es la práctica consolidada: el 1RM estimado se considera la forma más limpia de ver la fuerza subiendo aunque los pesos de trabajo se queden quietos.

**Propuesta concreta:** gráfica lineal, un punto por sesión, con un selector arriba para cambiar entre **Fuerza (1RM est.)** · **Peso máximo** · **Volumen**. Por defecto, Fuerza.

Y el dato de "cargas 15% más en 2 meses" se calcula comparando el 1RM estimado de hoy contra el de hace 2 meses. Ese número sí se puede poner en grande.

#### 13. Unidades y ejercicios sin kilos

**Unidades:** kg por defecto, configurable a lb una sola vez en ajustes. Se guarda siempre en kg internamente y se convierte al mostrar.

**Para los ejercicios sin kilos**, cada ejercicio del catálogo lleva un **tipo de medición**:

| Tipo | Qué se registra | Ejemplos |
|---|---|---|
| Peso y reps | kg × reps | Press, sentadilla, curl |
| Solo reps | reps | Lagartijas, abdominales |
| Peso corporal + lastre | reps + kg extra (puede ser 0) | Dominadas, fondos |
| Carga sin unidad | número × reps | Máquinas por niveles |
| Tiempo | duración | Plancha |
| Distancia y tiempo | km + min | Caminadora |

Esto resuelve lo de las máquinas por niveles sin inventar nada: se guarda el número tal cual, se grafica tal cual, y simplemente no se suma al volumen total en kilos.

> **Lo único que aquí necesita decisión de producto** es si el cardio entra en la v1. Mi propuesta: **no**. La app es de fuerza. Meter cardio diluye el producto y las métricas.

#### 14 y 15. Plataforma e internet

**Celular, aplicación nativa, y tiene que funcionar sin internet.**

Esto no es opinable: la app se usa de pie, con una mano, entre series, en un sótano con señal mala. La convención en apps serias de esta categoría es **registro local primero, sincronización después** — Strong es conocido justamente por su comportamiento offline-first, y es una de las quejas recurrentes contra apps que no lo tienen.

En la práctica: **toda la sesión se escribe en el teléfono. La nube es un respaldo que se sincroniza cuando hay señal.** Jamás una pantalla de carga entre una serie y la siguiente.

La web queda para después, y si llega, solo para armar rutinas y ver estadísticas con calma.

#### 16. La notificación

**Una sola, opcional, y apagada por defecto hasta que el usuario la active.**

Propuesta: recordatorio a la hora que él elija, los días que su programa tenga rutina asignada. Texto: *"Hoy toca Pecho"* con un toque para abrir directo esa rutina.

**Lo que no se debe hacer:** notificaciones de "no has entrenado", rachas que se rompen, ni mensajes culpígenos. Son la razón número uno por la que la gente desinstala apps de fitness.

#### 17. La primera versión

**Lo mínimo que ya sirve son tres cosas, y las gráficas no son una de ellas:**

1. **Catálogo de ejercicios** con buscador e imagen
2. **Crear y consultar rutinas** (plantillas)
3. **Registrar el entrenamiento** con precarga de la sesión anterior, e **historial consultable**

Con eso la app ya resuelve el problema principal del documento original: *"se les olvida la rutina y tienen que preguntarle al entrenador"*. Y, crucialmente, **ya empieza a generar los datos**.

Las gráficas van inmediatamente después, en la v1.1, y son lo que hace que la gente se quede. Pero son inútiles en el día uno: una gráfica con tres puntos no le dice nada a nadie. **Hay que acumular semanas de datos antes de que valgan algo**, así que lo urgente es que el registro funcione bien y rápido, no que la gráfica esté bonita.

El programa semanal con notificación puede esperar a la v1.2.

---

### Cosas que la investigación trajo y que no estaban en ningún documento

Las anoto porque son convenciones tan asumidas que su ausencia se nota:

1. **Temporizador de descanso automático.** Terminas una serie y arranca solo una cuenta regresiva con aviso. Es de las funciones más usadas de la categoría y no aparece en ninguno de nuestros documentos. Probablemente debería estar en la v1.
2. **Récords personales.** Marcar con un distintivo cuando rompes tu mejor marca en un ejercicio. Es barato de construir y es el principal gancho emocional.
3. **Notas por ejercicio.** "La barra del gym pesa 15 kg", "bajar el asiento al 4". Un campo de texto y ya.
4. **Ejercicios personalizados.** Aunque el catálogo lo definimos nosotros, los usuarios acaban pidiendo agregar los suyos. Vale la pena dejar el hueco previsto en el modelo de datos aunque no se construya en la v1.
5. **Exportar los datos.** Un CSV. Es la red de seguridad del usuario y genera confianza.
6. **Superseries y drop sets.** Existen y la gente los usa, pero complican mucho el registro. **Fuera de la v1**, pero que el modelo de datos no los haga imposibles después.

---

### Fuentes

- [Hevy — Build a Workout Program: Create & Organize Routines](https://help.hevyapp.com/hc/en-us/articles/34953606698903-Build-a-Workout-Program-Create-Organize-Routines)
- [Hevy — How to Log & Track Workouts Easier and Faster](https://www.hevyapp.com/features/track-workouts/)
- [Setgraph — Workout Logging Apps Compared: Features for Lifters](https://setgraph.app/articles/best-app-to-log-workout-tested-by-lifters)
- [Sensai — Hevy vs Strong (2026): Verified Prices, Free Limits, and the Honest Winner](https://www.sensai.fit/blog/hevy-vs-strong-2026)
- [PRPath — Hevy vs Strong (2026): We Tested Both](https://prpath.app/blog/strong-vs-hevy-2026.html)
- [GymNotePlus — 6 Best Workout Tracking Apps in 2026](https://www.gymnoteplus.com/blog/best-workout-tracking-apps)
- [ICSS — The Comprehensive Guide to 1RM Calculators](https://theicss.org/2023/09/04/the-comprehensive-guide-to-1rm-calculators/)
- [StrengthLog — The Best 1RM Calculator](https://www.strengthlog.com/1rm-calculator/)
- [wger — Self hosted FLOSS fitness/workout tracker (GitHub)](https://github.com/wger-project/wger)
- [Free Exercise DB with Videos](https://exercise-database.zenithfits.com/)
- [ExerciseDB API (GitHub)](https://github.com/exercisedb/exercisedb-api)

---

## 5. La reunión del 15 de octubre de 2026

Revisión completa del borrador v0 y del prototipo, con el dueño del producto. De aquí salió el modelo de dominio y la mayoría de las decisiones del SRS.

**Minuta y transcripción completa:** `~/Documents/Obsidian Vault/Notas/Reuniones/2026-10-15-reunion-2026-10-15-19-37.md`
**Prototipo revisado en la reunión:** era la versión v0 de `assets/prototype.html`; ese archivo ya está al día con lo acordado, y en el panel de notas de cada pantalla se anota qué se quitó y por qué.
**Diagrama del modelo que se dibujó:** [`assets/domain-model-2026-10-15.png`](assets/domain-model-2026-10-15.png)

### Lo que cambió de fondo respecto al v0

| v0 (propuesta) | Acordado |
|---|---|
| Rutinas como plantillas sueltas, el calendario opcional | El **entrenamiento semanal** es la estructura principal |
| 1RM estimado como métrica de progreso | **Peso máximo** por ejercicio |
| Series dinámicas, ejercicios extra, entrenamiento libre | Nada de eso: el plan se respeta |
| Volumen como métrica secundaria | Descartado |
| Plataforma sin definir | **React Native**, Android e iOS |
| Offline primero | **La v1 requiere conexión** |

### Lo que se resolvió después de la reunión

Cuatro incongruencias que salieron al contrastar el diagrama con lo hablado:

1. La cantidad de series y las repeticiones objetivo estaban en el catálogo → nace `EjercicioDeRutina`
2. La duración estaba en el registro de ejercicio → nace `SesionDeRutina`
3. "Entrenamiento" nombraba al plan y a la realidad → se separó con "sesión de rutina"
4. La marca "más repeticiones" no estaba definida contra ningún peso → se quitó

Y se cerraron los nueve puntos que nunca se habían tocado: unidades, offline, catálogo, descanso, ejercicios sin kilos, series vacías, equipo, dónde se ven las rutinas y la métrica de progreso.

---

## 6. Dónde viven las decisiones ahora

En la **tabla de decisiones del SRS** (§4), numeradas de D1 a D36, cada una con su origen.

Este documento no se actualiza cuando algo cambia. Si una decisión se revierte, se registra allá y en su bitácora.
