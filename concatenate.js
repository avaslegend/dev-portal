/**
 * ============================================================================
 * EFECTIVA PORTAL - BUILD SYSTEM COMPLETO
 * Script para concatenar y minificar CSS y JS modulares
 * ============================================================================
 * 
 * USO:
 * - npm run build           → Genera archivos normales (desarrollo)
 * - npm run build:min       → Genera archivos minificados (producción)
 * - npm run build:css       → Solo CSS
 * - npm run build:js        → Solo JS
 * - npm run compare         → Compara tamaños dev vs prod
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const CSS_SOURCE_DIR = './css-source';
const JS_SOURCE_DIR = './js-source';
const OUTPUT_DIR = './EFECTIVAPORTAL';

// Detectar modo desde argumentos
const args = process.argv.slice(2);
const MINIFY = args.includes('--minify') || args.includes('--min') || args.includes('-m');
const CSS_ONLY = args.includes('--css-only');
const JS_ONLY = args.includes('--js-only');

// Orden de concatenación CSS
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
  'pages/products-dynamic.css',
  'pages/home-drupal-header.css',
  'pages/home-footer-modern.css',
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
// FUNCIONES DE MINIFICACIÓN
// ============================================================================

/**
 * Minifica CSS - Elimina comentarios, espacios y saltos de línea innecesarios
 */
function minifyCSS(css) {
  return css
    // Eliminar comentarios /* */
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Eliminar múltiples espacios y saltos de línea
    .replace(/\s+/g, ' ')
    // Eliminar espacios alrededor de { } : ; , > + ~ ( )
    .replace(/\s*([{}:;,>+~()])\s*/g, '$1')
    // Eliminar último ; antes de }
    .replace(/;}/g, '}')
    // Eliminar espacios al inicio y final de cada línea
    .trim();
}

/**
 * Minifica JavaScript - Elimina comentarios y espacios innecesarios
 */
function minifyJS(js) {
  return js
    // Eliminar comentarios de una línea //
    .replace(/\/\/.*$/gm, '')
    // Eliminar comentarios multilínea /* */ (preservando strings)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Eliminar múltiples espacios y saltos de línea
    .replace(/\s+/g, ' ')
    // Eliminar espacios alrededor de operadores y símbolos
    .replace(/\s*([{}:;,()[\]<>!=+\-*/%&|?.])\s*/g, '$1')
    // Restaurar espacios necesarios para palabras clave
    .replace(/}([a-zA-Z])/g, '} $1')
    .replace(/([a-zA-Z]){/g, '$1 {')
    .replace(/\breturn([^;])/g, 'return $1')
    .replace(/\bvar\b/g, ' var ')
    .replace(/\bconst\b/g, ' const ')
    .replace(/\blet\b/g, ' let ')
    .replace(/\bfunction\b/g, ' function ')
    .replace(/\bif\b/g, ' if ')
    .replace(/\belse\b/g, ' else ')
    .replace(/\bfor\b/g, ' for ')
    .replace(/\bwhile\b/g, ' while ')
    // Limpiar espacios múltiples que quedaron
    .replace(/\s+/g, ' ')
    .trim();
}

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
  
  // Banner mínimo para archivos minificados
  if (MINIFY) {
    return `/* Efectiva Portal ${type} - Generado: ${now} - NO EDITAR */\n`;
  }
  
  // Banner completo para desarrollo
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
 * Modo: ${MINIFY ? 'PRODUCCIÓN (Minificado)' : 'DESARROLLO'}
 * ============================================================================
 */

`;
}

/**
 * Crea el header de sección
 */
function createSectionHeader(fileName) {
  // Sin headers en modo minificado
  if (MINIFY) return '';
  
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
  if (!CSS_ONLY && !fs.existsSync(CSS_SOURCE_DIR)) {
    errors.push(`❌ No existe: ${CSS_SOURCE_DIR}`);
  }
  
  if (!CSS_ONLY && !JS_ONLY && !fs.existsSync(JS_SOURCE_DIR)) {
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
  let originalSize = finalCSS.length;
  
  CSS_FILES.forEach((file, index) => {
    const num = String(index + 1).padStart(2, '0');
    console.log(`📄 CSS [${num}/${CSS_FILES.length}] ${file}`);
    
    const content = readFile(CSS_SOURCE_DIR, file);
    
    if (content) {
      originalSize += content.length;
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
  
  // Minificar si es necesario
  if (MINIFY) {
    console.log('\n🗜️  Minificando CSS...');
    finalCSS = minifyCSS(finalCSS);
  }
  
  // Escribir CSS
  const cssPath = path.join(OUTPUT_DIR, 'css', 'overrides.css');
  fs.writeFileSync(cssPath, finalCSS, 'utf8');
  
  return { 
    processed: processedFiles, 
    total: CSS_FILES.length, 
    lines: totalLines, 
    size: finalCSS.length,
    originalSize: originalSize,
    path: cssPath,
    minified: MINIFY
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
  let originalSize = finalJS.length;
  
  // Wrapper para Drupal - Inicio
  const wrapperStart = `/**
 * Wrapper para Drupal - Namespace: Drupal.efectivaportal
 */
(function(Drupal, drupalSettings, once) {
  'use strict';

  // Namespace global
  Drupal.efectivaportal = Drupal.efectivaportal || {};

`;
  
  finalJS += wrapperStart;
  originalSize += wrapperStart.length;
  
  // Procesar cada archivo JS
  JS_FILES.forEach((file, index) => {
    const num = String(index + 1).padStart(2, '0');
    console.log(`📄 JS  [${num}/${JS_FILES.length}] ${file}`);
    
    const content = readFile(JS_SOURCE_DIR, file);
    
    if (content) {
      originalSize += content.length;
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
  const wrapperEnd = `
  // Inicialización global
  Drupal.behaviors.efectivaportalInit = {
    attach: function(context, settings) {
      once('efectivaportal-init', 'body', context).forEach(function() {
        console.log('✨ Efectiva Portal inicializado');
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
  
  finalJS += wrapperEnd;
  originalSize += wrapperEnd.length;
  
  // Minificar si es necesario
  if (MINIFY) {
    console.log('\n🗜️  Minificando JavaScript...');
    finalJS = minifyJS(finalJS);
  }
  
  // Escribir JS
  const jsPath = path.join(OUTPUT_DIR, 'js', 'main.js');
  fs.writeFileSync(jsPath, finalJS, 'utf8');
  
  return { 
    processed: processedFiles, 
    total: JS_FILES.length, 
    lines: totalLines, 
    size: finalJS.length,
    originalSize: originalSize,
    path: jsPath,
    minified: MINIFY
  };
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

/**
 * Ejecuta el build completo
 */
function build() {
  const buildMode = MINIFY ? 'PRODUCCIÓN (MINIFICADO)' : 'DESARROLLO';
  
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log(`║         EFECTIVA PORTAL - BUILD SYSTEM                     ║`);
  console.log(`║         Modo: ${buildMode.padEnd(43)} ║`);
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const startTime = Date.now();
  
  // Verificar directorios
  if (!checkDirectories()) {
    console.error('\n💡 Sugerencia: Verifica la estructura de carpetas');
    process.exit(1);
  }
  
  let cssStats = null;
  let jsStats = null;
  
  // Procesar CSS (si no es JS-only)
  if (!JS_ONLY) {
    cssStats = concatenateCSS();
  }
  
  // Procesar JS (si existe y no es CSS-only)
  if (!CSS_ONLY && fs.existsSync(JS_SOURCE_DIR)) {
    jsStats = concatenateJS();
  } else if (!CSS_ONLY) {
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
  if (cssStats) {
    const reduction = cssStats.minified ? 
      ((1 - cssStats.size / cssStats.originalSize) * 100).toFixed(1) : 0;
    
    console.log('  📝 CSS (overrides.css):');
    console.log(`     ├─ Archivos procesados: ${cssStats.processed}/${cssStats.total}`);
    console.log(`     ├─ Total de líneas: ${cssStats.lines.toLocaleString()}`);
    
    if (cssStats.minified) {
      console.log(`     ├─ Tamaño original: ${(cssStats.originalSize / 1024).toFixed(2)} KB`);
      console.log(`     ├─ Tamaño minificado: ${(cssStats.size / 1024).toFixed(2)} KB`);
      console.log(`     ├─ Reducción: ${reduction}% más pequeño`);
    } else {
      console.log(`     ├─ Tamaño: ${(cssStats.size / 1024).toFixed(2)} KB`);
    }
    
    console.log(`     ├─ Minificado: ${cssStats.minified ? '✅ SÍ' : '❌ NO'}`);
    console.log(`     └─ Ubicación: ${cssStats.path}`);
  }
  
  // Estadísticas JS
  if (jsStats) {
    const reduction = jsStats.minified ? 
      ((1 - jsStats.size / jsStats.originalSize) * 100).toFixed(1) : 0;
    
    console.log('\n  🔧 JavaScript (main.js):');
    console.log(`     ├─ Archivos procesados: ${jsStats.processed}/${jsStats.total}`);
    console.log(`     ├─ Total de líneas: ${jsStats.lines.toLocaleString()}`);
    
    if (jsStats.minified) {
      console.log(`     ├─ Tamaño original: ${(jsStats.originalSize / 1024).toFixed(2)} KB`);
      console.log(`     ├─ Tamaño minificado: ${(jsStats.size / 1024).toFixed(2)} KB`);
      console.log(`     ├─ Reducción: ${reduction}% más pequeño`);
    } else {
      console.log(`     ├─ Tamaño: ${(jsStats.size / 1024).toFixed(2)} KB`);
    }
    
    console.log(`     ├─ Minificado: ${jsStats.minified ? '✅ SÍ' : '❌ NO'}`);
    console.log(`     └─ Ubicación: ${jsStats.path}`);
  }
  
  // Tiempo de ejecución
  console.log(`\n  ⏱️  Tiempo de build: ${duration}s`);
  
  // Instrucciones siguientes
  console.log('\n🚀 Siguientes pasos:\n');
  console.log('  1. Revisar archivos generados');
  console.log('  2. cd EFECTIVAPORTAL');
  console.log('  3. zip -r efectivaportal.zip .');
  console.log('  4. Subir ZIP al Developer Portal');
  console.log('  5. Limpiar caché de Drupal\n');
  
  // Archivos generados
  console.log('📦 Archivos listos para deployment:');
  console.log(`   └─ EFECTIVAPORTAL/`);
  if (cssStats) {
    console.log(`      ├─ css/overrides.css (${(cssStats.size / 1024).toFixed(2)} KB)`);
  }
  if (jsStats) {
    console.log(`      └─ js/main.js (${(jsStats.size / 1024).toFixed(2)} KB)`);
  }
  
  // Consejo sobre minificación
  if (!MINIFY && cssStats) {
    const potentialSavings = ((1 - 0.35) * 100).toFixed(0); // Estimado 65% reducción
    console.log(`\n💡 Tip: Para producción, usa: npm run build:min`);
    console.log(`   Reducción estimada: ~${potentialSavings}%\n`);
  } else if (MINIFY) {
    console.log('\n✅ Archivos minificados listos para producción\n');
  }
}

// ============================================================================
// EJECUCIÓN
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