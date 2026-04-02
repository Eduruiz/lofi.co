# Roadmap — lofi.co

## Implementado

- [x] Cenas visuais com variantes (dia/noite, pixel art)
- [x] Audio mixer com efeitos ambientes e controle de volume
- [x] Player de música interno (playlists chill/jazzy/sleepy)
- [x] Integração YouTube (livestreams lofi embeddados)
- [x] Integração Spotify (embed, funciona em produção com HTTPS)
- [x] Pomodoro timer com progress ring, seletor de alarme e session goal
- [x] Floating windows com drag, minimizar animado e estado persistente
- [x] Scrollbar customizada globalmente
- [x] Toggle dia/noite nas cenas
- [x] Fullscreen
- [x] Track info no toolbar (mood + track number)
- [x] Volume slider estilizado (Kobalte) no toolbar e hotspots das cenas
- [x] Restaurar sessão (cena, música, efeitos, widgets e posições em localStorage)
- [x] Templates (presets pré-definidos + salvar/deletar customizados)
- [x] Atalhos de teclado (Space, M, ←→ prev/next, ↑↓ volume, 1-4 paineis, P pomodoro)
- [x] Scroll horizontal suave no scene picker
- [x] Otimização de CPU: apenas o vídeo ativo decodifica (inativos pausados com crossfade)
- [x] Proteção por senha via Netlify Edge Function

## Próximas implementações

### YouTube personalizado
O mixer já tem YouTube com livestreams pré-definidos por mood. A ideia aqui é uma ferramenta separada onde o usuário cola qualquer URL do YouTube e a gente embeda. Útil pra quem tem suas próprias playlists ou quer assistir algo específico enquanto trabalha.

**Prioridade:** média

### Notes
Anotações rápidas dentro do app. Duas abordagens possíveis:
- **Simples:** textarea persistido em localStorage, markdown básico
- **Integração Obsidian:** ler/escrever arquivos .md de um vault local via File System Access API (só funciona em Chromium)

**Prioridade:** média

### Google Calendar
Embed ou integração com Google Calendar pra visualizar eventos do dia. Requer OAuth com Google. Escopo mínimo: exibir eventos do dia/semana, sem criar/editar.

**Prioridade:** baixa — complexidade alta de setup (OAuth), retorno questionável vs ter o calendar aberto em outra aba

## Descartado

- **Links** — redundante com favoritos do navegador
- **PDF reader** — fora do escopo do app
- **Insights** — funcionalidade desconhecida do original, sem interesse
