(module
  ;; Returns the nth triangular number.
  ;; Returns 1 when $n <= 0.
  (func (export "triangular") (param $n i32) (result i32)
    (local $i i32)
    (local $val i32)

    (loop $loop
      ;; Increment $val by $i
      (local.set $val (i32.add (local.get $val) (local.get $i)))
      ;; Increment $i by 1
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      ;; Continue if $i <= $n
      (br_if $loop (i32.le_s (local.get $i) (local.get $n)))
    )

    local.get $val
  )
)
