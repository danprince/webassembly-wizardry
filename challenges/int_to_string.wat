(module
  (memory (export "memory") 1)

  ;; Convert $int to a string in memory.
  (func (export "toString") (param $int i32)
    (local $s i32)
    (local $digit i32)
    (local $char i32)
    (local $neg i32)

    (local.set $neg (i32.lt_s (local.get $int) (i32.const 0)))
    (local.set $int (call $abs (local.get $int)))

    (loop $loop
      (local.set $digit (i32.rem_s (local.get $int) (i32.const 10)))
      (local.set $int (i32.div_s (local.get $int) (i32.const 10)))
      (local.set $char (i32.add (local.get $digit) (i32.const 48)))
      (i32.store8 (local.get $s) (local.get $char))
      (local.set $s (i32.add (local.get $s) (i32.const 1)))
      (br_if $loop (local.get $int))
    )

    ;; Add a minus sign to the end of negative numbers.
    (if (local.get $neg)
      (then
        (i32.store8 (local.get $s) (i32.const 45)) ;; '-'
        (local.set $s (i32.add (local.get $s) (i32.const 1)))
      )
    )

    (call $reverse (local.get $s))
  )

  (func $abs (param i32) (result i32)
    (select
      (local.get 0)
      (i32.sub (i32.const 0) (local.get 0))
      (i32.ge_s (local.get 0) (i32.const 0))
    )
  )

  (func $reverse (param $len i32)
    (local $left_idx i32)
    (local $right_idx i32)
    (local $left_char i32)
    (local $right_char i32)

    (local.set $right_idx (i32.sub (local.get $len) (i32.const 1)))

    (loop $loop
      (local.set $left_char (i32.load8_u (local.get $left_idx)))
      (local.set $right_char (i32.load8_u (local.get $right_idx)))
      (i32.store8 (local.get $left_idx) (local.get $right_char))
      (i32.store8 (local.get $right_idx) (local.get $left_char))
      (local.set $left_idx (i32.add (local.get $left_idx) (i32.const 1)))
      (local.set $right_idx (i32.sub (local.get $right_idx) (i32.const 1)))
      (br_if $loop (i32.lt_s (local.get $left_idx) (local.get $right_idx)))
    )
  )
)
