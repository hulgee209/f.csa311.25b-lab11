interface Cell {
  text: string;       // "X", "O", эсвэл ""
  playable: boolean;  // true бол тоглогч дарах боломжтой
  x: number;          // мөрийн индекс
  y: number;          // баганын индекс
}

interface GameState {
  cells: Cell[];         // самбарын нүднүүд
  winner?: string;       // "X", "O", эсвэл undefined
  currentPlayer?: string;// "X" эсвэл "O"
  history?: Cell[][];    // өмнөх төлвүүд (undo-д ашиглагдана)
}

export type { GameState, Cell };
