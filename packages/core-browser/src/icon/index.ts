const iconPrefixes = ['kaitian-icon kticon-'];

export enum ROTATE_TYPE {
  rotate_90,
  rotate_180,
  rotate_270,
  flip_horizontal,
  flip_vertical,
  flip_both,
}

export enum ANIM_TYPE {
  spin,
  pulse,
}

const ROTATE_CLASS_NAME = ['rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'flip-both'];
const ANIM_CLASS_NAME = ['spin', 'pulse'];

export function getIcon(iconKey: string, rotate?: ROTATE_TYPE, anim?: ANIM_TYPE) {
  let lastIndex = iconPrefixes.length;
  while (!iconMap[iconPrefixes[--lastIndex]][iconKey]) {
    if (lastIndex === 0) { break; }
  }
  const iconValue = iconMap[iconPrefixes[lastIndex]][iconKey];
  if (!iconValue) {
    console.warn('图标库缺失图标:' + iconKey);
  }

  let iconClass = `${iconPrefixes[lastIndex]}${iconValue || 'smile'}`;
  if (rotate !== undefined) {
    iconClass += ` iconfont-${ROTATE_CLASS_NAME[rotate]}`;
  }
  if (anim !== undefined) {
    iconClass += ` iconfont-anim-${ANIM_CLASS_NAME[anim]}`;
  }
  return iconClass;
}

export function getOctIcon(iconKey: string) {
  return `octicon octicon-${iconKey}`;
}

export function updateIconMap(prefix: string, customIconMap: { [iconKey: string]: string }) {
  iconMap[prefix] = customIconMap;
  iconPrefixes.push(prefix);
}

export const defaultIconMap = {
  'wait': 'wait',
  'extension': 'extension',
  'debug': 'debug',
  'scm': 'scm',
  'search': 'search',
  'explorer': 'explorer',
  'arrow-down': 'arrow-down',
  'arrow-right': 'arrow-right',
  'dashboard-fill': 'dashboard-fill',
  'info-circle': 'info-circle',
  'info-circle-fill': 'info-circle-fill',
  'close-circle': 'close-circle',
  'close-circle-fill': 'close-circle-fill',
  'check-circle-fill': 'check-circle-fill',
  'check': 'check',
  'delete': 'delete',
  'detail': 'detail',
  'sync': 'sync',
  'question-circle': 'question-circle',
  'control-fill': 'control-fill',
  'codelibrary-fill': 'codelibrary-fill',
  'close': 'close',
  'unorderedlist': 'unorderedlist',
  'swap': 'swap',
  'up': 'up',
  'branches': 'branches',
  'file-exclamation': 'file-exclamation',
  'folder-fill': 'folder-fill',
  'folder-fill-open': 'folder-fill',
  'ellipsis': 'ellipsis',
  'right': 'right',
  'cloud-server': 'cloud-server',
  'bell': 'bell',
  'file-text': 'file-text',
  'team': 'team',
  'setting': 'setting',
  'embed': 'embed',
  'refresh': 'refresh',
  'search-close': 'close-square',
  'fold': 'collapse-all',
  'open': 'open',
  'withdraw': 'withdraw',
  'plus': 'plus',
  'line': 'line',
  'add': 'add',
  'ab': 'ab',
  'abl': 'abl',
  'regex': 'regex',
  'eye': 'eye',
  'clear': 'clear',
  'eye-close': 'eye-close',
  'replace': 'replace',
  'window-maximize': 'window-maximize',
  'cloud-download': 'cloud-download',
  'new-file': 'new-file',
  'new-folder': 'new-folder',
  'collapse-all': 'collapse-all',
  'close-all': 'close-all',
  'save-all': 'save-all',
  'setting-general': 'setting',
  'setting-editor': 'codelibrary-fill',
  'setting-file': 'file-text',
  'setting-extension': 'extension',
  'edit': 'edit',
  'rollback': 'rollback',
  'terminate': 'terminate',
  'step': 'step',
  'stop': 'stop',
  'step-out': 'step-out',
  'step-in': 'step-in',
  'start': 'start',
  'reload': 'reload',
  'toggle-breakpoints': 'deactivate-breakpoints',
  'disconnect': 'disconnect',
  'download': 'download',
};

const iconMap: { [iconPrefix: string]: { [iconKey: string]: string } } = {
  [iconPrefixes[0]]: defaultIconMap,
};
