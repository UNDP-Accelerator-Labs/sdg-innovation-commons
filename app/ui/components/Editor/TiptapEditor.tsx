"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { MenuBar } from "./MenuBar"

interface Props {
  initialContent: any
  onChange: (sections: any) => void
  editable?: boolean
}

const getInitialHtml = (initialContent: any) => {
  if (!initialContent) return "<p></p>"
  if (typeof initialContent === "string") return initialContent
  if (Array.isArray(initialContent) && initialContent.length) {
    const first = initialContent[0]
    if (!first) return "<p></p>"
    if (typeof first === "string") return first
    if (typeof first === "object") {
      if ("html" in first && first.html) return first.html
      if ("content" in first && typeof first.content === "string") return first.content
      if (Array.isArray((first as any).items) && (first as any).items[0] && (first as any).items[0].txt)
        return (first as any).items[0].txt
    }
  }
  return "<p></p>"
}

export default function TiptapEditor({ initialContent, onChange, editable = true }: Props) {
  const [isReady, setIsReady] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto my-4",
        },
      }),
    ],
    content: getInitialHtml(initialContent),
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
    },
    onCreate: () => {
      setIsReady(true)
    },
  })

  // Keep editor content in sync if initialContent prop changes after mount
  useEffect(() => {
    if (!editor) return
    try {
      const html = getInitialHtml(initialContent)
      const current = editor.getHTML()
      if (current !== html) {
        editor.commands.setContent(html)
      }
    } catch (e) {
      // ignore sync errors
      // console.warn('Failed to sync editor content', e)
    }
  }, [initialContent, editor])

  // Update editor editability when editable prop changes
  useEffect(() => {
    if (!editor) return
    editor.setEditable(editable)
  }, [editable, editor])

  useEffect(() => {
    return () => {
      if (editor) editor.destroy()
      return undefined
    }
  }, [editor])

  if (!isReady) {
    return (
      <div className="w-full h-[300px] border-1 border-black bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading editor...</p>
      </div>
    )
  }

  return (
    <div className="w-full relative z-10">
      <style>{`
        .ProseMirror {
          outline: none;
          font-family: inherit;
          min-height: 300px;
          padding: 16px;
          background-color: #ffffff;
          border: 1px solid #000000;
          border-top: none;
          border-radius: 0;
          position: relative;
          z-index: 10;
          line-height: 1.6;
        }
        .ProseMirror:focus {
          outline: 3px solid #0072bc;
          outline-offset: -3px;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror p:last-child {
          margin-bottom: 0;
        }
        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h1 { font-size: 1.875rem; }
        .ProseMirror h2 { font-size: 1.5rem; }
        .ProseMirror h3 { font-size: 1.25rem; }
        .ProseMirror ul, .ProseMirror ol {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror pre {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
          margin: 0.5rem 0;
        }
        .ProseMirror pre code {
          background: none;
          padding: 0;
          border-radius: 0;
          color: inherit;
          font-size: inherit;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #0072bc;
          padding-left: 1rem;
          margin-left: 0;
          margin-right: 0;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          font-style: italic;
          color: #666;
        }
        .ProseMirror strong {
          font-weight: bold;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: monospace;
          color: #d2f960;
          font-size: 0.875em;
        }
        .ProseMirror hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 1rem 0;
        }
      `}</style>
      {editable && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="w-full relative z-10" />
    </div>
  )
}
