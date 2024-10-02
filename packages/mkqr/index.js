#!/usr/bin/env node
import * as QRCode from 'qrcode';
import { createInterface } from 'readline';

const args = process.argv.slice(2);
let outputPath = '';
let showHelp = args.includes('--help');

const filteredArgs = args.filter((arg, i) => {
  if (arg === '--out') {
    outputPath = args[i + 1] || ''
    return false
  }
  return args[i - 1] !== '--out' && !arg.startsWith('--')
});

const input = filteredArgs.join(' ');

if (!outputPath.endsWith('.png')) {
  outputPath += '.png';
}

if (showHelp || !outputPath) {
  console.log('Usage: mkqr --out <file.png> <input> [--help]');
  console.log('Generates a QR Code from the provided input (also pipable)');
  process.exit(showHelp ? 0 : 1);
}

const generateQR = async (data) => {
  try {
    await QRCode.toFile(outputPath, data, {
      color: {
        dark: '#000',  // Black dots
        light: '#FFF'  // White background
      },
    });
    console.log(`QR Code generated at ${outputPath}`);
  } catch (error) {
    console.error('Failed to generate QR Code:', error);
  }
};

if (!input) {
  // Handle stdin if no input source is provided
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  let inputData = '';
  rl.on('line', (line) => {
    inputData += line;
  });

  rl.on('close', () => {
    generateQR(inputData);
  });
} else {
  generateQR(input);
}
