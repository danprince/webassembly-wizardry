(module
  ;; Return the absolute value of an i32.
  ;;
  ;; Using f32.abs is cheating!
  (func (export "abs") (param i32) (result i32)
    (if (result i32)
      (i32.lt_s (local.get 0) (i32.const 0))
      (then (i32.sub (i32.const 0) (local.get 0)))
      (else (local.get 0))
    )
  )
)
