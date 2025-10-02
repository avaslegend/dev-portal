/**
 * ============================================================================
 * EFECTIVA PORTAL - BUILD SYSTEM
 * Script para concatenar CSS y JS modulares
 * ============================================================================
 * 
 * ESTRUCTURA DEL PROYECTO:
 * 
 * EFECTIVAPORTAL-DEV/
 * ├── css-source/              ← CSS modular (desarrollo)
 * │   ├── base/
 * │   ├── components/
 * │   └── pages/
 * ├── js-source/               ← JS modular (desarrollo)
 * │   ├── components/
 * │   ├── pages/
 * │   └── utils/
 * ├── concatenate.js           ← Este archivo
 * └── EFECTIVAPORTAL/          ← Template para Drupal
 *     ├── css/
 *     │   ├── mail.css
 *     │   └── overrides.css    ← GENERADO
 *     ├── js/
 *     │   └── main.js          ← GENERADO
 *     └── ...
 * 
 * USO:
 * 1. node concatenate.js
 * 2. cd EFECTIVAPORTAL && zip -r efectivaportal.zip .
 * 3. Subir ZIP al Developer Portal
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CSS_SOURCE_DIR = './css-source';
const JS_SOURCE_DIR = './js-source';
const OUTPUT_DIR = './EFECTIVAPORTAL';

// Orden de concatenación CSS (importante para especificidad)
const CSS_FILES = [
  'base/variables.css',
  'base/reset.css',
  'base/utilities.css',
  'animations.css',
  'components/buttons.css',
  'components/cards.css',
  'components/navigation.css',
  'components/footer.css',
  'pages/home.css',
  'pages/products-dynamic.css'
];

// Orden de concatenación JS
const JS_FILES = [
  'utils/helpers.js',
  'utils/constants.js',
  'components/scroll-reveal.js',
  'components/navigation.js',
  'components/animations.js',
  'pages/home.js',
  'pages/products.js'
];

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Lee un archivo con manejo de errores
 */
function readFile(sourceDir, filePath) {
  const fullPath = path.join(sourceDir, filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8');
    } else {
      console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error leyendo ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Crea el banner del archivo generado
 */
function createBanner(type) {
  const now = new Date().toLocaleString('es-PE', { 
    timeZone: 'America/Lima',
    dateStyle: 'short',
    timeStyle: 'short'
  });
  
  const fileName = type === 'CSS' ? 'OVERRIDES.CSS' : 'MAIN.JS';
  const fileCount = type === 'CSS' ? CSS_FILES.length : JS_FILES.length;
  
  return `/**
 * ============================================================================
 * EFECTIVA PORTAL - ${fileName}
 * Auto-generado: ${now}
 * 
 * ⚠️  IMPORTANTE: NO EDITAR ESTE ARCHIVO DIRECTAMENTE
 * 
 * Este archivo es generado automáticamente desde archivos fuente modulares.
 * Para hacer cambios:
 *   1. Edita los archivos en /${type === 'CSS' ? 'css' : 'js'}-source/
 *   2. Ejecuta: node concatenate.js
 *   3. Empaqueta y sube el template
 * 
 * Archivos concatenados: ${fileCount}
 * ============================================================================
 */

`;
}

/**
 * Crea el header de sección
 */
function createSectionHeader(fileName) {
  const separator = '='.repeat(76);
  return `
/* ${separator}
   ${fileName.toUpperCase()}
   ${separator} */

`;
}

/**
 * Verifica directorios
 */
function checkDirectories() {
  const errors = [];
  
  // Verificar directorios fuente
  if (!fs.existsSync(CSS_SOURCE_DIR)) {
    errors.push(`❌ No existe: ${CSS_SOURCE_DIR}`);
  }
  
  if (!fs.existsSync(JS_SOURCE_DIR)) {
    console.warn(`⚠️  No existe: ${JS_SOURCE_DIR} (se omitirá JS)`);
  }
  
  // Crear directorios de salida si no existen
  const cssOutDir = path.join(OUTPUT_DIR, 'css');
  const jsOutDir = path.join(OUTPUT_DIR, 'js');
  
  [cssOutDir, jsOutDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`📁 Creando: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  if (errors.length > 0) {
    errors.forEach(err => console.error(err));
    return false;
  }
  
  return true;
}

// ============================================================================
// FUNCIONES DE CONCATENACIÓN
// ============================================================================

/**
 * Concatena archivos CSS
 */
function concatenateCSS() {
  console.log('\n📝 Procesando archivos CSS...\n');
  
  let finalCSS = createBanner('CSS');
  let totalLines = 0;
  let processedFiles = 0;
  
  CSS_FILES.forEach((file, index) => {
    const num = String(index + 1).padStart(2, '0');
    console.log(`📄 CSS [${num}/${CSS_FILES.length}] ${file}`);
    
    const content = readFile(CSS_SOURCE_DIR, file);
    
    if (content) {
      const sectionHeader = createSectionHeader(file);
      finalCSS += sectionHeader + content + '\n\n';
      
      const lines = content.split('\n').length;
      totalLines += lines;
      processedFiles++;
      
      console.log(`   ✅ ${lines.toLocaleString()} líneas`);
    } else {
      console.log(`   ⏭️  Omitido`);
    }
  });
  
  // Escribir CSS
  const cssPath = path.join(OUTPUT_DIR, 'css', 'overrides.css');
  fs.writeFileSync(cssPath, finalCSS, 'utf8');
  
  return { 
    processed: processedFiles, 
    total: CSS_FILES.length, 
    lines: totalLines, 
    size: finalCSS.length,
    path: cssPath
  };
}

/**
 * Concatena archivos JS
 */
function concatenateJS() {
  console.log('\n🔧 Procesando archivos JavaScript...\n');
  
  let finalJS = createBanner('JS');
  let totalLines = 0;
  let processedFiles = 0;
  
  // Wrapper para Drupal - Inicio
  finalJS += `/**
 * Wrapper para evitar conflictos en el scope global de Drupal
 * Todos los módulos están bajo el namespace: Drupal.efectivaportal
 */
(function(Drupal, drupalSettings, once) {
  'use strict';

  // Namespace global para Efectiva Portal
  Drupal.efectivaportal = Drupal.efectivaportal || {};

`;
  
  // Procesar cada archivo JS
  JS_FILES.forEach((file, index) => {
    const num = String(index + 1).padStart(2, '0');
    console.log(`📄 JS  [${num}/${JS_FILES.length}] ${file}`);
    
    const content = readFile(JS_SOURCE_DIR, file);
    
    if (content) {
      const sectionHeader = createSectionHeader(file);
      finalJS += sectionHeader + content + '\n\n';
      
      const lines = content.split('\n').length;
      totalLines += lines;
      processedFiles++;
      
      console.log(`   ✅ ${lines.toLocaleString()} líneas`);
    } else {
      console.log(`   ⏭️  Omitido`);
    }
  });
  
  // Wrapper para Drupal - Cierre
  finalJS += `
  // ============================================================================
  // INICIALIZACIÓN GLOBAL
  // ============================================================================
  
  /**
   * Behavior principal que inicializa todo
   */
  Drupal.behaviors.efectivaportalInit = {
    attach: function(context, settings) {
      once('efectivaportal-init', 'body', context).forEach(function() {
        console.log('✨ Efectiva Portal inicializado');
        
        // Inicializar componentes globales si existen
        if (Drupal.efectivaportal.navigation) {
          Drupal.efectivaportal.navigation.init();
        }
        if (Drupal.efectivaportal.scrollReveal) {
          Drupal.efectivaportal.scrollReveal.init();
        }
      });
    }
  };

})(Drupal, drupalSettings, once);
`;
  
  // Escribir JS
  const jsPath = path.join(OUTPUT_DIR, 'js', 'main.js');
  fs.writeFileSync(jsPath, finalJS, 'utf8');
  
  return { 
    processed: processedFiles, 
    total: JS_FILES.length, 
    lines: totalLines, 
    size: finalJS.length,
    path: jsPath
  };
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Ejecuta el build completo
 */
function build() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         EFECTIVA PORTAL - BUILD SYSTEM                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const startTime = Date.now();
  
  // Verificar directorios
  if (!checkDirectories()) {
    console.error('\n💡 Sugerencia: Verifica la estructura de carpetas');
    process.exit(1);
  }
  
  // Procesar CSS
  const cssStats = concatenateCSS();
  
  // Procesar JS (si existe el directorio)
  let jsStats = null;
  if (fs.existsSync(JS_SOURCE_DIR)) {
    jsStats = concatenateJS();
  } else {
    console.log('\n⚠️  Directorio js-source no encontrado, omitiendo JavaScript\n');
  }
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  // Mostrar resumen
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✨ BUILD COMPLETADO EXITOSAMENTE                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  console.log('\n📊 Estadísticas del Build:\n');
  
  // Estadísticas CSS
  console.log('  📝 CSS (overrides.css):');
  console.log(`     ├─ Archivos procesados: ${cssStats.processed}/${cssStats.total}`);
  console.log(`     ├─ Total de líneas: ${cssStats.lines.toLocaleString()}`);
  console.log(`     ├─ Tamaño: ${(cssStats.size / 1024).toFixed(2)} KB`);
  console.log(`     └─ Ubicación: ${cssStats.path}`);
  
  // Estadísticas JS
  if (jsStats) {
    console.log('\n  🔧 JavaScript (main.js):');
    console.log(`     ├─ Archivos procesados: ${jsStats.processed}/${jsStats.total}`);
    console.log(`     ├─ Total de líneas: ${jsStats.lines.toLocaleString()}`);
    console.log(`     ├─ Tamaño: ${(jsStats.size / 1024).toFixed(2)} KB`);
    console.log(`     └─ Ubicación: ${jsStats.path}`);
  }
  
  // Tiempo de ejecución
  console.log(`\n  ⏱️  Tiempo de build: ${duration}s`);
  
  // Instrucciones siguientes
  console.log('\n🚀 Siguientes pasos:\n');
  console.log('  1. Revisar archivos generados');
  console.log('  2. cd EFECTIVAPORTAL');
  console.log('  3. zip -r efectivaportal.zip .');
  console.log('  4. Subir ZIP al Developer Portal de IBM API Connect');
  console.log('  5. Limpiar caché de Drupal\n');
  
  // Archivos generados
  console.log('📦 Archivos listos para deployment:');
  console.log(`   └─ EFECTIVAPORTAL/`);
  console.log(`      ├─ css/overrides.css (${(cssStats.size / 1024).toFixed(2)} KB)`);
  if (jsStats) {
    console.log(`      └─ js/main.js (${(jsStats.size / 1024).toFixed(2)} KB)`);
  }
  console.log();
}

// ============================================================================
// EJECUTAR
// ============================================================================

// Manejo de errores globales
process.on('uncaughtException', (error) => {
  console.error('\n❌ ERROR CRÍTICO:', error.message);
  console.error(error.stack);
  process.exit(1);
});

// Ejecutar build
try {
  build();
} catch (error) {
  console.error('\n❌ Error durante el build:', error.message);
  process.exit(1);
}