(module
  ;; Check if a bishop (♝/♗) would be allowed to move from (x0, y0) to (x1, y1)
  ;; on an infinite and empty chess board. Not moving is not a legal move.
  ;;
  ;; Return 1 if the move would be legal, otherwise return 0.
  (func (export "bishop") (param $x0 i32) (param $y0 i32) (param $x1 i32) (param $y1 i32) (result i32)
    (local $dx i32)
    (local $dy i32)
    (local.set $dx (call $abs (i32.sub (local.get $x1) (local.get $x0))))
    (local.set $dy (call $abs (i32.sub (local.get $y1) (local.get $y0))))

    (i32.and
      ;; dx === dy
      (i32.eq (local.get $dx) (local.get $dy))
      ;; dx + dy >= 0
      (i32.gt_s (i32.add (local.get $dx) (local.get $dy)) (i32.const 0))
    )
  )

  (func $abs (param i32) (result i32)
    (if (result i32)
      (i32.lt_s (local.get 0) (i32.const 0))
      (then (i32.sub (i32.const 0) (local.get 0)))
      (else (local.get 0))
    )
  )
)
