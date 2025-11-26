"use client"

import type React from "react"

import type { Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  FolderLock as CodeBlock,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react"
import { useRef } from "react"

interface MenuBarProps {
  editor: Editor | null
}

export function MenuBar({ editor }: MenuBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) {
    return null
  }

  const buttonClass = (isActive: boolean) =>
    `relative px-3 py-2 text-sm font-medium transition-all ${
      isActive
        ? "bg-[#0072bc] text-white border-2 border-[#0072bc]"
        : "bg-white text-black border-2 border-black hover:bg-gray-50"
    }`

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        editor.chain().focus().setImage({ src: imageUrl }).run()
      }
      reader.readAsDataURL(file)
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="border-1 border-black bg-white p-3 space-y-2 mb-4">
      <div className="flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={buttonClass(editor.isActive("bold"))}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={buttonClass(editor.isActive("italic"))}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={buttonClass(editor.isActive("strike"))}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={buttonClass(editor.isActive("code"))}
          title="Inline Code"
        >
          <Code className="w-4 h-4 inline" />
        </button>

        {/* Insert Link */}
        <button
          onClick={async () => {
            try {
              if (editor.isActive('link')) {
                // if selection already has a link, remove it
                editor.chain().focus().unsetLink().run()
                return
              }
              const url = window.prompt('Enter URL (including http:// or https://)')
              if (!url) return
              // apply link mark; if there's no selection text, Tiptap will apply the mark when user types
              editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim(), target: '_blank', rel: 'noopener noreferrer' }).run()
            } catch (e) {
              console.error('Failed to insert link', e)
            }
          }}
          className={buttonClass(editor.isActive('link'))}
          title={editor.isActive('link') ? 'Remove link' : 'Insert link'}
        >
          <LinkIcon className="w-4 h-4 inline" />
        </button>

        {/* Divider */}
        <div className="w-px bg-black mx-1"></div>

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={buttonClass(editor.isActive("heading", { level: 3 }))}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4 inline" />
        </button>

        {/* Divider */}
        <div className="w-px bg-black mx-1"></div>

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={buttonClass(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={buttonClass(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4 inline" />
        </button>

        {/* Divider */}
        <div className="w-px bg-black mx-1"></div>

        {/* Code Block & Quote */}
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={buttonClass(editor.isActive("codeBlock"))}
          title="Code Block"
        >
          <CodeBlock className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={buttonClass(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote className="w-4 h-4 inline" />
        </button>

        {/* Divider */}
        <div className="w-px bg-black mx-1"></div>

        <button onClick={() => fileInputRef.current?.click()} className={buttonClass(false)} title="Attach Image">
          <ImageIcon className="w-4 h-4 inline" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload image"
        />

        {/* Divider */}
        <div className="w-px bg-black mx-1"></div>

        {/* History */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className={buttonClass(false)}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4 inline" />
        </button>

        <button
          onClick={() => editor.chain().focus().redo().run()}
          className={buttonClass(false)}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4 inline" />
        </button>
      </div>
    </div>
  )
}
