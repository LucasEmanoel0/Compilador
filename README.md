# Compilador Jack — Analisador Sintático e Geração XML

## Sobre o projeto

Este repositório contém o desenvolvimento de um compilador para a linguagem Jack, como parte do Projeto 10 do curso Nand2Tetris.

O projeto é dividido em duas partes principais:

- **Analisador léxico (Scanner):** responsável por identificar e classificar os tokens do código Jack.
- **Analisador sintático (Parser):** responsável por reconhecer as estruturas da linguagem e gerar uma representação em XML.

## Minha contribuição — Parser e XmlWriter

Minha responsabilidade no projeto foi desenvolver o analisador sintático e a geração de XML.

### Funcionalidades implementadas

- Leitura e navegação pelos tokens.
- Reconhecimento de classes e declarações de variáveis.
- Análise de construtores, funções e métodos.
- Reconhecimento de parâmetros e variáveis locais.
- Processamento dos comandos `let`, `if`, `while`, `do` e `return`.
- Análise de expressões e termos.
- Geração de XML estruturado.
- Tratamento de caracteres especiais no XML.
- Identificação de erros sintáticos.

## Estrutura do projeto

```text
Compilador/
├── src/
│   ├── lexer/
│   │   └── Scanner.js
│   ├── parser/
│   │   ├── Parser.js
│   │   └── XmlWriter.js
│   └── main.js
├── tests/
│   └── parser/
│       ├── testes_avancados.js
│       ├── comparar_oficial.js
│       ├── validar_oficial.py
│       └── validar_todos.py
├── README.md
└── package.json
```

*Observação: Scanner.js e main.js fazem parte da estrutura prevista para integração com os demais componentes.*

## Testes e validação

Foram desenvolvidos testes para verificar o reconhecimento das estruturas sintáticas, a geração de XML e o tratamento de entradas inválidas.

Para executar os testes locais, a partir da raiz do projeto:

```bash
node tests/parser/testes_avancados.js
```

Para executar a validação com exemplos oficiais:

```bash
cd tests/parser
python validar_todos.py
```

A validação oficial requer Python 3 e acesso à internet para obter os arquivos de referência.

## Histórico de desenvolvimento

O desenvolvimento da minha parte foi organizado em quatro etapas:

1. **Etapa 1:** estrutura inicial do Parser e XmlWriter.
2. **Etapa 2:** implementação de declarações, sub-rotinas e comandos.
3. **Etapa 3:** ampliação da análise sintática e inclusão dos testes.
4. **Etapa 4:** validação final, comparação com exemplos oficiais e documentação.

## Tecnologias utilizadas

- JavaScript
- Node.js
- Python 3
- XML
- Git e GitHub
- Visual Studio Code

## Referência

Projeto educacional [Nand2Tetris](https://www.nand2tetris.org/), Projeto 10 — Compiler I: Syntax Analysis.