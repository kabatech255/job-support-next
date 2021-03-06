import SimpleMDE from 'easymde'
import { MDE_BODY_HEIGHT, MDE_SHOW_TOOLBAR, MDE_SHOW_STATUSBAR } from './util'

const defaultOptions = {
  placeholder: 'ここに記事を入力してください。',
  uploadImage: true,
  // imageUploadFunction,
  imageMaxSize: 1024 * 1024 * 0.1,
  imageAccept: 'image/png,image/jpeg,image/gif,image/svg+xml',
  // imageTexts: {
  //   sbInit: '',
  //   sbOnDragEnter: '',
  // },
  showIcons: ['code', 'table'],
  spellChecker: false,
  toolbar: MDE_SHOW_TOOLBAR && [
    'bold',
    'italic',
    'heading',
    'quote',
    'unordered-list',
    'ordered-list',
    'link',
    'image',
    'strikethrough',
    'code',
    'table',
    'redo',
    'undo',
    // 'heading-bigger',
    // 'heading-smaller',
    // 'heading-1',
    // 'heading-2',
    // 'heading-3',
    // 'clean-block',
    // 'horizontal-rule',
    // 'preview',
    // 'side-by-side',
    // 'fullscreen',
    'guide',
  ],
  sideBySideFullscreen: false,
  syncSideBySidePreviewScroll: true,
  tabSize: 2,
  indentWithTabs: true,
  maxHeight: `${MDE_BODY_HEIGHT}px`,
  status: MDE_SHOW_STATUSBAR,
} as SimpleMDE.Options

const options: SimpleMDE.Options = {
  ...defaultOptions,
}

export default options
