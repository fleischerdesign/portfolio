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
  apiBaseUrl?: string
}



interface RuntimeConfig {
  openai?: { apiKey?: string }
  anthropic?: { apiKey?: string }
  google?: { apiKey?: string }
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
    nuxt.hook('build:before', async () => {
      console.log('🔄 Starting automatic translation...')
      await translateMarkdownFiles(options, nuxt.options.runtimeConfig as unknown as RuntimeConfig)
    })
  }
})

async function translateMarkdownFiles(config: TranslationConfig, runtimeConfig: RuntimeConfig) {
  const contentDir = 'content'

  try {
    for (const pathConfig of config.paths) {
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
          await translateFile(sourcePath, targetPath, mergedConfig, runtimeConfig)
        }
      }
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`❌ A critical error occurred during the file processing loop: ${errorMessage}`);
  }
}

async function needsTranslation(sourcePath: string, targetPath: string): Promise<boolean> {
  try {
    const sourceStats = await fs.stat(sourcePath)
    const targetStats = await fs.stat(targetPath)

    return sourceStats.mtime > targetStats.mtime
  } catch {
    return true
  }
}

async function translateFile(
  sourcePath: string,
  targetPath: string,
  config: TranslationConfig,
  runtimeConfig: RuntimeConfig
): Promise<void> {
  try {
    const content = await fs.readFile(sourcePath, 'utf-8')

    const translatedContent = await translateCompleteDocument(content, config, runtimeConfig)

    await fs.writeFile(targetPath, translatedContent, 'utf-8')

    console.log(`✅ Translated: ${path.basename(sourcePath)}`)
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(`❌ Error translating ${path.basename(sourcePath)}: ${errorMessage}`);
  }
}

async function translateCompleteDocument(content: string, config: TranslationConfig, runtimeConfig: RuntimeConfig): Promise<string> {
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

  return await callLLMWithPrompt(content, systemPrompt, config, runtimeConfig)
}

async function callLLMWithPrompt(text: string, systemPrompt: string, config: TranslationConfig, runtimeConfig: RuntimeConfig): Promise<string> {
  switch (config.apiProvider) {
    case 'openai':
      return await callOpenAIWithPrompt(text, systemPrompt, config, runtimeConfig)
    case 'anthropic':
      return await callAnthropicWithPrompt(text, systemPrompt, config, runtimeConfig)
    case 'google':
      return await callGoogleWithPrompt(text, systemPrompt, config, runtimeConfig)
    default:
      throw new Error(`Unknown API provider: ${config.apiProvider}`)
  }
}

async function callOpenAIWithPrompt(text: string, systemPrompt: string, config: TranslationConfig, runtimeConfig: RuntimeConfig): Promise<string> {
  const apiKey = runtimeConfig.openai?.apiKey || process.env.NUXT_OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not set in runtimeConfig or process.env (NUXT_OPENAI_API_KEY)')
  }

  const baseUrl = (config.apiBaseUrl || 'https://api.openai.com/v1').replace(/\/$/, '');
  const endpoint = `${baseUrl}/chat/completions`;
  const isOpenRouter = baseUrl.includes('openrouter.ai');

  console.log(`📞 Calling API endpoint: ${endpoint} (Provider: ${isOpenRouter ? 'OpenRouter' : 'OpenAI'})`);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  };

  if (isOpenRouter) {
    headers['HTTP-Referer'] = 'https://fleischer.design'; // Update with your actual site URL
    headers['X-Title'] = 'Fleischer.design Portfolio';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: config.model,
      messages: [{
        role: 'system',
        content: systemPrompt
      }, {
        role: 'user',
        content: text
      }],
      temperature: 0.1
    })
  })

  if (!response.ok) {
    const errorBody = await response.text()
    throw new Error(`API Error (${isOpenRouter ? 'OpenRouter' : 'OpenAI'}): ${response.status} ${response.statusText} - ${errorBody}`)
  }

  const data = (await response.json()) as { choices: Array<{ message: { content: string } }> }
  
  // OpenRouter response structure is compatible with OpenAI
  return data.choices[0].message.content
}

async function callAnthropicWithPrompt(text: string, systemPrompt: string, config: TranslationConfig, runtimeConfig: RuntimeConfig): Promise<string> {
  const apiKey = runtimeConfig.anthropic?.apiKey || process.env.NUXT_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set in runtimeConfig or process.env (NUXT_ANTHROPIC_API_KEY)')
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

  const data = (await response.json()) as { content: Array<{ text: string }> }
  return data.content[0].text
}

async function callGoogleWithPrompt(text: string, systemPrompt: string, config: TranslationConfig, runtimeConfig: RuntimeConfig): Promise<string> {
  const apiKey = runtimeConfig.google?.apiKey || process.env.NUXT_GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not set in runtimeConfig or process.env (NUXT_GOOGLE_API_KEY)')
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

  const data = (await response.json()) as { candidates: Array<{ content: { parts: Array<{ text: string }> } }> }
  return data.candidates[0].content.parts[0].text
}