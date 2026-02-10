#!/usr/bin/env node

/**
 * Script para instalar componentes shadcn/ui faltantes
 * Ejecutar con: node install-shadcn-components.js
 */

const { execSync } = require('child_process');

// Lista de componentes que necesita tu proyecto según el error
const components = [
  'toaster',
  'sonner',
  'tooltip',
  'card',
  'button',
  'label',
  'select',
  'calendar',
  'popover',
  'checkbox',
  'badge',
  'toast', // Necesario para use-toast
];

console.log('📦 Instalando componentes shadcn/ui...\n');

let installed = 0;
let failed = 0;

components.forEach((component) => {
  try {
    console.log(`⏳ Instalando ${component}...`);
    execSync(`npx shadcn@latest add ${component} --yes --overwrite`, {
      stdio: 'inherit',
    });
    installed++;
    console.log(`✅ ${component} instalado\n`);
  } catch (error) {
    console.error(`❌ Error instalando ${component}\n`);
    failed++;
  }
});

console.log('\n' + '='.repeat(50));
console.log(`✅ Instalados: ${installed}`);
console.log(`❌ Fallidos: ${failed}`);
console.log('='.repeat(50));

if (failed === 0) {
  console.log('\n🎉 Todos los componentes instalados correctamente');
  console.log('📝 Ejecuta: npm run dev');
} else {
  console.log('\n⚠️  Algunos componentes fallaron');
  console.log('💡 Intenta instalarlos manualmente con:');
  console.log('   npx shadcn@latest add [nombre-componente]');
}