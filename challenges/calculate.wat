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
    ;; SOLVE
  )
)
