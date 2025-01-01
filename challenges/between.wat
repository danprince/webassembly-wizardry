(module
  ;; Check whether $val is between $a and $b (inclusive).
  ;;
  ;; The range is effectively:
  ;;   min($a, $b) <= $val <= max($a, $b)
  ;;
  ;; Return 1 if $val is within the range.
  ;; Return 0 if not.
  ;;
  (func (export "between") (param $a i32) (param $b i32) (param $val i32) (result i32)
    ;; SOLVE
  )
)
