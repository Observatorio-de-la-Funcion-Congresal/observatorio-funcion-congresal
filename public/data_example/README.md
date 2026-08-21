# Estructura de Datos - Observatorio Congresal

Este documento describe la estructura de los objetos principales de la aplicación: **Candidate** (Candidato) y **Party** (Partido). Cada objeto representa una entidad individual dentro del sistema.

---

## 📋 Objeto: Candidate

El objeto `Candidate` contiene toda la información detallada de un candidato/congresista, incluyendo su desempeño parlamentario, proyectos de ley, comisiones, votos y promesas.

### Propiedades Básicas

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **id** | `number` | Identificador único del candidato. Se utiliza como parámetro de ruta en la página `/candidato/[id]` |
| **picture** | `string` | URL de la foto del candidato. Utilizada en las tarjetas de candidato y pagina de detalle. Patrón: `/{id}.jpg` |
| **name** | `string` | Nombre completo del candidato. Mostrado en el nombre de la página, hero y tarjetas |
| **region** | `string` | Región/departamento donde el candidato es candidato o fue elegido (ej: "Lima", "Cusco") |
| **party** | `string` | Nombre del partido político al que pertenece |
| **partyId** | `number` | ID del partido para referencias cruzadas con datos de `Party` |
| **applyTo** | `string` | Posición a la cual se postula o fue elegido (ej: "Diputado", "Senador", "Diputada") |
| **biography** | `string` | Descripción textual de la trayectoria profesional y académica del candidato. Se muestra en la sección "Biografía" de la página de detalle |

### Propiedades de Asistencia y Actividad

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **attendance** | `number` | Porcentaje de asistencia a sesiones parlamentarias (0-100) |
| **abstentions** | `number` | Cantidad/porcentaje de abstenciones en votaciones |
| **projects** | `number` | Cantidad de proyectos de ley presentados por el candidato |
| **motions** | `number` | Cantidad de mociones o propuestas presentadas |
| **commissions_count** | `number` | Cantidad de comisiones en las que participa el candidato |

> **Nota:** `attendance`, `abstentions`, `commissions_count` y `projects` solo se muestran en las tarjetas de congresistas cuando `HAS_CONGRESISTA_ACTIVITY_DATA` (en `src/constants.ts`) es `true`; en caso contrario se muestra el mensaje "Datos de actividad no disponibles aún".

### Objeto: performance

Contiene métricas detalladas sobre el desempeño parlamentario del candidato.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **attendance** | `number` | Porcentaje de asistencia (0-100) |
| **abstentions** | `number` | Número o porcentaje de abstenciones |
| **session_week** | `number` | Participación en sesiones de la semana |
| **accomplishment** | `number` | Índice de cumplimiento/logro (0-100) |
| **projects** | `number` | Cantidad de proyectos (valor para gráficos) |
| **participation** | `number` | Nivel de participación en debates/sesiones |
| **motions** | `number` | Cantidad de mociones |
| **vote_priorities** | `number` | Número de votaciones prioritarias |
| **session_week_percentage** | `number` | Porcentaje normalizado para gráficos |
| **projects_percentage** | `number` | Porcentaje normalizado para gráficos |
| **accomplishment_percentage** | `number` | Porcentaje normalizado para gráficos |
| **vote_priorities_percentage** | `number` | Porcentaje normalizado para gráficos |
| **motions_percentage** | `number` | Porcentaje normalizado para gráficos |

Usado en: Componente `CandidatePerformance` para visualizar un radar chart con el desempeño

### Objeto: bills

Contiene información sobre los proyectos de ley presentados por el candidato.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **presented** | `number` | Total de proyectos de ley presentados |
| **approved** | `number` | Total de proyectos aprobados |
| **approval_rate** | `number` | Porcentaje de aprobación (approved / presented * 100) |
| **as_author** | `number` | Proyectos donde el candidato es autor principal |
| **as_adherent** | `number` | Proyectos donde el candidato es adherente/coautor |
| **list** | `Array<{title, year, status}>` | Listado detallado de proyectos de ley (máx 4 items de ejemplo) |

**Estructura de item en list:**
```json
{
  "title": "Ley de telemedicina en zonas rurales",
  "year": 2024,
  "status": "En comisión" // Posibles: "En comisión", "Aprobado", "Archivado", "En trámite"
}
```

Usado en: Componente `CandidateBills` para mostrar proyectos

### Objeto: motions_detail

Estructura idéntica a `bills`, contiene información sobre mociones y propuestas.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **presented** | `number` | Total de mociones presentadas |
| **approved** | `number` | Total de mociones aprobadas |
| **approval_rate** | `number` | Porcentaje de aprobación |
| **as_author** | `number` | Mociones donde es autor |
| **as_adherent** | `number` | Mociones donde es adherente |
| **list** | `Array<{title, year, status}>` | Listado detallado de mociones |

Usado en: Componente `CandidateMotions`

### Objeto: promises

Contiene información sobre promesas de campaña y su cumplimiento.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **list** | `Array<{title, year, status}>` | Listado de promesas electorales y su estado |

**Estructura de item:**
```json
{
  "title": "Ley de telemedicina en zonas rurales",
  "year": 2024,
  "status": "Competencia del Congreso" // Posibles: "Competencia del Congreso", "Competencia del Ejecutivo", "Competencia del Gobierno Regional o Local"
}
```

Usado en: Componente `CandidatePromises`

### Objeto: additional_info

Información adicional sobre el candidato y su desempeño.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **representation_week** | `number` | Porcentaje de representación en la semana |
| **party_change** | `boolean` | Indica si el candidato cambió de partido durante la legislatura |
| **commission_participation** | `string` | Nivel de participación en comisiones (ej: "Activa", "Moderada", "Baja") |
| **campaign_plan_url** | `string` | URL del plan de campaña del candidato (puede estar vacío) |

Usado en: Componente `CandidateAdditionalInfo`

### Propiedad: commissions

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **commissions** | `string[]` | Array de nombres de comisiones en las que participa el candidato (ej: ["Economía", "Presupuesto", "Descentralización"]) |

Usado en: Componente `CandidateCommissions`

### Objeto: lawsFor

Registro (key-value) de las leyes sobre las que el candidato ha votado y su posición.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **lawsFor** | `Record<string, {first, second?}>` | Objeto donde cada clave es el ID de una ley y el valor contiene las votaciones |

**Estructura de votación:**
```json
{
  "31520": { "first": true, "second": false },
  "31996": { "first": false, "second": true },
  "32059": { "first": true, "second": true },
  "31988": { "first": true }
}
```

**Propiedades de votación:**
- **first** (`boolean`): Voto en primera lectura (presente en todas las leyes)
- **second** (`boolean`): Voto en segunda lectura (opcional, solo en algunas leyes)
  - `true` = A favor
  - `false` = En contra

Usado en: Componente `CandidateForLaw` para mostrar un accordion con las leyes votadas

---

## 🏛️ Objeto: Party

El objeto `Party` contiene información sobre un partido político, incluyendo su liderazgo, distribución de representantes y métricas de desempeño.

### Propiedades Básicas

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **id** | `number` | Identificador único del partido. Se utiliza como parámetro de ruta en la página `/partido/[id]` |
| **name** | `string` | Nombre completo del partido político (ej: "Partido Nacional", "Alianza Progresista") |
| **picture** | `string` | URL de la imagen/logo del partido. Usado en tarjetas y página de detalle |
| **senator_count** | `number` | Cantidad de senadores del partido |
| **deputy_count** | `number` | Cantidad de diputados del partido |
| **founded_year** | `string` | Año de fundación del partido |
| **leader** | `string` | Nombre del líder/presidente de la plancha del partido |
| **leader_description** | `string` | Descripción breve del líder (opcional) |
| **vice_president** | `string` | Nombre del primer vicepresidente de la plancha (opcional) |
| **vice_president_description** | `string` | Descripción breve del primer vicepresidente (opcional) |
| **vice_president_2** | `string` | Nombre del segundo vicepresidente de la plancha (opcional) |
| **vice_president_2_description** | `string` | Descripción breve del segundo vicepresidente (opcional) |

### Objeto: metrics (opcional)

Métricas de desempeño promedio del partido, mostradas en la sección "Análisis del Partido" y en el bloque "Métricas del Partido" de la página de detalle.

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **attendance** | `number` | Asistencia promedio del partido (0-100) |
| **abstentions** | `number` | Abstenciones promedio del partido |
| **session_week** | `number` | Participación promedio en sesiones de la semana |
| **accomplishment** | `number` | Índice de cumplimiento promedio (0-100) |
| **projects** | `number` | Promedio de proyectos de ley por congresista |
| **participation** | `number` | Nivel de participación promedio en debates/sesiones |

### Objeto: distribution (opcional)

Distribución porcentual de cargos del partido, usada en el gráfico de dona de "Análisis del Partido".

| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| **name** | `string` | Nombre del cargo (ej: "Senadores", "Diputados", "Parlamento Andino") |
| **value** | `number` | Porcentaje que representa ese cargo dentro del partido |

> **Nota:** tanto `metrics`/`distribution` (secciones "Análisis del Partido" y "Métricas del Partido" en `/partido/[id]`) como las estadísticas de actividad en las tarjetas de congresistas (asistencia, abstenciones, comisiones, proyectos) se muestran u ocultan según el flag `HAS_CONGRESISTA_ACTIVITY_DATA` definido en `src/constants.ts`.

---

## 🔗 Relaciones entre Candidate y Party

- Cada `Candidate` tiene un `partyId` que referencia a un `Party.id`
- Los candidatos se filtran por `partyId` en la página de detalle de partido
- La pagina `partido/[id]` carga el partido y filtra candidatos asociados
- El componente `ComparadorApp` permite comparar múltiples candidatos o partidos

---

## 📁 Estructura de Archivos de Datos

```
public/data_example/
├── candidate-complete.json      # Array completo de todos los candidatos
├── candidate.json              # Array resumido de candidatos (para listas)
├── party-complete.json         # Array completo de todos los partidos
├── party.json                  # Array resumido de partidos (para listas)
├── candidates/
│   ├── 1.json                 # Detalle completo del candidato ID 1
│   ├── 2.json                 # Detalle completo del candidato ID 2
│   └── ...
└── parties/
    ├── 1.json                 # Detalle completo del partido ID 1
    ├── 2.json                 # Detalle completo del partido ID 2
    └── ...
```

---

## 🎯 Casos de Uso Principales

### 1. Página de Detalle de Candidato (`/candidato/[id]`)
- Carga `candidates/{id}.json` completo
- Muestra todas las propiedades del candidate
- Usa componentes como `CandidatePerformance`, `CandidateBills`, `CandidateForLaw`

### 2. Página de Detalle de Partido (`/partido/[id]`)
- Carga `parties/{id}.json` completo
- Filtra candidatos asociados por `partyId`
- Visualiza métricas y distribución

### 3. Comparador (`/compara`)
- Carga arrays resumidos (`candidate.json`, `party.json`)
- Permite seleccionar múltiples items
- Fetch detalles completos bajo demanda desde `candidates/{id}.json` o `parties/{id}.json`
- Compara métricas específicas

### 4. Listados y Tarjetas
- Usan propiedades básicas: `id`, `name`, `picture`, `region`, `party`, `attendance`
- Permiten navegación a detalle

---

## 📝 Notas Técnicas

- Todos los valores porcentuales están en rango 0-100
- Las URLs de imágenes pueden ser rutas absolutas o de APIs externas
- Los estados de proyectos/promesas son valores específicos (ver enums arriba)
- El campo `campaign_plan_url` en candidates puede estar vacío (`""`)
- Las propiedades con sufijo `_percentage` son versiones normalizadas para gráficos
