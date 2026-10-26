# Cómo documentar un backend para que trabajen agentes

**Para:** Carlos

Esto explica **qué tipos de documento existen y para qué sirve cada uno**. No dice qué va adentro: la arquitectura, las reglas y las decisiones de esta app las defines tú.

---

## 1. Por qué molestarse

Dos cosas que pasan siempre cuando trabajas con un agente.

La primera es que lee el código y asume que lo que encuentra está bien. Si hay un patrón repetido veinte veces, lo copia, aunque sea justo el que querías dejar atrás. Tu repo le está enseñando sin que nadie lo haya escrito.

La segunda es que las reglas que no están escritas se pierden. Eso de "la lógica de negocio no va en la vista", o "este campo existe pero no se usa", vive en la cabeza de quien lo decidió. El agente no estuvo ahí, y en seis meses tú tampoco te vas a acordar del porqué.

La documentación para agentes es convertir en texto las decisiones que de otro modo solo viven en la costumbre. De paso le sirve igual a cualquier persona que entre al proyecto.

---

## 2. Un archivo de entrada que es índice, no manual

Va un archivo en la raíz que el agente lee siempre, y debe caber en dos o tres pantallas.

No explica el proyecto. Dice tres cosas: dónde vive cada tipo de documento, a quién hay que creerle cuando dos se contradicen, y qué leer según lo que estés tocando. Si crece a manual deja de servir, porque el agente gasta su atención en cosas que no aplican a la tarea.

Detalle práctico: cada herramienta quiere su propio archivo (`CLAUDE.md`, `.cursorrules`, `AGENTS.md`). Escribe uno solo y haz que los demás sean enlaces simbólicos a ese, para no acabar con tres fuentes de verdad desincronizadas.

---

## 3. Capas y orden de autoridad

Esta es la idea que organiza todo lo demás, y la que yo armaría primero.

La documentación se parte en capas, cada una con un trabajo distinto:

| Capa | Qué guarda |
|---|---|
| Referencia de arquitectura | La verdad estructural, en largo |
| Reglas operativas | Lo corto que el agente carga siempre |
| Decisiones | Por qué se eligió algo, fechado y ya no se edita |
| Glosario | Cómo se llaman las cosas en este dominio |

Y dos reglas que las mantienen ordenadas:

**Un documento vive en exactamente una capa.** Si lo mismo está en dos lados, tarde o temprano se contradicen. Lo que se hace es enlazar, no repetir.

**Hay un orden explícito de autoridad.** Cuando la referencia de arquitectura y una regla operativa dicen cosas distintas, el agente necesita saber a quién le cree. Y conviene escribir también la consecuencia: *si encuentras una contradicción, corrige la capa de menor prioridad para que empate con la mayor*. No la reporta y sigue, la arregla.

---

## 4. Los documentos que de verdad pesan en un backend

### El glosario

Un archivo con el vocabulario del dominio. Qué es cada concepto, en una o dos líneas.

El mejor truco que he visto aquí es que cada término traiga además una lista de **cómo NO llamarle**. Con lo nuestro se vería así:

> **Rutina.** La agrupación de ejercicios de un día, por ejemplo "Pecho y tríceps".
> *Evitar*: entrenamiento, sesión, día.

Eso resuelve un problema real. Sin esa lista cada quien usa el sinónimo que le late, y acabas con cuatro nombres para la misma cosa repartidos entre el código, los tickets y las conversaciones. Es justo el enredo que tuvimos con "rutina" y "entrenamiento semanal" antes de separarlos.

Ya tenemos la mitad hecha en el glosario del SRS, que además mapea español (como hablamos) contra inglés (como se nombra en el código). Lo que faltaría es esa columna.

### Las decisiones

En un backend este es el documento que más trabajo hace, y por mucho.

Es un archivo corto y numerado que registra una decisión de arquitectura: cuál era el problema, qué se decidió y por qué. Se fecha, se marca como aceptado y **ya no se edita**. Si la decisión cambia, se escribe otro que reemplaza al anterior. Un repo backend con un par de años acumula decenas.

Pesan tanto en backend porque ahí las decisiones no se ven en el código. Que la lógica de negocio viva en un servicio y no en el modelo, que los errores de dominio no carguen el código HTTP, que un módulo no deba importar los internos de otro: nada de eso se deduce leyendo un archivo. O está escrito o se pierde.

Hay una instrucción buena para darle al agente: **si lo que vas a proponer contradice una decisión ya registrada, dilo en voz alta en vez de pasarle por encima.**

Nuestra tabla D1 a D36 del SRS es el mismo mecanismo en versión chica. Lo de ustedes puede seguir así un buen rato; el archivo por decisión se justifica cuando una necesita media página de contexto, no una fila de tabla.

### Arquitectura, con reglas de disciplina

Dos partes.

Primero el mapa: cuáles son las capas y en qué dirección fluyen. Cabe en una línea, del tipo `Petición → Vista → Serializador → Servicio → Repositorio → Modelo`, y luego una frase por capa diciendo qué sí y qué no le toca. Cuáles sean las capas es cosa tuya.

Segundo, y esto es lo que lo vuelve útil, una lista numerada de **reglas de disciplina** que apliquen a todo código nuevo. Cosas verificables en una revisión: "toda la lógica de negocio nueva va en servicios", "las vistas no hacen consultas", "los servicios lanzan errores de dominio, no excepciones del framework". Cada una apuntando a la decisión que la respalda.

La diferencia entre describir una arquitectura y poder exigirla está justo ahí. Una descripción se interpreta; una regla numerada se cumple o no se cumple.

### Antipatrones con nombre

Esta es la que menos se le ocurre a la gente y a mí me parece la más inteligente.

Además de decir qué hacer, ponle **nombre a las formas equivocadas**. Dos ejemplos de los que se usan seguido: un *servicio superficial* es un servicio cuyo método público solo reenvía argumentos sin agregar nada, y una *violación de costura* es importar los internos de otro módulo en vez de pasar por su interfaz pública.

Ponerle nombre a algo malo lo vuelve señalable. En una revisión puedes decir "esto es un servicio superficial" y los dos saben exactamente de qué hablan, con su definición y su arreglo. Sin el nombre la conversación es "siento que esto sobra" y no llega a ningún lado.

### Convenciones de desarrollo

Lo aburrido pero necesario, en un archivo aparte y corto: con qué se instalan las dependencias, qué formateador corre, el largo de línea, si los tipos son obligatorios, qué necesita tests. Es lo primero que un agente hace mal si no se lo dices.

### Contratos transversales

Cuando algo atraviesa todo el proyecto, se documenta **una vez** y todo lo demás apunta ahí. El ejemplo clásico es el manejo de errores: un solo contrato de cómo un error de negocio llega al cliente, con su ejemplo de código, y los demás documentos lo referencian.

En el de ustedes los candidatos serían autenticación, errores y acceso a datos. Pero solo cuando ya exista la decisión, no antes.

---

## 5. Qué evita que todo se pudra

**El documento se actualiza en el mismo PR que el código.** No después, no en un ticket aparte. Un cambio de comportamiento sin su documento está incompleto, y eso se marca en la revisión. "Luego lo documento" nunca pasa, y un documento desactualizado es peor que no tenerlo porque alguien le va a creer.

**Lo que se puede regenerar, se regenera.** Hay documentación que un programa puede reconstruir leyendo el código, como la referencia de endpoints. Esa no la mantengas a mano: déjala como un comando que vuelves a correr después de cada cambio grande.

**No escribas lo obvio.** Un documento se gana su lugar cuando el conocimiento es difícil de reconstruir leyendo el código: un mecanismo regado en diez archivos, un contrato con otro servicio, una decisión que no se ve. Si alguien lo encuentra en treinta segundos abriendo un archivo, no lo escribas.

---

## 6. Qué tener desde el primer commit

Advertencia que me importa: **un sistema de documentación maduro es la respuesta a problemas que ese repo ya tuvo.** Años de historia, deuda que se paga por partes, equipos que se pisan. Copiar todo eso a un proyecto vacío es escribir reglas sobre un pasado que no existe.

Lo que yo sí tendría desde el día uno, en este orden:

1. **El archivo de entrada**, aunque apunte a dos documentos.
2. **El orden de autoridad**, aunque sean tres capas.
3. **El glosario.** Ya existe en el SRS, solo hay que decidir si vive ahí o se mueve al repo del código.
4. **Arquitectura con sus reglas de disciplina.** Aunque sean cinco líneas y cuatro reglas. Esto es lo que más rinde al principio, porque es justo lo que el agente no puede deducir de un repo vacío.
5. **Convenciones de desarrollo.** Diez minutos de escribirlo y te ahorra corregir lo mismo veinte veces.
6. **La regla de actualizar el documento en el mismo PR.** Si no está desde el principio, nunca se adopta.

Lo que dejaría crecer solo: las decisiones en archivo propio aparecen cuando una no quepa en una fila de tabla; los antipatrones aparecen cuando le hayas dicho lo mismo al agente tres veces; los documentos de feature aparecen cuando una parte se vuelva difícil de reconstruir leyendo el código.

### Sobre el código viejo, que todavía no tienes

Tienes razón en no descartar el tema. No aplica hoy, pero vale saber cómo se maneja, porque la deuda empieza a acumularse antes de lo que uno cree.

No hace falta un documento de "código legado". La forma que funciona es otra: cuando tomes un atajo a propósito, **ponle nombre, escribe la decisión que lo registra y deja dicho cuándo se paga**. Normalmente la regla es "se arregla cuando alguien lo toque", no "algún día hacemos un refactor". Y la lista de los casos pendientes vive en esa misma decisión, como apéndice.

Lo que hay que tomar es el reflejo: **el día que tomes un atajo a conciencia, escríbelo en ese momento.** Si no, en tres meses está repetido en todas partes y nadie se acuerda de que era temporal.

---

## 7. Errores típicos

**Que el archivo de entrada se vuelva manual.** Crece hasta que ya nadie lo lee completo.

**Decir lo mismo en dos capas.** Tarde o temprano se contradicen y ya no sabes cuál vale.

**Documentar planes en vez de realidad.** "Vamos a migrar a X", "pendiente refactorizar Y". Eso es tu backlog y vive en otro lado. El documento describe lo que es, en presente.

**Dejar que el documento le gane al código.** En cuanto un documento afirma algo que el código no hace, todo el conjunto pierde credibilidad. Por eso cada documento apunta a los archivos de donde sale la verdad: para que cualquiera te pueda comprobar.

**Escribir solo para el agente.** Si el documento solo se entiende como instrucción para una máquina, no le sirve a la persona nueva, y entonces acabas escribiendo dos.

---

## 8. Cómo se vería en tu repo

Un ejemplo de los archivos que tendrías que escribir. Los nombres y la forma son tuyos; esto es para que veas el tamaño de la tarea, que es más chica de lo que suena.

```
AGENTS.md                         índice, orden de autoridad, qué leer y cuándo
CLAUDE.md -> AGENTS.md            enlace simbólico, mismo contenido

docs/
├── CONTEXT.md                    glosario del dominio, con qué evitar
├── agents/
│   ├── architecture.md           capas, dirección y reglas de disciplina
│   ├── development-rules.md      dependencias, formato, tipos, tests
│   └── git-workflow.md           ramas, PRs, convención de commits
└── decisions/
    └── 0001-<lo-que-decidiste>.md
```

Qué contesta cada uno:

| Archivo | La pregunta |
|---|---|
| `AGENTS.md` | ¿Qué leo y a quién le creo? |
| `CONTEXT.md` | ¿Cómo se llaman las cosas aquí? |
| `architecture.md` | ¿Quién depende de quién, y qué no se vale? |
| `development-rules.md` | ¿Cómo se escribe y se prueba el código aquí? |
| `git-workflow.md` | ¿Cómo entra un cambio? |
| `decisions/` | ¿Por qué está así y no de otra forma? |

Eso son seis archivos, y cuatro de ellos caben en una pantalla. Lo demás llega cuando haga falta.
