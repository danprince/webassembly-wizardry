(module
  (memory (export "memory") 1)

  ;; Convert the ASCII string in memory to its uppercase equivalent.
  (func (export "uppercase")
    (local $i i32)
    (local $val i32)
    (local $char i32)

    (loop $loop
      ;; Read the first byte of $val.
      (local.set $char (i32.load8_u (local.get $i)))

      ;; Return if we hit the null byte at the end of the string.
      (if (i32.eqz (local.get $char))
        (then (return))
      )

      ;; Increment the loop index
      (local.set $i
        (i32.add (local.get $i) (i32.const 1))
      )

      ;; If the character is not in the lowercase alphabet (a-z) then continue.
      (br_if $loop
        (i32.or
          (i32.lt_u (local.get $char) (i32.const 97))  ;; "a"
          (i32.gt_u (local.get $char) (i32.const 122)) ;; "z"
        )
      )

      ;; Convert the character to its uppercase equivalent.
      (local.set $char
        (i32.sub (local.get $char) (i32.const 32)) ;; a - 32 = A
      )

      ;; Write $char back into memory
      (i32.store8
        (i32.sub (local.get $i) (i32.const 1))
        (local.get $char)
      )

      (br $loop)
    )

    unreachable
  )
)
