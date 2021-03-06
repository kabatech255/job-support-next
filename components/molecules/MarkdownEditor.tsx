import React, { useState, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import 'easymde/dist/easymde.min.css'
import { MarkdownPreview } from '@/components/atoms'
import { options as ops, useEditorStyles } from '@/lib/simplemde'
import SimpleMDE from 'easymde'
import { Button, Typography } from '@material-ui/core'
import clsx from 'clsx'
import type { Editor, EditorChangeLinkedList, KeyMap } from 'codemirror'
import { useImageMarkedLine } from '@/hooks'

const SimpleMde = dynamic(() => import('react-simplemde-editor'), {
  ssr: false,
})

interface Props {
  value?: string
  onChange?: (value: string) => void
  options?: SimpleMDE.Options
}

// eslint-disable-next-line react/display-name
const MarkdownEditor = React.memo(({ value, onChange, options }: Props) => {
  const classes = useEditorStyles()
  const [editorValue, setEditorValue] = useState(value || '')
  const [previewHidden, setPreviewHidden] = useState<boolean>(true)
  const [currentLine, setCurrentLine] = useState<number>(0)
  const { imageMarkedLine, setImageMarkedLine, imageUploadFunction } =
    useImageMarkedLine()
  // 記事の入力時
  const handleChange = useCallback((value: string) => {
    setEditorValue(value)
    if (!!onChange) {
      onChange(value)
    }
  }, [])

  useEffect(() => {
    if (value !== undefined) {
      setEditorValue(value)
    }
  }, [value])

  const mergedOption = useMemo(
    () =>
      !!options
        ? {
            ...ops,
            ...options,
            imageUploadFunction,
          }
        : {
            ...ops,
            imageUploadFunction,
          },
    []
  )

  const handleToggleClick = () => {
    setPreviewHidden(!previewHidden)
  }

  const toggleText = previewHidden ? 'プレビュー' : '閉じる'

  const insertImageText = () => {
    const contentArr = editorValue.split('\n')
    contentArr.splice(currentLine, 0, imageMarkedLine)
    const newValue = contentArr.join('\n')
    setEditorValue(newValue)
    if (!!onChange) {
      onChange(newValue)
    }
  }

  // 画像挿入後のマークダウンをカーソル位置に挿入
  useEffect(() => {
    if (imageMarkedLine !== '') {
      insertImageText()
      setImageMarkedLine('')
    }
  }, [imageMarkedLine])

  const extraKeys = useMemo<KeyMap>(() => {
    return {
      Up: function (editor: Editor) {
        const position = editor.getCursor()
        // カーソル位置が一番上(=0)の場合はマイナスにならないようにする
        const newLine = position.line === 0 ? position.line : position.line - 1
        editor.setCursor({
          line: newLine,
          ch: position.ch,
        })
        setCurrentLine(newLine)
      },
      Down: function (editor: Editor) {
        const position = editor.getCursor()
        /**
         * editor.getCursor()は行位置のインデックス
         * editor.lineCount()は単純な行数
         * よって、カーソル位置が一番下のとき、"getCursor().line" === "lineCount() - 1"
         */
        const newLine =
          position.line === editor.lineCount() - 1
            ? position.line
            : position.line + 1
        editor.setCursor({
          line: newLine,
          ch: position.ch,
        })
        setCurrentLine(newLine)
      },
    }
  }, [])

  // Enterキーを押すとカーソル位置の更新が必要なため
  const events = useMemo(
    () => ({
      change: (instance: Editor, changeObj: EditorChangeLinkedList) => {
        setCurrentLine(instance.getCursor().line)
      },
    }),
    []
  )

  return (
    <div>
      <div className={classes.mde}>
        <SimpleMde
          className={classes.col}
          value={editorValue}
          onChange={handleChange}
          options={mergedOption}
          events={events}
          extraKeys={extraKeys}
        />
        <div
          className={clsx(classes.preview, {
            [classes.hidden]: previewHidden,
          })}
        >
          {editorValue ? (
            <MarkdownPreview editorValue={editorValue} />
          ) : (
            <Typography variant={'h5'} className={classes.previewOperator}>
              ここにプレビューが表示されます。
            </Typography>
          )}
        </div>
      </div>
      <Button
        className={classes.toggle}
        variant="outlined"
        color={'secondary'}
        onClick={handleToggleClick}
      >
        {toggleText}
      </Button>
    </div>
  )
})

export default MarkdownEditor
