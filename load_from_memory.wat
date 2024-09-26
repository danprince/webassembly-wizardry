(module
  (memory (export "memory") 1)

  ;; Loads the nth i32 from memory and returns it.
  ;; Hint: there are 4 bytes in an i32.
  (func (export "load") (param $n i32) (result i32)
    (i32.load (i32.mul (local.get $n) (i32.const 4)))
  )
)
