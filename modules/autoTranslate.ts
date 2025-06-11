// modules/auto-translate.ts
import { promises as fs } from 'fs'
import path from 'path'
import { defineNuxtModule } from 'nuxt/kit'

interface PathConfig {
  sourcePath: string
  targetPath: string
  fieldsToTranslate?: string[]
}

interface TranslationConfig {
  apiProvider: 'openai' | 'anthropic' | 'google'
  model: string
  maxChunkSize: number
  sourceLocale: string
  targetLocale: string
  fieldsToTranslate: string[]
  paths: PathConfig[]
}

const defaultConfig: TranslationConfig = {
  apiProvider: 'openai',
  model: 'gpt-4',
  maxChunkSize: 2000,
  sourceLocale: 'de',
  targetLocale: 'en',
  fieldsToTranslate: ['title', 'description', 'tags'],
  paths: [
    {
      sourcePath: 'posts', // Relativer Pfad unterhalb des Locale-Ordners
      targetPath: 'posts'  // Zielpfad (kann anders sein)
    }
  ]
}

export default defineNuxtModule<TranslationConfig>({
  meta: {
    name: '@my/auto-translate',
    configKey: 'autoTranslate'
  },
  defaults: {
    apiProvider: 'openai',
    model: 'gpt-4',
    maxChunkSize: 2000,
    sourceLocale: 'de',
    targetLocale: 'en',
    fieldsToTranslate: ['title', 'description', 'tags']
  },
  setup(options, nuxt) {
    // Hook in den Build-Prozess
    nuxt.hook('build:before', async () => {
      console.log('🔄 Starting automatic translation...')
      await translateMarkdownFiles(options)
    })
  }
})

async function translateMarkdownFiles(config: TranslationConfig) {
  const contentDir = 'content'
  
  try {
    for (const pathConfig of config.paths) {
      // Merge pfadspezifische und globale Felder
      const fieldsToTranslate = pathConfig.fieldsToTranslate || config.fieldsToTranslate
      const mergedConfig = { ...config, fieldsToTranslate }

      const sourceDir = path.join(contentDir, config.sourceLocale, pathConfig.sourcePath)
      const targetDir = path.join(contentDir, config.targetLocale, pathConfig.targetPath)
      
      console.log(`📂 Processing path: ${sourceDir} → ${targetDir} (Fields: ${fieldsToTranslate.join(', ')})`)

      await fs.mkdir(targetDir, { recursive: true })
      const files = await fs.readdir(sourceDir)
      const markdownFiles = files.filter(file => file.endsWith('.md'))

      for (const file of markdownFiles) {
        const sourcePath = path.join(sourceDir, file)
        const targetPath = path.join(targetDir, file)
        
        if (await needsTranslation(sourcePath, targetPath)) {
          console.log(`🔄 Translating: ${file}`)
          await translateFile(sourcePath, targetPath, mergedConfig) // mergedConfig verwenden
        }
      }
    }
  } catch (error) {
    console.error('❌ Translation error:', error)
    throw error
  }
}

async function needsTranslation(sourcePath: string, targetPath: string): Promise<boolean> {
  try {
    const sourceStats = await fs.stat(sourcePath)
    const targetStats = await fs.stat(targetPath)
    
    // Übersetze nur wenn Quelle neuer ist
    return sourceStats.mtime > targetStats.mtime
  } catch {
    // Zieldatei existiert nicht
    return true
  }
}

async function translateFile(
  sourcePath: string, 
  targetPath: string, 
  config: TranslationConfig
): Promise<void> {
  try {
    const content = await fs.readFile(sourcePath, 'utf-8')
    
    // Übersetze komplettes Dokument mit spezifischen Anweisungen
    const translatedContent = await translateCompleteDocument(content, config)
    
    await fs.writeFile(targetPath, translatedContent, 'utf-8')
    
    console.log(`✅ Translated: ${path.basename(sourcePath)}`)
  } catch (error) {
    console.error(`❌ Error translating ${sourcePath}:`, error)
    throw error
  }
}

async function translateCompleteDocument(content: string, config: TranslationConfig): Promise<string> {
  const systemPrompt = `Du bist ein professioneller Übersetzer. Übersetze das folgende Markdown-Dokument von Deutsch ins Englische.

WICHTIGE REGELN:
- Übersetze NUR den Textinhalt, niemals die Markdown-Syntax oder YAML-Struktur
- Behalte das komplette Frontmatter-Format (--- ... ---) bei
- Übersetze im Frontmatter NUR diese Felder: ${config.fieldsToTranslate.join(', ')}
- Übersetze NICHT: date, slug, id, permalink, draft, published
- Behalte alle Markdown-Formatierungen (##, **, [], (), etc.) exakt bei
- Gib das komplette Dokument zurück mit identischer Struktur

Beispiel:
EINGABE:
---
title: "Deutscher Titel"
date: "2024-01-15"
slug: "mein-artikel"
---
# Deutsche Überschrift
Deutscher Text mit **fetter** Formatierung.

AUSGABE:
---
title: "German Title"
date: "2024-01-15"
slug: "mein-artikel"
---
# German Headline  
German text with **bold** formatting.`

  return await callLLMWithPrompt(content, systemPrompt, config)
}

async function callLLMWithPrompt(text: string, systemPrompt: string, config: TranslationConfig): Promise<string> {
  switch (config.apiProvider) {
    case 'openai':
      return await callOpenAIWithPrompt(text, systemPrompt, config)
    case 'anthropic':
      return await callAnthropicWithPrompt(text, systemPrompt, config)
    case 'google':
      return await callGoogleWithPrompt(text, systemPrompt, config)
    default:
      throw new Error(`Unknown API provider: ${config.apiProvider}`)
  }
}

async function callOpenAIWithPrompt(text: string, systemPrompt: string, config: TranslationConfig): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.model,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: text
      }],
      temperature: 0.1 // Niedrige Temperatur für konsistente Formatierung
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

async function callAnthropicWithPrompt(text: string, systemPrompt: string, config: TranslationConfig): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY environment variable is not set')
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: text
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`Anthropic API Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.content[0].text
}

async function callGoogleWithPrompt(text: string, systemPrompt: string, config: TranslationConfig): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY environment variable is not set')
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nÜbersetze das folgende Dokument:\n\n${text}`
        }]
      }]
    })
  })

  if (!response.ok) {
    throw new Error(`Google API Error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}