# 🚀 Efectiva Portal - Sistema de Desarrollo

Sistema de desarrollo modular para el Developer Portal de Efectiva (IBM API Connect + Drupal).

## 📁 Estructura del Proyecto

```
EFECTIVAPORTAL-DEV/
├── css-source/              # CSS modular (desarrollo)
│   ├── base/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   └── utilities.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── navigation.css
│   │   └── footer.css
│   ├── pages/
│   │   ├── home.css
│   │   └── products-dynamic.css
│   └── animations.css
│
├── js-source/               # JavaScript modular (desarrollo)
│   ├── components/
│   │   ├── navigation.js
│   │   ├── scroll-reveal.js
│   │   └── animations.js
│   ├── pages/
│   │   ├── home.js
│   │   └── products.js
│   └── utils/
│       ├── helpers.js
│       └── constants.js
│
├── EFECTIVAPORTAL/          # Template para Drupal (SE SUBE)
│   ├── css/
│   │   ├── mail.css
│   │   └── overrides.css    # ← GENERADO
│   ├── js/
│   │   └── main.js          # ← GENERADO
│   ├── images/
│   ├── composer.json
│   ├── efectivaportal.info.yml
│   ├── efectivaportal.libraries.yml
│   └── ...
│
├── concatenate.js           # Script de build
├── package.json
├── .gitignore
└── README.md
```

## 🛠️ Instalación

```bash
# 1. Clonar el repositorio
git clone [url-del-repo]
cd EFECTIVAPORTAL-DEV

# 2. Instalar dependencias
npm install

# 3. Verificar que todo funciona
npm run build
```

## 📦 Comandos Disponibles

### Build y Deploy

```bash
# Generar CSS y JS
npm run build

# Generar solo CSS
npm run build:css

# Generar solo JS
npm run build:js

# Observar cambios y regenerar automáticamente
npm run watch

# Generar ZIP para subir a Drupal
npm run package

# Build + Package
npm run deploy
```

### Limpieza

```bash
# Eliminar archivos generados
npm run clean
```

### Validación de Código

```bash
# Validar CSS
npm run validate:css

# Validar JavaScript
npm run validate:js

# Validar todo
npm run lint
```

### Utilidades

```bash
# Ver estadísticas del proyecto
npm run stats

# Ver ayuda
npm run help
```

## 🔄 Workflow de Desarrollo

### 1. Desarrollo Local

```bash
# Activar modo watch (regenera automáticamente al guardar)
npm run watch

# En otra terminal, edita tus archivos:
# - Editar: css-source/components/buttons.css
# - Guardar
# - ¡El archivo overrides.css se regenera automáticamente!
```

### 2. Validar Cambios

```bash
# Validar código antes de deployar
npm run lint

# Ver estadísticas
npm run stats
```

### 3. Generar Package

```bash
# Generar ZIP para subir al Developer Portal
npm run deploy

# Esto genera: efectivaportal.zip
```

### 4. Subir a Drupal

1. Ir al Developer Portal admin
2. Appearance > efectivaportal > Upload theme
3. Subir `efectivaportal.zip`
4. Limpiar caché de Drupal

## 🎨 Agregar Nuevos Componentes

### Nuevo componente CSS

```bash
# 1. Crear archivo
touch css-source/components/mi-componente.css

# 2. Editar concatenate.js y agregar a CSS_FILES:
# 'components/mi-componente.css'

# 3. Regenerar
npm run build
```

### Nuevo módulo JS

```bash
# 1. Crear archivo
touch js-source/components/mi-modulo.js

# 2. Editar concatenate.js y agregar a JS_FILES:
# 'components/mi-modulo.js'

# 3. Regenerar
npm run build
```

## 🐛 Troubleshooting

### Error: "Archivo no encontrado"

- Verifica que el archivo existe en `css-source/` o `js-source/`
- Verifica el nombre del archivo en `concatenate.js`

### El CSS no se aplica

- Limpia el caché de Drupal
- Verifica que `efectivaportal.libraries.yml` esté configurado correctamente
- Verifica la especificidad CSS (usa DevTools F12)

### El JS no funciona

- Abre la consola del navegador (F12)
- Verifica errores de JavaScript
- Verifica que jQuery y Drupal estén disponibles

## 📝 Convenciones de Código

### CSS

- Usar BEM para naming: `.block__element--modifier`
- Usar variables CSS: `var(--color-primary)`
- Namespace por página: `.home-`, `.referidos-`, `.blog-`
- Mobile-first approach

### JavaScript

- Usar namespace: `Drupal.efectivaportal.miModulo`
- Usar Drupal behaviors
- Documentar funciones con JSDoc
- Usar `once()` para evitar inicialización múltiple

## 🔗 Links Útiles

- [IBM API Connect Docs](https://www.ibm.com/docs/en/api-connect)
- [Drupal Theming](https://www.drupal.org/docs/theming-drupal)
- [Drupal JavaScript](https://www.drupal.org/docs/drupal-apis/javascript-api)

## 📄 Licencia

Privado - Efectiva Tu Financiera

## 👥 Equipo

Desarrollado por el equipo de Efectiva


# 🚀 Cómo usar cada script:

Node.js:

```bash
# 1. Instalar Node.js (si no lo tienes)
# 2. En la carpeta del proyecto:
node concatenate.js
```

Python:

```bash
# 1. Tener Python 3 instalado
# 2. En la carpeta del proyecto:
python concatenate.py
# o
python3 concatenate.py
```

Linux/Mac

```bash
concatenate.sh
```