# Git Hooks com Husky

Este diretório contém os hooks do Git gerenciados pelo Husky.

## Instalação Automática

Os hooks são instalados automaticamente quando você executa:
- `yarn install` (via script `prepare` no package.json)
- `npm install` (via script `prepare` no package.json)

## Instalação Manual

Se o Husky não estiver instalado ou se precisar instalar manualmente:

### Linux/Mac
```bash
bash scripts/install-hooks.sh
```

### Windows (PowerShell)
```powershell
.\scripts\install-hooks.ps1
```

## Hooks Disponíveis

### pre-push
Executado antes de cada `git push`. Valida:
- ✅ `yarn test` - Testes do pacote
- ✅ `yarn build` - Build do @pantanal/grid
- ✅ `yarn playground:build` - Build do playground
- ✅ `yarn docs:build` - Build da documentação

Se algum check falhar, o push será bloqueado.

## Bypass (Não Recomendado)

Se precisar fazer push sem validação (não recomendado):
```bash
git push --no-verify
```

**Atenção**: Use apenas se tiver certeza do que está fazendo!


