(module
  (memory (export "memory") 1)

  ;; Search for the first instance of $c within the null-terminated ASCII
  ;; string in memory and return the index of the match. If the character
  ;; was not present in the string, return -1.
  (func (export "strchr") (param $c i32) (result i32)
    (local $i i32)
    (local $ch i32)

    (loop $loop
      (local.set $ch (i32.load8_u (local.get $i)))

      ;; Check if we hit the end of the string before finding the char.
      (if (i32.eqz (local.get $ch))
        (then (return (i32.const -1)))
      )

      ;; Check if we found the character we're looking for.
      (if (i32.eq (local.get $ch) (local.get $c))
        (then (return (local.get $i)))
      )

      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br $loop)
    )

    unreachable
  )
)

