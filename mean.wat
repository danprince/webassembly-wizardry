(module
  (memory (export "memory") 1)

  ;; Find the mean of the first $n f32 numbers in memory.
  ;; If $n <= 0, return 0.
  ;;
  ;; See https://en.wikipedia.org/wiki/Arithmetic_mean
  (func (export "mean") (param $n i32) (result f32)
    (local $i i32)
    (local $total f32)

    (if
      (i32.le_s (local.get $n) (i32.const 0)) ;; $n <= 0
      (then (return (f32.const 0)))
    )

    (loop $loop
      (local.set $total
        (f32.add
          (local.get $total)
          ;; Load the f32 at $i * 4 (there are 4 bytes per f32)
          (f32.load (i32.mul (local.get $i) (i32.const 4)))
        )
      )

      (local.set $i (i32.add (local.get $i) (i32.const 1))) ;; $i += 1
      (br_if $loop (i32.lt_s (local.get $i) (local.get $n))) ;; $i < $n
    )

    (f32.div
      (local.get $total)
      (f32.convert_i32_s (local.get $n))
    )
  )
)
