const fs = require('fs');
const path = require('path');

// Определяем пути к файлам
const htmlPath = path.join(__dirname, 'src', 'index.html');
const cssPath = path.join(__dirname, 'dist', 'style.css');
const jsPath = path.join(__dirname, 'src', 'js', 'app.js');
const outputPath = path.join(__dirname, 'dist', 'index.html');

// Читаем исходный HTML-файл
let htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Читаем скомпилированный CSS и JS
const cssContent = fs.readFileSync(cssPath, 'utf8');
const jsContent = fs.readFileSync(jsPath, 'utf8');

// Заменяем метки на содержимое файлов
htmlContent = htmlContent.replace(
    '<!-- inline:css -->',
    `<style>${cssContent}</style>`
);

htmlContent = htmlContent.replace(
    '<!-- inline:js -->',
    `<script>${jsContent}</script>`
);

// Записываем итоговый HTML в папку dist
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log('Сборка завершена. Файл dist/index.html создан.');
