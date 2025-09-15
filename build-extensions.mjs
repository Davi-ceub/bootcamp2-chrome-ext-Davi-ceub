import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

const distDir = 'dist';

if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);


fs.copyFileSync('manifest.json', path.join(distDir, 'manifest.json'));
fs.cpSync('src', path.join(distDir, 'src'), { recursive: true });
fs.cpSync('icons', path.join(distDir, 'icons'), { recursive: true });

console.log('Arquivos da extensão copiados para dist/');


const output = fs.createWriteStream(path.join(distDir, 'extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 }
});

archive.pipe(output);

archive.directory(distDir, false);

output.on('close', () => {
  console.log(`Arquivo extension.zip criado com sucesso (${archive.pointer()} bytes).`);
});

archive.on('error', (err) => {
  throw err;
});

archive.finalize();