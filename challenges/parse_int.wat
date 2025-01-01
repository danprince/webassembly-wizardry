(module
  (memory (export "memory") 1)

  ;; Parse a positive integer from decimal in the first ASCII string in memory
  ;; and return it.
  ;;
  ;; If you find a non-numeric character before reaching the end of the
  ;; string, return -1.
  (func (export "parse") (result i32)
    (local $value i32)
    (local $i i32)
    (local $char i32)
    (local $digit i32)

    (loop $loop
      ;; Read the current char
      (local.set $char (i32.load8_u (local.get $i)))

      ;; Check whether we reached the end of the string
      (if (i32.eqz (local.get $char))
        (then (return (local.get $value)))
      )

      ;; Convert the char to a digit
      (local.set $digit
        (call $char_to_digit (local.get $char))
      )

      ;; If digit was < 0, return -1
      (if (i32.lt_s (local.get $digit) (i32.const 0))
        (then (return (i32.const -1)))
      )

      ;; Shift all parsed digits left by multiplying by 10.
      (local.set $value
        (i32.mul
          (local.get $value)
          (i32.const 10)
        )
      )

      ;; Add digit to value
      (local.set $value
        (i32.add
          (local.get $value)
          (local.get $digit)
        )
      )

      ;; Increment $i
      (local.set $i
        (i32.add
          (local.get $i)
          (i32.const 1)
        )
      )

      (br $loop)
    )

    unreachable
  )

  ;; Convert a char to its digit value. If it is not numeric, instead return -1.
  (func $char_to_digit (param $char i32) (result i32)
    (if
      (i32.and
        (i32.ge_s (local.get $char) (i32.const 48)) ;; 0
        (i32.le_s (local.get $char) (i32.const 57)) ;; 9
      )
      (then
        (return
          (i32.sub
            (local.get $char)
            (i32.const 48)
          )
        )
      )
    )

    ;; Return -1 to signal that $char wasn't a valid digit.
    (return (i32.const -1))
  )
)
