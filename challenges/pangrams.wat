(module
  (memory (export "memory") 1)

  ;; Check whether the ASCII string in memory is a pangram (uses every letter
  ;; of the alphabet at least once).
  ;;
  ;; Hint: pangrams are not case sensitive.
  (func (export "pangram") (result i32)
    (local $i i32)
    (local $char i32)

    ;; Track whether we've seen a given character by setting the corresponding
    ;; bit here. For example, if we'd seen an `A` or an `a`,  we'd set bit 1.
    ;; For a `Z` or a `z` we'd set bit 26.
    (local $seen i32)

    (loop $loop
      ;; Read the next character from the string.
      (local.set $char
        (call $upper (i32.load8_u (local.get $i)))
      )

      ;; Increment the index
      (local.set $i (i32.add (local.get $i) (i32.const 1)))

      ;; Check if we reached the null byte at the end of the string.
      (if (i32.eqz (local.get $char))
        (then
          (return
            (i32.eq
              (local.get $seen)
              (i32.const 0x3ffffff) ;; 26 bits are set
            )
          )
        )
      )

      ;; If the character is not alphabetic, continue the loop
      (if
        (i32.or
          (i32.lt_u (local.get $char) (i32.const 65)) ;; "A"
          (i32.gt_u (local.get $char) (i32.const 90)) ;; "Z"
        )
        (then (br $loop))
      )

      ;; Shift 1 left by the index of the character within the alphabet then OR
      ;; it into the set of seen bits.
      (local.set $seen
        (i32.or
          (local.get $seen)
          (i32.shl
            (i32.const 1)
            (i32.sub (local.get $char) (i32.const 65))
          )
        )
      )

      (br $loop)
    )

    unreachable
  )

  ;; Convert char to uppercase.
  (func $upper (param $char i32) (result i32)
    (return
      (if (result i32)
        (i32.and
          (i32.ge_u (local.get $char) (i32.const 97)) ;; "a"
          (i32.le_u (local.get $char) (i32.const 122)) ;; "z"
        )
        (then (i32.sub (local.get $char) (i32.const 32)))
        (else (local.get $char))
      )
    )
  )
)
