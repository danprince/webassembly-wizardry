(module
  ;; Return the value of the single highest 1 bit in a _u32_ value.
  (func (export "high") (param i32) (result i32)
    (i32.and
      (local.get 0)
      (i32.shr_u
        (i32.const 0x80000000)
        (i32.clz (local.get 0))
      )
    )
  )
)
