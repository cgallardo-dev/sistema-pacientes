import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const code = fs.readFileSync('src/supabase.ts', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  // Intenta insertar un registro dummy con todos los campos nuevos para ver el error
  const dummyData = {
      paciente_dni: '61243962',
      tipo: 'laser',
      fecha_hora: '2026-04-10T10:00:00',
      fecha_hora_fin: '2026-04-10T11:00:00',
      completado: false
  };
  supabase.from('tratamientos').insert([dummyData]).then(res => console.log(JSON.stringify(res.error, null, 2)));
}
