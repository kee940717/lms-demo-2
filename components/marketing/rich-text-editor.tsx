"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Quote,
  Type,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing your email content...",
}: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(content)
  const [selectedText, setSelectedText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  const handleContentChange = (value: string) => {
    setEditorContent(value)
    onChange(value)
  }

  const insertAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = editorContent.substring(0, start) + textToInsert + editorContent.substring(end)

    handleContentChange(newContent)

    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length)
    }, 0)
  }

  const wrapSelectedText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = editorContent.substring(start, end)

    if (selectedText) {
      const replacement = before + selectedText + after
      const newContent = editorContent.substring(0, start) + replacement + editorContent.substring(end)
      handleContentChange(newContent)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(start, start + replacement.length)
      }, 0)
    } else {
      // If no text selected, just insert the tags
      insertAtCursor(before + after)
    }
  }

  const insertVariable = (variable: string) => {
    insertAtCursor(`{{${variable}}}`)
  }

  const insertTemplate = (templateType: string) => {
    const templates = {
      header: `
<div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
  <h1 style="margin: 0; font-size: 28px; font-weight: bold;">RadiologyLMS</h1>
  <p style="margin: 10px 0 0 0; opacity: 0.9;">Professional Radiology Education</p>
</div>
`,
      button: `
<div style="text-align: center; margin: 30px 0;">
  <a href="{{dashboardUrl}}" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Get Started</a>
</div>
`,
      footer: `
<div style="background: #f8fafc; padding: 30px 20px; text-align: center; border-radius: 0 0 8px 8px; margin-top: 40px;">
  <p style="margin: 0; color: #64748b; font-size: 14px;">
    © 2024 RadiologyLMS. All rights reserved.<br>
    <a href="{{unsubscribeUrl}}" style="color: #2563eb;">Unsubscribe</a> | <a href="#" style="color: #2563eb;">Update Preferences</a>
  </p>
</div>
`,
      divider: `
<div style="margin: 30px 0;">
  <hr style="border: none; height: 1px; background: #e2e8f0;">
</div>
`,
      highlight: `
<div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
  <p style="margin: 0; color: #92400e;"><strong>Important:</strong> Your highlighted content goes here.</p>
</div>
`,
      course: `
<div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; background: white;">
  <h3 style="margin: 0 0 10px 0; color: #1f2937;">{{courseName}}</h3>
  <p style="margin: 0 0 15px 0; color: #6b7280;">Course description and key learning objectives.</p>
  <div style="margin-bottom: 15px;">
    <span style="background: #dbeafe; color: #1e40af; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px;">Beginner</span>
    <span style="background: #dcfce7; color: #166534; padding: 4px 8px; border-radius: 4px; font-size: 12px;">4 hours</span>
  </div>
  <a href="{{courseUrl}}" style="background: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Enroll Now</a>
</div>
`,
    }

    const template = templates[templateType as keyof typeof templates]
    insertAtCursor(template)
  }

  const formatButtons = [
    {
      label: "Bold",
      icon: Bold,
      action: () => wrapSelectedText("<strong>", "</strong>"),
      shortcut: "Ctrl+B",
    },
    {
      label: "Italic",
      icon: Italic,
      action: () => wrapSelectedText("<em>", "</em>"),
      shortcut: "Ctrl+I",
    },
    {
      label: "Underline",
      icon: Underline,
      action: () => wrapSelectedText('<span style="text-decoration: underline;">', "</span>"),
      shortcut: "Ctrl+U",
    },
  ]

  const structureButtons = [
    {
      label: "Heading 1",
      icon: Type,
      action: () => wrapSelectedText("<h1>", "</h1>"),
    },
    {
      label: "Heading 2",
      icon: Type,
      action: () => wrapSelectedText("<h2>", "</h2>"),
    },
    {
      label: "Paragraph",
      icon: Type,
      action: () => wrapSelectedText("<p>", "</p>"),
    },
  ]

  const alignButtons = [
    {
      label: "Left",
      icon: AlignLeft,
      action: () => wrapSelectedText('<div style="text-align: left;">', "</div>"),
    },
    {
      label: "Center",
      icon: AlignCenter,
      action: () => wrapSelectedText('<div style="text-align: center;">', "</div>"),
    },
    {
      label: "Right",
      icon: AlignRight,
      action: () => wrapSelectedText('<div style="text-align: right;">', "</div>"),
    },
  ]

  const listButtons = [
    {
      label: "Bullet List",
      icon: List,
      action: () => insertAtCursor("<ul>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ul>"),
    },
    {
      label: "Numbered List",
      icon: ListOrdered,
      action: () => insertAtCursor("<ol>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</ol>"),
    },
  ]

  const variables = [
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "courseName", label: "Course Name" },
    { key: "courseUrl", label: "Course URL" },
    { key: "dashboardUrl", label: "Dashboard URL" },
    { key: "unsubscribeUrl", label: "Unsubscribe URL" },
    { key: "companyName", label: "Company Name" },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rich Text Email Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toolbar */}
        <div className="border rounded-lg p-3 space-y-3">
          {/* Format Buttons */}
          <div className="flex items-center space-x-1 flex-wrap gap-2">
            <div className="flex space-x-1">
              {formatButtons.map((button) => (
                <Button
                  key={button.label}
                  variant="outline"
                  size="sm"
                  onClick={button.action}
                  title={`${button.label} (${button.shortcut})`}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex space-x-1">
              {structureButtons.map((button) => (
                <Button key={button.label} variant="outline" size="sm" onClick={button.action} title={button.label}>
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex space-x-1">
              {alignButtons.map((button) => (
                <Button key={button.label} variant="outline" size="sm" onClick={button.action} title={button.label}>
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex space-x-1">
              {listButtons.map((button) => (
                <Button key={button.label} variant="outline" size="sm" onClick={button.action} title={button.label}>
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = prompt("Enter URL:")
                if (url) {
                  wrapSelectedText(`<a href="${url}" style="color: #2563eb;">`, "</a>")
                }
              }}
              title="Insert Link"
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                insertAtCursor(
                  '<blockquote style="border-left: 4px solid #e5e7eb; padding-left: 16px; margin: 16px 0; font-style: italic;">Quote text</blockquote>',
                )
              }
              title="Insert Quote"
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const url = prompt("Enter image URL:")
                if (url) {
                  insertAtCursor(`<img src="${url}" alt="Image" style="max-width: 100%; height: auto;">`)
                }
              }}
              title="Insert Image"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>

          {/* Variables */}
          <div>
            <p className="text-sm font-medium mb-2">Insert Variables:</p>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Badge
                  key={variable.key}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => insertVariable(variable.key)}
                >
                  {`{{${variable.key}}}`}
                </Badge>
              ))}
            </div>
          </div>

          {/* Email Templates */}
          <div>
            <p className="text-sm font-medium mb-2">Insert Components:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => insertTemplate("header")}>
                Header
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("button")}>
                Button
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("course")}>
                Course Card
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("highlight")}>
                Highlight Box
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("divider")}>
                Divider
              </Button>
              <Button variant="outline" size="sm" onClick={() => insertTemplate("footer")}>
                Footer
              </Button>
            </div>
          </div>
        </div>

        {/* Text Editor */}
        <div className="space-y-2">
          <Textarea
            ref={textareaRef}
            value={editorContent}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm"
            onSelect={(e) => {
              const target = e.target as HTMLTextAreaElement
              const selected = target.value.substring(target.selectionStart, target.selectionEnd)
              setSelectedText(selected)
            }}
          />
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            💡 <strong>Tips:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Select text and use formatting buttons to apply styles</li>
            <li>Use variables like {`{{firstName}}`} for personalization</li>
            <li>Insert pre-built components for consistent styling</li>
            <li>HTML tags are supported for advanced formatting</li>
            <li>Use the preview function to test your email</li>
          </ul>
        </div>

        {/* Character Count */}
        <div className="text-xs text-muted-foreground text-right">{editorContent.length} characters</div>
      </CardContent>
    </Card>
  )
}
