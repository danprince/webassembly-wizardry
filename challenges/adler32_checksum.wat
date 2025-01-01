(module
  (memory (export "memory") 1)

  (global $adler i32 (i32.const 65521))

  ;; Calculate the Adler-32 checksum of a string.
  ;; https://en.wikipedia.org/wiki/Adler-32
  (func (export "adler32") (result i32)
    (local $i i32)
    (local $char i32)
    (local $a i32)
    (local $b i32)
    (local $sum i32)

    (local.set $a (i32.const 1))
    (local.set $b (i32.const 0))

    (block $sum
      (loop $loop
        (local.set $char (i32.load8_u (local.get $i)))
        (local.set $i (i32.add (local.get $i) (i32.const 1)))

        ;; Break if we're at the end of the string
        (br_if $sum (i32.eqz (local.get $char)))

        (local.set $a
          (i32.rem_u
            (i32.add (local.get $a) (local.get $char))
            (global.get $adler)
          )
        )

        (local.set $b
          (i32.rem_u
            (i32.add (local.get $b) (local.get $a))
            (global.get $adler)
          )
        )

        (br $loop)
      )
    )

    (i32.or
      (i32.shl (local.get $b) (i32.const 16))
      (local.get $a)
    )
  )
)
