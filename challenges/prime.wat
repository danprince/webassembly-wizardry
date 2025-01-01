(module
  ;; Check whether a given number is prime. Return 1 if true, or 0 otherwise.
  (func (export "prime") (param $n i32) (result i32)
    (local $i i32)

    ;; Invert negative numbers for simpler checks
    (if (i32.lt_s (local.get $n) (i32.const 0))
      (then (local.set $n (i32.sub (i32.const 0) (local.get $n))))
    )

    ;; Handle edge cases
    (if (i32.eq (local.get $n) (i32.const 0)) (then (return (i32.const 0))))
    (if (i32.eq (local.get $n) (i32.const 1)) (then (return (i32.const 0))))
    (if (i32.eq (local.get $n) (i32.const 2)) (then (return (i32.const 1))))

    ;; Start looping $i from 2
    (local.set $i (i32.const 2))

    (loop $loop
      ;; Return if $n % $i === 0 (division without remainder)
      (if
        (i32.eqz (i32.rem_s (local.get $n) (local.get $i)))
        (then (return (i32.const 0)))
      )

      ;; $i++
      (local.set $i (i32.add (local.get $i) (i32.const 1)))

      ;; continue if $i < $n
      (br_if $loop (i32.lt_s (local.get $i) (local.get $n)))
    )

    ;; We made it out of the loop, must be a prime
    i32.const 1
  )
)
