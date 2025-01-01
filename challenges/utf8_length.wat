(module
  (memory (export "memory") 1)

  ;; Return the length of the null-terminated UTF8 string in memory. Some
  ;; unicode characters are represented with multiple bytes, so we can't just
  ;; look for the null-terminator.
  ;;
  ;; Instead we have to parse and count the individual code points. The table
  ;; here is a good reference for understanding the byte representation of
  ;; individual code points: https://en.wikipedia.org/wiki/UTF-8#Description
  (func (export "strlen") (result i32)
    (local $i i32)
    (local $len i32)
    (local $byte i32)

    (loop $loop
      (local.set $byte (i32.load8_u (local.get $i)))

      ;; Check if we reached the end of the string.
      (if (i32.eqz (local.get $byte))
        (then (return (local.get $len)))
      )

      ;; Increment the length
      (local.set $len (i32.add (local.get $len) (i32.const 1)))

      ;; U+010000	to U+10FFFF is encoded with 4 bytes
      (if (i32.ge_u (local.get $byte) (i32.const 0xf0))
        (then
          (local.set $i (i32.add (local.get $i) (i32.const 4)))
          (br $loop)
        )
      )

      ;; U+0800	to U+FFFF is encoded with 3 bytes
      (if (i32.ge_u (local.get $byte) (i32.const 0xe0))
        (then
          (local.set $i (i32.add (local.get $i) (i32.const 3)))
          (br $loop)
        )
      )

      ;; U+0080	to U+07FF is encoded with 2 bytes
      (if (i32.ge_u (local.get $byte) (i32.const 0xc0))
        (then
          (local.set $i (i32.add (local.get $i) (i32.const 2)))
          (br $loop)
        )
      )

      ;; U+0000	to U+007F is encoded with 1 byte
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br $loop)
    )

    unreachable
  )
)
