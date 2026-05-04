/**
 * Supported file types and categories
 */
export const FILE_TYPES = {
  image: {
    label: 'Image',
    icon: '🖼️',
    extensions: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.tiff'],
    accept: 'image/*',
    description: 'JPG, PNG, WebP, BMP, GIF',
  },
  text: {
    label: 'Text',
    icon: '📄',
    extensions: ['.txt', '.csv', '.json', '.xml', '.html', '.css', '.js', '.py', '.md', '.log'],
    accept: '.txt,.csv,.json,.xml,.html,.css,.js,.py,.md,.log',
    description: 'TXT, CSV, JSON, XML, HTML',
  },
  audio: {
    label: 'Audio',
    icon: '🎵',
    extensions: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
    accept: 'audio/*',
    description: 'MP3, WAV, OGG, FLAC',
  },
  any: {
    label: 'Any File',
    icon: '📦',
    extensions: ['*'],
    accept: '*',
    description: 'All file formats',
  },
};

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
