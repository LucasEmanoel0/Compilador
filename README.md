# Compilador Jack — Analisador Léxico, Sintático e Geração XML

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


## Minha contribuição — Scanner e integração

Minha responsabilidade no projeto foi desenvolver o analisador léxico (Scanner) da linguagem Jack, implementar testes de validação e realizar a integração com o Parser e o XmlWriter.


### Funcionalidades implementadas

- Reconhecimento de palavras reservadas (keywords) da linguagem Jack.

- Identificação de símbolos e operadores.

- Reconhecimento de identificadores.

- Leitura de constantes inteiras, com validação do limite de 0 a 32767.

- Reconhecimento de constantes de texto (strings).

- Ignorar comentários de linha (//) e de bloco (/* ... */).

- Rastreamento de linhas e colunas dos tokens.

- Identificação de caracteres inválidos.

- Tratamento de strings e comentários de bloco não fechados.

- Geração de tokens compatíveis com o Parser.

- Integração dos componentes Scanner, Parser e XmlWriter.

### Testes realizados

Foram realizados testes de tokenização de programas Jack e de tratamento de erros léxicos.

Os testes verificaram o reconhecimento dos tokens e situações como números acima do limite permitido, strings não fechadas, comentários de bloco não fechados e caracteres inválidos.

A integração também foi testada com um programa Jack contendo declarações de variáveis, atribuições, chamadas de sub-rotinas e retorno, gerando sua representação XML.



## Estrutura do projeto

```text
Compilador/
├── src/
│   ├── scanner/
│   │   └── Scanner.js
│   └── parser/
│       ├── Parser.js
│       └── XmlWriter.js
├── tests/
│   ├── scanner/
│   │   └── erros.test.js
│   └── parser/
│       ├── referencias/
│       ├── testes_avancados.js
│       ├── comparar_oficial.js
│       ├── validar_oficial.py
│       └── validar_todos.py
├── main.js
├── teste.js
└── README.md
```

O arquivo `main.js` é responsável por integrar o Scanner, o Parser e o XmlWriter, permitindo executar a análise completa de um programa Jack e gerar sua representação XML.

## Como executar o projeto

Com o Node.js instalado, execute os comandos a partir da raiz do repositório.

### Executar o Scanner

```bash
node teste.js
```

### Executar a integração completa

```bash
node main.js Main.jack Main.xml
```
O programa recebe um arquivo `.jack` como entrada, realiza a análise léxica e sintática e gera um arquivo XML com a árvore de análise sintática.

Exemplo de execução:

```bash
node main.js Main.jack Main.xml
```

**Arquivo de entrada:** `Main.jack`

**Arquivo de saída:** `Main.xml`

O nome do arquivo XML pode ser definido pelo usuário no segundo argumento do comando.

## Testes e validação

Foram realizados testes para verificar o reconhecimento dos tokens, a análise sintática, a geração de XML e o tratamento de entradas inválidas.

Execute os comandos a partir da raiz do projeto.

### Testes do Scanner

Para executar os testes de erros léxicos:

```bash
node tests/scanner/erros.test.js
```

Os quatro testes foram aprovados, verificando números acima do limite permitido, strings não fechadas, comentários de bloco não fechados e caracteres inválidos.

### Testes do Parser

```bash
node tests/parser/testes_avancados.js
```

Foram executados oito testes avançados, todos aprovados.

### Validação com referências oficiais

```bash
python tests/parser/validar_todos.py
```

A validação requer Python 3 e acesso à internet para obter os arquivos de referência, quando necessário.

Na validação realizada, seis dos sete casos foram aprovados.

O caso `Square/SquareGame.xml` apresentou uma diferença: o arquivo de entrada `SquareGameT.xml` possui 313 tokens, enquanto o XML oficial de referência contém 356 tokens.

O Parser preservou os 313 tokens recebidos, indicando uma incompatibilidade entre os arquivos utilizados na comparação.

Essa diferença permanece documentada para investigação.

## Histórico de desenvolvimento — Parser e XmlWriter

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