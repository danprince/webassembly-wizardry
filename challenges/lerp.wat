(module
  ;; Linear interpolation between $a and $b by the parameter $t.
  ;;
  ;; For example:
  ;;   lerp(0, 10, 0) => 0
  ;;   lerp(0, 10, 1) => 10
  ;;   lerp(0, 10, 0.5) => 5
  ;;   lerp(0, 10, 1.1) => 11
  ;;   lerp(10, 0, 0.5) => 5
  ;;
  (func (export "lerp") (param $a f64) (param $b f64) (param $t f64) (result f64)
    ;; SOLVE
  )
)
