(module
  (memory (export "memory") 1)

  ;; Return the number of times $x appears within the first $n i32 values in
  ;; memory. Return 0 if $n <= 0.
  (func (export "counting") (param $n i32) (param $x i32) (result i32)
    (local $i i32)
    (local $count i32)

    ;; Handle $n <= 0 edge case.
    (if
      (i32.le_s (local.get $n) (i32.const 0))
      (then (return (i32.const 0)))
    )

    (loop $loop
      ;; Increment $count if the value at $i equals $x.
      (if
        (i32.eq
          (i32.load (i32.mul (local.get $i) (i32.const 4)))
          (local.get $x)
        )
        (then
          (local.set $count (i32.add (local.get $count) (i32.const 1)))
        )
      )

      ;; Increment $i
      (local.set $i (i32.add (local.get $i) (i32.const 1)))

      ;; Continue if $i < $n
      (br_if $loop (i32.lt_s (local.get $i) (local.get $n)))
    )

    local.get $count
  )
)
