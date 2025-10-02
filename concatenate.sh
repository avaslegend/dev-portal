#!/bin/bash

# EFECTIVA PORTAL - CSS CONCATENATOR
# Script para unir todos los archivos CSS en overrides.css
#
# USO:
# 1. Dar permisos: chmod +x concatenate.sh
# 2. Ejecutar: ./concatenate.sh

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuración
CSS_DIR="./css"
OUTPUT_FILE="$CSS_DIR/overrides.css"

# Array de archivos en orden
FILES=(
    "base/variables.css"
    "base/reset.css"
    "base/utilities.css"
    "animations.css"
    "components/buttons.css"
    "components/cards.css"
    "components/navigation.css"
    "components/footer.css"
    "pages/home.css"
    "pages/products-dynamic.css"
)

echo -e "${BLUE}🚀 Iniciando concatenación de CSS...${NC}\n"

# Crear banner
TIMESTAMP=$(date '+%d/%m/%Y %H:%M:%S')
cat > "$OUTPUT_FILE" << EOF
/**
 * ============================================================================
 * EFECTIVA PORTAL - OVERRIDES.CSS
 * Auto-generado: $TIMESTAMP
 * 
 * IMPORTANTE: No editar este archivo directamente.
 * Edita los archivos fuente en /css/ y ejecuta: ./concatenate.sh
 * ============================================================================
 */

EOF

# Contadores
PROCESSED=0
TOTAL_LINES=0
TOTAL_FILES=${#FILES[@]}

# Procesar cada archivo
for i in "${!FILES[@]}"; do
    FILE="${FILES[$i]}"
    FULL_PATH="$CSS_DIR/$FILE"
    INDEX=$((i + 1))
    
    echo -e "${YELLOW}📄 Procesando [$INDEX/$TOTAL_FILES]: $FILE${NC}"
    
    if [ -f "$FULL_PATH" ]; then
        # Agregar header de sección
        FILE_UPPER=$(echo "$FILE" | tr '[:lower:]' '[:upper:]')
        cat >> "$OUTPUT_FILE" << EOF

/* ============================================================================
   $FILE_UPPER
   ============================================================================ */

EOF
        
        # Agregar contenido del archivo
        cat "$FULL_PATH" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        
        # Contar líneas
        LINES=$(wc -l < "$FULL_PATH")
        TOTAL_LINES=$((TOTAL_LINES + LINES))
        PROCESSED=$((PROCESSED + 1))
        
        echo -e "   ${GREEN}✅ $LINES líneas agregadas${NC}"
    else
        echo -e "   ${RED}⚠️  Archivo no encontrado${NC}"
    fi
done

# Calcular tamaño del archivo
FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)

echo -e "\n${GREEN}✨ ¡Éxito! Archivo generado: $OUTPUT_FILE${NC}"
echo -e "${BLUE}📊 Estadísticas:${NC}"
echo -e "   - Archivos procesados: $PROCESSED/$TOTAL_FILES"
echo -e "   - Total de líneas: $TOTAL_LINES"
echo -e "   - Tamaño: $FILE_SIZE"