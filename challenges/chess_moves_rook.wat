(module
  ;; Check if a rook (♖/♜) would be allowed to move from (x0, y0) to (x1, y1)
  ;; on an infinite and empty chess board. Not moving is not a legal move.
  ;;
  ;; Return 1 if the move would be legal, otherwise return 0.
  (func (export "rook") (param $x0 i32) (param $y0 i32) (param $x1 i32) (param $y1 i32) (result i32)
    (local $dx i32)
    (local $dy i32)
    (local.set $dx (i32.sub (local.get $x1) (local.get $x0)))
    (local.set $dy (i32.sub (local.get $y1) (local.get $y0)))

    (i32.or
      ;; x is zero and y is not
      (i32.and
        (i32.eqz (local.get $dx))
        (i32.ne (local.get $dy) (i32.const 0))
      )
      ;; y is zero and x is not
      (i32.and
        (i32.ne (local.get $dx) (i32.const 0))
        (i32.eqz (local.get $dy))
      )
    )
  )
)
