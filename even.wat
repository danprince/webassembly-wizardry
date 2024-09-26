(module
  ;; Return 1 if the parameter is even or 0 if it is odd.
  (func (export "even") (param i32) (result i32)
    ;; Bitwise AND with 1 will extract the 1 bit
    (i32.and (local.get 0) (i32.const 1))
    ;; Flip the result with eqz
    i32.eqz
  )
)
