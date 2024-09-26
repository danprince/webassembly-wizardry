(module
  (memory (export "memory") 1)

  ;; Hash the ASCII string in memory using the djb2 algorithm and return the
  ;; hash.
  ;;
  ;; References:
  ;; - http://www.cse.yorku.ca/~oz/hash.html
  ;; - https://theartincode.stanis.me/008-djb2/
  (func (export "djb2") (result i32)
    (local $i i32)
    (local $c i32)
    (local $hash i32)

    (local.set $hash (i32.const 5381))

    (loop $loop
      (local.set $c
        (i32.load8_u (local.get $i))
      )

      (if (i32.eqz (local.get $c))
        (then (return (local.get $hash)))
      )

      (local.set $i
        (i32.add
          (local.get $i)
          (i32.const 1)
        )
      )

      (local.set $hash
        (i32.add
          (i32.add
            (i32.shl (local.get $hash) (i32.const 5))
            (local.get $hash)
          )
          (local.get $c)
        )
      )

      br $loop
    )

    unreachable
  )
)
