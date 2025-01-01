(module
  (memory (export "memory") 1)

  ;; Store an i32 at the nth slot in memory.
  ;; Hint: there are 4 bytes in an i32.
  (func (export "store") (param $n i32) (param $value i32)
    (i32.store
      (i32.mul (local.get $n) (i32.const 4))
      (local.get $value)
    )
  )
)
