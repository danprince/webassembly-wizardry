(module
  ;; Raise $x to the power of $y and return the result.
  ;; (You don't need to support negative powers)
  (func (export "pow") (param $x i32) (param $y i32) (result i32)
    (local $i i32)
    (local $n i32)

    (local.set $n (i32.const 1))

    ;; Anything to the power zero is 1. We're also handling negative exponents
    ;; here to avoid infinite loops below.
    (i32.le_s (local.get $y) (i32.const 0))
    if
      i32.const 1
      return
    end

    (loop $loop
      (local.set $n (i32.mul (local.get $n) (local.get $x)))
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $loop (i32.lt_s (local.get $i) (local.get $y)))
    )

    local.get $n
  )
)
