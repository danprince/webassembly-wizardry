(module
  ;; Check if a pawn (♟/♙) would be allowed to move from (x0,y0) to (x1,y1)
  ;; on an infinite and empty chess board. Not moving is not legal.
  ;;
  ;; Unlike the other pieces, pawns can only move forwards and on our infinite
  ;; chess board, forward is in the _positive_ Y direction.
  ;;
  ;; If a pawn is on the starting row (y = 1) it can legally perform a double
  ;; move.
  ;;
  ;; Return 1 if the move would be legal, otherwise return 0.
  (func (export "pawn") (param $x0 i32) (param $y0 i32) (param $x1 i32) (param $y1 i32) (result i32)
    ;; SOLVE
  )
)
