'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2,
    Undo, Redo, Code
} from 'lucide-react';

interface WYSIWYGEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export default function WYSIWYGEditor({ content, onChange, placeholder }: WYSIWYGEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false, // Fix for Next.js SSR
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3',
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-white/10 rounded-lg overflow-hidden bg-slate-800">
            {/* Toolbar */}
            <div className="border-b border-white/10 p-2 flex flex-wrap gap-1 bg-slate-800/50">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bold') ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Negrita (Ctrl+B)"
                >
                    <Bold className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('italic') ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Cursiva (Ctrl+I)"
                >
                    <Italic className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Título 1"
                >
                    <Heading1 className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Título 2"
                >
                    <Heading2 className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('bulletList') ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Lista sin ordenar"
                >
                    <List className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('orderedList') ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Lista ordenada"
                >
                    <ListOrdered className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-white/10 transition-colors ${editor.isActive('codeBlock') ? 'bg-sky-500/20 text-sky-400' : 'text-gray-400'
                        }`}
                    title="Bloque de código"
                >
                    <Code className="h-4 w-4" />
                </button>

                <div className="w-px h-6 bg-white/10 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-white/10 transition-colors text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Deshacer (Ctrl+Z)"
                >
                    <Undo className="h-4 w-4" />
                </button>

                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-white/10 transition-colors text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Rehacer (Ctrl+Y)"
                >
                    <Redo className="h-4 w-4" />
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {!content && placeholder && (
                <div className="absolute top-14 left-4 text-gray-500 pointer-events-none">
                    {placeholder}
                </div>
            )}
        </div>
    );
}
