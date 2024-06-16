---
insertDate: "23/03/2021 22:54"
author: "Fernando Kanashiro"
image: "assets/img/posts/solid/solid-title.jpg"
title: "SOLID"
id: 2
---

# SOLID

<img src="assets/img/posts/solid/solid-title.jpg" class="max-width-fixed" alt="" width="100%"/>

Caso já tenha estudado sobre programação orientada a objetos, provavelmente, já deve ter ouvido falar sobre o SOLID, foi assim que acabei conhecendo o que ele era. Ou, até mesmo, em alguma vaga que passou pela sua linha do tempo do LinkedIn e que apareceu que seria desejado o conhecimento dessas siglas. Mas afinal, o que de fato significa essas siglas e qual sua importância para a programação orientada a objetos?

Em um mundo cheio de siglas que é a programação, SOLID surge como um acrônimo de alguns princípios que ajudarão na manutenção e legibilidade do seu código no mundo de POO (Programação Orientada a Objetos). Sendo um acrônimo, cada sigla tem um nome por trás, que no caso, são os nomes de alguns princípios, sendo eles: 

- Single Responsability Principle (Princípio da Responsabilidade Única)
- Open-Closed Principle (Princípio Aberto-Fechado)
- Liskov Substitution Principle (Princípio de Substituição de Liskov)
- Interface Segregation Principle (Princípio da Segregação de Interface)
- Dependency Inversion Principle (Princípio da Inversão de Dependência)

<img src="assets/img/posts/solid/confused.gif" class="max-width-fixed" alt="Meme confuso com os princípios" width="100%"/>

Ainda assim, pode parecer um pouco assustador, ouvir o nome de todos esses princípios. Mas, não precisa esquentar a cabeça, que nessa postagem explicarei um pouco de cada princípio, um de cada vez, usando um projeto que desenvolvi enquanto estou estudando, de um jogo que eu gosto muito, o xadrez.

## Contextualizando o projeto

Como utilizarei o xadrez como projeto para exemplificar os conceitos, vale mencionar como desenhei o projeto. Para quem não conhece as regras, o xadrez é jogado em um tabuleiro 8x8, com 16 peças para cada jogador. Dessas peças, temos 8 peões, 2 torres, 2 bispos, 2 cavalos, 1 rainha e o 1 rei para cada jogador (brancas e pretas).

Cada uma dessas peças tem uma forma de se movimentar no tabuleiro, por exemplo, a torre anda na vertical e horizontal, o bispo anda nas diagonais e o cavalo anda em L, enfim, cada peça tem sua forma de mover, na qual não entrarei muito em detalhes.

Para processar todo esse jogo de xadrez, eu desenhei para o projeto um mapa dos processos que serão rodados de ponta a ponta e é por meio deles que irei me basear, sendo assim, apresento o kanachess:

<img src="assets/img/posts/solid/KanaChess.png" alt="Desenho do projeto" width="100%"/>

Então, para o projeto, já pensando em separar as responsabilidades visualmente para pôr em prática na construção da aplicação, em cor amarela é por onde vou comunicar com o cliente através de WebSocket, na cor azul são os processos que efetivam o movimento recebido e em cor verde é o processamento do estado atual do tabuleiro.

Sendo com esse contexto, que desbravaremos o mundo do SOLID, vamos lá?

## Single Responsability Principle

Não sei você já deve ter se deparado com uma classe tão grande que dava até medo de mexer. Uma classe que fazia de tudo e mais um pouco. Uma classe, que não só recebe o movimento em PGN (Portable Game Notation), mas também tinha a responsabilidade de verificar se é um movimento valido, processar o movimento recebido, descobrir todos os movimentos possíveis para as peças. É tanta coisa, que até parece uma classe deus.

<img src="assets/img/posts/solid/s_principle.jpg" alt="Desenho do projeto" width="100%"/>

O problema dessa abordagem, é que qualquer alteração/manutenção que tenha de fazer, diversos outros processos podem ser impactados. Por eles, estarem, no mesmo bloco de código, a chance de surgir um bug é muito alta. Fora que a legibilidade do código não é tão clara, e, provavelmente, a alteração seria muito mais difícil de ser feita. 

Isso não ocorreria, se seguirmos a letra S do acrônimo, na qual diz: “Uma classe deveria ter apenas uma única razão para ser alterada”. Sendo assim, não deveríamos ter classes que fazem mais coisas que o seu propósito. Começar a pensar em separar melhor as classes de forma que ela não fique sobrecarregada é a principal mensagem que esse princípio nos traz.

Sendo assim, dentro do contexto construído, um dos exemplos que trago é a cor azul do processo, na qual as várias etapas da imagem foram separadas em classes, para que o método responsável por essa parte não fique muito sobrecarregada, afinal, é o que queremos evitar. Sendo assim:

```kotlin
class ProcessNormalChessBoardEngine(private val board: IBoard) {

    fun process(){
        ResetPiecesStatusProcess(board).execute() // Limpa qualquer sujeira de status que possa ter da rodada anterior
        AvailablePieceCoordinatesProcess(board, board.allPieces).execute() // Descobre os movimentos possiveis das peças
        AvailablePieceSpecialMovementsProcess(board, board.allPieces).execute() // Descobre os movimentos especiais possiveis
        FilterMovesKingUnderAttackProcess(board).execute() // Filtra os movimentos se rei estiver sobre ataque
        ParseMoveNotationsProcess(board).execute() // Parse dos movimentos para linguagem PGN
    }
}
```

## Open-Closed Principle

Imagine a situação em que você entregou um software como especificado inicialmente, porém, com o tempo surge uma nova necessidade, muda-se o escopo inicial de algo que antes não tinha, e, sendo assim, você precisará adicionar uma nova regra no código.

Dentro do universo de programação, há diversas maneiras de se chegar a um resultado esperado. Porém, existem as maneiras boas e as maneiras ruins. Esse princípio dita que a melhor maneira é que seu código deve estar aberto para extensões, mas fechado para modificações.

Em outras palavras, o desenvolvimento deve ser incremental, não se deve alterar classes existentes, mas, poder estender as classes para adicionar essas novas funcionalidades. Sendo assim, seguindo um bom padrão de projetos, o desenvolvimento fica mais fluido, fica mais fácil de você poder adicionar novas features sem quebrar as já existentes. 

Dentro do contexto construído, devo lhe dizer que existem diversas maneiras de jogar o xadrez, por exemplo, clássico, blitz, rápida. Mas dentre todas essas variações a única coisa que muda é o tempo de jogo e que já deve ser atendida dentro de uma classe jogo, por exemplo. Mas, existe um jogo que se assemelha bastante com o xadrez chamado de Chess960, com as mesmas mecânicas do xadrez a diferença é que as peças maiores são aleatoriamente colocadas no tabuleiro.

Após o desenvolvimento do xadrez normal, surge a necessidade de eu criar esse modo de jogo. **Estaria quebrando esse princípio** se fizéssemos a alteração da minha classe de tabuleiro para:

```kotlin
class Board {
    // ...
    override fun resetBoard(){
        squares = Array(8, { Array(8, { Square() }) })
        when(board.gameType){
            BoardTypeEnum.CLASSIC -> {
                // Posição inicial das peças no xadrez classico
            }
            BoardTypeEnum.CHESS960 -> {
                // Posição inicial das peças no chess960 (randomico)
            }
        }
    }
}
```

Sendo assim, para cumprir esse princípio , deveríamos extrair uma interface dessa classe Board, e criar uma classe nova para atender a demanda do chess960:

```kotlin
interface IBoard {
    var colorRound: ColorPiece
    var squares: Array<Array<Square>>
    val allPieces: MutableList<IPiece>
    val piecesGroupedByColor: Map<ColorPiece, List<IPiece>>

    fun resetBoard()
}
```

```kotlin
class NormalGameChessBoard: IBoard {

    // ... (Omitindo para deixar somente o relevante)

    override fun resetBoard(){
        // Posição inicial das peças no xadrez clássico
    }
}
```

```kotlin
class NormalGameChess960Board: IBoard {

    // ... (Omitindo para deixar somente o relevante)

    override fun resetBoard(){
        // Posição inicial das peças no chess960
    }
}
```

Caso haja algum outro modo diferente, ou, um tabuleiro mais casas, posso estender novamente a interface `IBoard`, e assim cumprir com o mandamento desse princípio.

## Liskov Substitution Principle

De todos os princípios acredito que esse é o mais assustador de todos de se ler e entender. Sua premissa original diz o seguinte:

> Se para cada objeto x1 do tipo S há um objeto x2 do tipo T de tal forma que, para todos os programas P definidos em termos de T, o comportamento de P não muda quando x1 é substituído por x2 então S é um subtipo de T.

<img src="assets/img/posts/solid/calculando.gif" class="max-width-fixed" alt="Desenho do projeto" width="100%"/>

Essa de fato é assustador, mas o que de fato Barbara Liskov quis dizer com essa citação é bem simples. **Dependa da classe base e não das classes derivadas**. Pegando como exemplo o caso anterior, em que criamos uma interface para os jogos de xadrez clássico e chess960, os movimentos das peças são os mesmos, a forma como é jogado é o mesmo, a única coisa que muda é o início do jogo. Sendo assim, toda a engine construída para processar o tabuleiro de xadrez é útil! Desde que o nosso processo dependa da classe base que no nosso caso é a interface `IBoard`.

Então, se tudo for bem aplicado, começamos a perceber que as vezes um princípio acaba levando ao outro. Existe uma forte relação entre alguns princípios, dentre eles o Open-Closed Principle e o de Liskov Substitution Principle tem uma forte relação entre si.

Então, percebemos que a nossa classe que processa o tabuleiro ela receberá a classe base, aceitando tanto a classe `NormalGameChessBoard` quanto a `NormalGameChess960Board`:

```kotlin
class ProcessNormalChessBoardEngine(private val board: IBoard) {

    fun process(){
        ResetPiecesStatusProcess(board).execute()
        AvailablePieceCoordinatesProcess(board, board.allPieces).execute()
        FilterMovesKingUnderAttackProcess(board).execute()
        ParseMoveNotationsProcess(board).execute()
    }
}
```

## Interface Segregation Principle

Existem peças de xadrez com interações especiais causadas em situações bem específicas. Por exemplo, o peão ao chegar na última casa do seu lado oposto pode promover para qualquer peça maior com exceção do Rei. Outro exemplo, o Rei tem uma interação com a Torre, caso nenhuma das duas peças tenha se mexido e não há nenhum obstáculo entre as duas peças, o rei pode fazer o roque ou roque grande, a depender do lado.

Mas, repare que não são todas as peças que tem uma interação especial. O mesmo pode acontecer na implementação, uma interface não pode forçar uma classe a implementar um atributo ou método que ela não utilizará. 

Sendo assim, no contexto do xadrez, para o projeto, criamos uma interface para as peças:

```kotlin
interface IPiece {

    val cdPiece: String
    val color: ColorPiece
    var allowedMoves: List<SquareCoordanate>
    val pieceMovementTypes: List<IPieceMovement>
    var isUnderProtection: Boolean
    var isUnderAttack: Boolean
    var isDead: Boolean
}
```

Repare que faço uma menção somente dos tipos movimentos que as peças fazem. As peças com movimentos especiais acabam por implementar uma outra interface:

```kotlin
interface IPieceSpecial: IPiece {

    val specialMovementTypes: List<IPieceSpecialMovement>
    var isFirstMove: Boolean
}
```

Repare que também é uma peça, mas que implementa dois atributos que somente interessam para as peças com movimentos especiais.

`OBS: Repare que as peças elas fazem uma lista de movimentos por conta da rainha que no fim das contas seus movimentos é o de torre e bispo, ou seja, ela pode andar na horizontal, vertical e nas diagonais.`

## Dependency Inversion Principle

E, chegamos ao último princípio do SOLID! E desde que começamos a desbravar esse mundo percebemos que muitos dos princípios acabam um levando ao outro. Pois é, esse não será diferente e está um pouco alinhado com o que começamos a desenvolver.

O princípio da inversão de dependência, em suma, diz que uma classe deve depender de uma abstração e não de uma implementação. Afinal, muitas vezes nos deparamos com classes que não precisam saber da implementação da outra na qual depende, como, por exemplo, uma DAO (Data Access Object). Pouco importa para a classe que chama essa DAO, como ela foi implementada, podendo tanto ser o objeto real quanto um Mock (Classe simulada).

Trazendo para o contexto do nosso querido xadrez, trago um exemplo, no momento em que processo o tabuleiro, como já visto, eu passo para a minha classe uma interface de tabuleiro:

```kotlin
class ProcessNormalChessBoardEngine(private val board: IBoard) {

    fun process(){
        ResetPiecesStatusProcess(board).execute()
        AvailablePieceCoordinatesProcess(board, board.allPieces).execute()
        FilterMovesKingUnderAttackProcess(board).execute()
        ParseMoveNotationsProcess(board).execute()
    }
}
```

A ideia é que a minha engine não precisa ter ciência de como o tabuleiro é, por mais que o xadrez original seja em um tabuleiro 8x8, talvez, eu poderia criar um modo novo em um tabuleiro 10x10, por que não? E mesmo eu alterando a quantidade de casas do tabuleiro, o kanachess não falharia, pois independe pra ele como foi implementada esse tabuleiro, estou dependendo da abstração e não da implementação.

## Conclusão

Agora você está pronto para se aventurar tentando aplicar o SOLID no seu dia a dia! Eu lhes digo que o aprendizado é um processo e escrever sobre o assunto me trouxe muitos insights enquanto escrevia o meu código. Confesso que foi bem interessante para mim a experiência. Eu espero que você possa ter aprendido algo com essa postagem sobre o SOLID.

Aplicando-o, tenho visto melhorias bem interessantes na legibilidade do meu código, ficou bem mais enxuto e bem mais entendível e extensível. E faço o mesmo convite, reflita sobre o assunto, tente aplicar mais no seu dia a dia e lhes garanto que será um prazer inestimável ao perceber que seu código a cada dia fica melhor!

Um grande abraço, até a próxima!

`OBS: O projeto do xadrez eu ainda não tive a chance de poder concluir ainda há coisas pendentes a se fazer, mas garanto que nos proximos posts menciono ele e deixo o repositorio pra vocês verem!`