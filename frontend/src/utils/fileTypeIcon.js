/**
 * Get icon and color for file types
 */
const FILE_ICONS = {
  'image': { icon: '🖼️', color: '#A29BFE' },
  'text': { icon: '📄', color: '#00D2D3' },
  'document': { icon: '📋', color: '#FDCB6E' },
  'audio': { icon: '🎵', color: '#E17055' },
  'archive': { icon: '📦', color: '#00B894' },
  'other': { icon: '📁', color: '#8888AA' },
};

export function getFileTypeIcon(category) {
  return FILE_ICONS[category] || FILE_ICONS.other;
}

export function getExtensionCategory(ext) {
  const lower = ext.toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif'].includes(lower)) return 'image';
  if (['.txt', '.csv', '.json', '.xml', '.html', '.css', '.js', '.py', '.md'].includes(lower)) return 'text';
  if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(lower)) return 'document';
  if (['.mp3', '.wav', '.ogg', '.flac', '.aac'].includes(lower)) return 'audio';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(lower)) return 'archive';
  return 'other';
}
