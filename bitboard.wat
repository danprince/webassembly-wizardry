(module
  (global $rows i32 (i32.const 5))
  (global $cols i32 (i32.const 5))

  ;; Use the $x and $y coordinates to read a single bit from $board, where
  ;; $board is an 5x5 grid of cells, encoded into an i32 in row-major order
  ;; (meaning that only the first 25 bits are in use).
  ;;
  ;; If the requested coordinate is outside of the bitboard, then return -1.
  ;;
  ;; For example, to read $x = 1, $y = 2, you would look up the bit marked with
  ;; an * in the diagram below. The # bits are unused.
  ;;
  ;; 00000
  ;; 00000
  ;; 0*000
  ;; 00000
  ;; 00000
  ;; #####
  ;; ##
  ;;
  (func (export "lookup") (param $board i32) (param $x i32) (param $y i32) (result i32)
    ;; Return early if the coords are not inside the board.
    (if
      (i32.eqz (call $inside (local.get $x) (local.get $y)))
      (then (return (i32.const -1)))
    )

    ;; Shift the board right to move the target bit into the first bit.
    (i32.shr_u
      (local.get $board)
      (call $xy_to_idx (local.get $x) (local.get $y))
    )

    ;; Return the first bit.
    (i32.and (i32.const 1))
  )

  ;; Convert an $x, $y coordinate to an index within a bitboard.
  (func $xy_to_idx (param $x i32) (param $y i32) (result i32)
    (i32.add
      (local.get $x)
      (i32.mul (local.get $y) (global.get $cols))
    )
  )

  ;; Checks whether $x and $y are inside the bounds of the bit board.
  (func $inside (param $x i32) (param $y i32) (result i32)
    (i32.and
      (i32.and
        (i32.ge_s (local.get $x) (i32.const 0))
        (i32.lt_s (local.get $x) (global.get $cols))
      )
      (i32.and
        (i32.ge_s (local.get $y) (i32.const 0))
        (i32.lt_s (local.get $y) (global.get $rows))
      )
    )
  )
)
