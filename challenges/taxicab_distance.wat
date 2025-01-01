(module
  ;; Return the taxicab distance between x0,y0 and x1,y1.
  ;; https://en.wikipedia.org/wiki/Taxicab_geometry
  (func (export "taxicab") (param $x0 i32) (param $y0 i32) (param $x1 i32) (param $y1 i32) (result i32)
    (i32.add
      (call $abs (i32.sub (local.get $x1) (local.get $x0)))
      (call $abs (i32.sub (local.get $y1) (local.get $y0)))
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
