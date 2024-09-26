(module
  (memory (export "memory") 1)

  ;; Return the length of the null-terminated ASCII string in memory.
  (func (export "strlen") (result i32)
    (local $i i32)

    (loop $loop
      (if (i32.eqz (i32.load8_u (local.get $i)))
        (then (return (local.get $i)))
      )

      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br $loop)
    )

    unreachable
  )
)
