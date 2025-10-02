#!/usr/bin/env python3
"""
EFECTIVA PORTAL - CSS CONCATENATOR
Script para unir todos los archivos CSS en overrides.css

USO:
1. Guardar este archivo como: concatenate.py
2. Ejecutar: python concatenate.py
   o: python3 concatenate.py
"""

import os
from datetime import datetime
from pathlib import Path

# Configuración
CSS_DIRECTORY = Path('./css')
OUTPUT_FILE = Path('./css/overrides.css')

# Orden de concatenación (importante para especificidad CSS)
FILE_ORDER = [
    'base/variables.css',
    'base/reset.css',
    'base/utilities.css',
    'animations.css',
    'components/buttons.css',
    'components/cards.css',
    'components/navigation.css',
    'components/footer.css',
    'pages/home.css',
    'pages/products-dynamic.css'  # Crea este archivo con el código de products_hybrid_css
]

def create_banner():
    """Crea el banner del archivo generado"""
    now = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    return f"""/**
 * ============================================================================
 * EFECTIVA PORTAL - OVERRIDES.CSS
 * Auto-generado: {now}
 * 
 * IMPORTANTE: No editar este archivo directamente.
 * Edita los archivos fuente en /css/ y ejecuta: python concatenate.py
 * ============================================================================
 */

"""

def read_css_file(file_path):
    """Lee un archivo CSS con manejo de errores"""
    full_path = CSS_DIRECTORY / file_path
    
    try:
        if full_path.exists():
            with open(full_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return content
        else:
            print(f"⚠️  Archivo no encontrado: {file_path}")
            return ''
    except Exception as e:
        print(f"❌ Error leyendo {file_path}: {str(e)}")
        return ''

def concatenate_css():
    """Función principal de concatenación"""
    print('🚀 Iniciando concatenación de CSS...\n')
    
    final_css = create_banner()
    total_lines = 0
    processed_files = 0
    
    for index, file in enumerate(FILE_ORDER, 1):
        print(f"📄 Procesando [{index}/{len(FILE_ORDER)}]: {file}")
        
        content = read_css_file(file)
        
        if content:
            section_header = f"""
/* ============================================================================
   {file.upper()}
   ============================================================================ */

"""
            final_css += section_header + content + '\n\n'
            
            lines = len(content.split('\n'))
            total_lines += lines
            processed_files += 1
            
            print(f"   ✅ {lines} líneas agregadas")
    
    # Escribir archivo final
    try:
        OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
            f.write(final_css)
        
        file_size = len(final_css.encode('utf-8')) / 1024
        
        print(f"\n✨ ¡Éxito! Archivo generado: {OUTPUT_FILE}")
        print(f"📊 Estadísticas:")
        print(f"   - Archivos procesados: {processed_files}/{len(FILE_ORDER)}")
        print(f"   - Total de líneas: {total_lines}")
        print(f"   - Tamaño: {file_size:.2f} KB")
        
    except Exception as e:
        print(f"❌ Error escribiendo archivo: {str(e)}")
        exit(1)

if __name__ == '__main__':
    concatenate_css()