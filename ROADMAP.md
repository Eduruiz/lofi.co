# Roadmap — lofi.co

## Implementado

- [x] Cenas visuais com variantes (dia/noite, pixel art)
- [x] Audio mixer com efeitos ambientes e controle de volume
- [x] Player de música interno (playlists chill/jazzy/sleepy)
- [x] Integração YouTube (livestreams lofi embeddados)
- [x] Integração Spotify (embed, funciona em produção com HTTPS)
- [x] Pomodoro timer com progress ring, seletor de alarme e session goal
- [x] Floating windows com drag, minimizar animado e estado persistente
- [x] Scrollbar customizada nos paineis
- [x] Toggle dia/noite nas cenas
- [x] Fullscreen
- [x] Track info no toolbar (mood + track number)
- [x] Volume slider estilizado (Kobalte) no toolbar e hotspots das cenas

## Próximas implementações

### Restaurar sessão
Persistir o estado atual automaticamente em localStorage pra que ao dar F5 ou voltar ao site tudo continue de onde parou. Estado a persistir:
- Cena ativa (e variante dia/noite/pixel)
- Music source (lofi/spotify/youtube) e mood selecionado
- Volume da música e volumes dos efeitos
- Posição dos floating windows
- Estado do pomodoro (modo, tempo restante se pausado, ciclos completados)

**Prioridade:** alta — qualidade de vida essencial

### Templates (presets de ambiente)
Salvar e restaurar combinações completas de: cena + mood + source + efeitos + volumes. Em um clique o usuário entra no "clima" desejado. Exemplos: "Café chuvoso", "Floresta noturna", "Deep focus".

Possível implementação:
- Alguns templates pré-definidos que já vem com o app
- Usuário pode criar/editar/deletar os seus (persistidos em localStorage)
- UI: floating window com lista de templates, botão de salvar estado atual como novo template

**Prioridade:** alta — complementa o restaurar sessão

### YouTube personalizado
O mixer já tem YouTube com livestreams pré-definidos por mood. A ideia aqui é uma ferramenta separada onde o usuário cola qualquer URL do YouTube e a gente embeda. Útil pra quem tem suas próprias playlists ou quer assistir algo específico enquanto trabalha.

**Prioridade:** média — complementa o sistema de música atual

### Notes
Anotações rápidas dentro do app. Duas abordagens possíveis:
- **Simples:** textarea persistido em localStorage, markdown básico
- **Integração Obsidian:** ler/escrever arquivos .md de um vault local via File System Access API (só funciona em Chromium). Seria diferencial mas limita compatibilidade.

**Decisão pendente:** vale a integração com Obsidian ou um notepad simples resolve?

**Prioridade:** média

### Google Calendar
Embed ou integração com Google Calendar pra visualizar eventos do dia. Requer OAuth com Google (client ID, redirect, consent screen). Escopo mínimo: exibir eventos do dia/semana, sem criar/editar.

**Prioridade:** baixa — complexidade alta de setup (OAuth), retorno questionável vs ter o calendar aberto em outra aba

### Melhorias gerais

- **Atalhos de teclado** — space pra play/pause, M pra mute, etc.
- **Track info YouTube** — hardcodar nomes dos livestreams (são só 3 fixos)

## Descartado

- **Links** — redundante com favoritos do navegador
- **PDF reader** — fora do escopo do app
- **Insights** — funcionalidade desconhecida do original, sem interesse
