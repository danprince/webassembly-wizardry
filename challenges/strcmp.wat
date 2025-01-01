(module
  (memory (export "memory") 1)

  ;; Check whether two strings are equal, where each parameter is the pointer
  ;; to the first character of a null-terminated ASCII string.
  ;; Return 1 if the strings are equal and 0 if not.
  (func (export "strcmp") (param $str1 i32) (param $str2 i32) (result i32)
    (local $i i32)
    (local $ch1 i32)
    (local $ch2 i32)

    (loop $loop
      (local.set $ch1 (i32.load8_u (i32.add (local.get $str1) (local.get $i))))
      (local.set $ch2 (i32.load8_u (i32.add (local.get $str2) (local.get $i))))

      ;; If the characters are not equal then the strings must be different.
      (if (i32.ne (local.get $ch1) (local.get $ch2))
        (then (return (i32.const 0)))
      )

      ;; If both characters are null bytes it means we reached the end of both
      ;; strings together and are therefore equivalent.
      (if
        (i32.and (i32.eqz (local.get $ch1)) (i32.eqz (local.get $ch2)))
        (then (return (i32.const 1)))
      )

      ;; Otherwise move onto comparing the next character
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br $loop)
    )

    unreachable
  )
)
