(module
  ;; Return the result of applying a binary operator to $lhs and $rhs. The
  ;; operators are defined as:
  ;;
  ;; 0x1: +
  ;; 0x2: -
  ;; 0x3: *
  ;; 0x4: /
  ;;
  ;; Return 0 for any other operator.
  ;;
  (func (export "calculate") (param $op i32) (param $lhs i32) (param $rhs i32) (result i32)
    (if (i32.eq (local.get $op) (i32.const 0x1))
      (then (return (i32.add (local.get $lhs) (local.get $rhs))))
    )

    (if (i32.eq (local.get $op) (i32.const 0x2))
      (then (return (i32.sub (local.get $lhs) (local.get $rhs))))
    )

    (if (i32.eq (local.get $op) (i32.const 0x3))
      (then (return (i32.mul (local.get $lhs) (local.get $rhs))))
    )

    (if (i32.eq (local.get $op) (i32.const 0x4))
      (then (return (i32.div_s (local.get $lhs) (local.get $rhs))))
    )

    ;; Return 0 for any other operators.
    i32.const 0
  )
)
