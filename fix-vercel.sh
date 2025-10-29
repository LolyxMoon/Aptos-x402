#!/bin/bash

# Script para solucionar error EINTEGRITY de Vercel
# Uso: chmod +x fix-vercel.sh && ./fix-vercel.sh

set -e  # Exit on error

echo "🔧 Solucionando error EINTEGRITY de Vercel..."
echo ""

# Check if we're in a Node.js project
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json"
    echo "   Ejecuta este script en la raíz de tu proyecto"
    exit 1
fi

echo "✓ package.json encontrado"
echo ""

# Backup
echo "📦 Creando backup..."
if [ -f "package-lock.json" ]; then
    cp package-lock.json package-lock.json.backup
    echo "✓ Backup creado: package-lock.json.backup"
fi

# Clean
echo ""
echo "🧹 Limpiando archivos antiguos..."
rm -rf node_modules
echo "✓ node_modules eliminado"

if [ -f "package-lock.json" ]; then
    rm package-lock.json
    echo "✓ package-lock.json eliminado"
fi

# Clean cache
echo ""
echo "🗑️  Limpiando cache de npm..."
npm cache clean --force
echo "✓ Cache limpiado"

# Reinstall
echo ""
echo "📥 Reinstalando dependencias..."
echo "   (Esto puede tomar unos minutos...)"
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas correctamente"
else
    echo "❌ Error al instalar dependencias"
    exit 1
fi

# Test build
echo ""
echo "🔨 Probando build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Build exitoso"
else
    echo "❌ Error en build"
    exit 1
fi

# Git check
echo ""
if command -v git &> /dev/null; then
    echo "📝 Preparando commit..."
    git status --short
    echo ""
    echo "✅ ¡Listo! Ahora ejecuta:"
    echo ""
    echo "   git add package-lock.json"
    echo "   git commit -m \"fix: regenerate package-lock.json to fix EINTEGRITY\""
    echo "   git push origin main"
    echo ""
else
    echo "✅ ¡Listo! Sube los cambios a tu repositorio"
fi

echo "🎉 Solución completada exitosamente"