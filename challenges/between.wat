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
    (local $min i32)
    (local $max i32)

    (local.set $min
      (select
        (local.get $a)
        (local.get $b)
        (i32.lt_s (local.get $a) (local.get $b))
      )
    )

    (local.set $max
      (select
        (local.get $a)
        (local.get $b)
        (i32.gt_s (local.get $a) (local.get $b))
      )
    )

    (i32.and
      (i32.le_s (local.get $min) (local.get $val))
      (i32.le_s (local.get $val) (local.get $max))
    )
  )
)
